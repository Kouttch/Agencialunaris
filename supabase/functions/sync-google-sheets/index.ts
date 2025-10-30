import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, sheetUrl } = await req.json();
    console.log('Starting Google Sheets sync for user:', userId);

    // Extract sheet ID from URL
    const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
      throw new Error('Invalid Google Sheets URL');
    }
    const sheetId = sheetIdMatch[1];

    // Função auxiliar para buscar e processar uma aba
    const fetchAndProcessSheet = async (gid: string, reportType: 'daily' | 'weekly' | 'monthly') => {
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
      console.log(`Fetching ${reportType} data from:`, csvUrl);
      
      const response = await fetch(csvUrl);
      
      if (!response.ok) {
        console.error(`${reportType} sheet fetch failed:`, response.status);
        return [];
      }

      const csvText = await response.text();
      const lines = csvText.split('\n');
      const header = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
      
      console.log(`${reportType} Headers:`, header);
      
      const campaignData = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Parse CSV line (handle quoted values)
        const values: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim().replace(/"/g, ''));
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim().replace(/"/g, ''));

        if (values.length < 3) continue;

        // Map columns by header names
        const row: any = {};
        header.forEach((col, idx) => {
          row[col] = values[idx] || '';
        });

        // Parse date (format: DD/MM/YYYY -> YYYY-MM-DD)
        let reportDate = new Date().toISOString().split('T')[0];
        const dateStr = row.date_start || row.date || row.data;
        if (dateStr) {
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            reportDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
        }

        // Parse campaign name
        let campaignName = row.campaign_name || row.campaign || row.campanha || 'Sem nome';
        campaignName = campaignName.replace(/\s+/g, ' ').trim();
        
        // Parse numeric values
        const spend = parseFloat((row.spend || row.amount_spent || row.investimento || '0').toString().replace(',', '.'));
        const impressions = parseInt((row.impressions || row.impressoes || '0').toString());
        const reach = parseInt((row.reach || row.alcance || '0').toString());
        const actions = parseInt((row.actions || row.results || row.resultados || '0').toString());
        const clicks = parseInt((row.link_clicks || row.clicks || row.cliques || '0').toString());
        
        // Calculate metrics
        const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
        const cpc = clicks > 0 ? spend / clicks : 0;
        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
        const costPerResult = actions > 0 ? spend / actions : 0;
        const frequency = reach > 0 ? impressions / reach : 0;

        campaignData.push({
          user_id: userId,
          campaign_name: campaignName,
          reach: reach,
          impressions: impressions,
          frequency: frequency,
          results: actions,
          cost_per_result: costPerResult,
          amount_spent: spend,
          cpm: cpm,
          link_clicks: clicks,
          cpc: cpc,
          ctr: ctr,
          cost_per_conversation: actions > 0 ? costPerResult : null,
          conversations_started: actions,
          week_start: reportDate,
          week_end: reportDate,
          report_type: reportType,
          report_date: reportDate
        });
      }
      
      return campaignData;
    };

    // Buscar as 3 abas: diário (gid=0), semanal (gid=1), mensal (gid=2)
    console.log('Fetching all report types...');
    
    const [dailyData, weeklyData, monthlyData] = await Promise.all([
      fetchAndProcessSheet('0', 'daily'),
      fetchAndProcessSheet('1', 'weekly'),
      fetchAndProcessSheet('2', 'monthly')
    ]);

    const allData = [...dailyData, ...weeklyData, ...monthlyData];
    console.log(`Total records parsed: ${allData.length} (Daily: ${dailyData.length}, Weekly: ${weeklyData.length}, Monthly: ${monthlyData.length})`);

    // Delete old data for this user
    const { error: deleteError } = await supabase
      .from('campaign_data')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting old data:', deleteError);
      throw deleteError;
    }

    // Insert new data
    if (allData.length > 0) {
      const { error: insertError } = await supabase
        .from('campaign_data')
        .insert(allData);

      if (insertError) {
        console.error('Error inserting data:', insertError);
        throw insertError;
      }
    }

    // Update last sync time
    const { error: updateError } = await supabase
      .from('sheets_sync_config')
      .update({ last_sync: new Date().toISOString() })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating sync time:', updateError);
    }

    console.log('Sync completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        recordsProcessed: allData.length,
        breakdown: {
          daily: dailyData.length,
          weekly: weeklyData.length,
          monthly: monthlyData.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-google-sheets:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});