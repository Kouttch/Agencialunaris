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

    const { userId, sheetUrl, dashboardId, dailyGid, weeklyGid, monthlyGid } = await req.json();
    console.log('Starting Google Sheets sync for user:', userId, 'dashboard:', dashboardId);
    console.log('GIDs - Daily:', dailyGid, 'Weekly:', weeklyGid, 'Monthly:', monthlyGid);

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

        // Parse dates (format: DD/MM/YYYY -> YYYY-MM-DD)
        let startDate = new Date().toISOString().split('T')[0];
        let endDate = startDate;
        
        const dateStartStr = row['data início'] || row['data inicio'] || row['date_start'];
        if (dateStartStr) {
          const parts = dateStartStr.split('/');
          if (parts.length === 3) {
            startDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
        }

        const dateEndStr = row['data final'] || row['date_end'];
        if (dateEndStr) {
          const parts = dateEndStr.split('/');
          if (parts.length === 3) {
            endDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
        }

        // Parse campaign name
        let campaignName = row['campanha'] || row['campaign'] || row['campaign_name'] || 'Sem nome';
        campaignName = campaignName.replace(/\s+/g, ' ').trim();
        
        // Helper to parse Brazilian currency (R$ 1.234,56)
        const parseCurrency = (value: string) => {
          if (!value) return 0;
          return parseFloat(value.toString().replace(/[R$\s.]/g, '').replace(',', '.'));
        };

        // Helper to parse numbers
        const parseNumber = (value: string) => {
          if (!value) return 0;
          return parseFloat(value.toString().replace(/\./g, '').replace(',', '.'));
        };

        // Parse metrics
        const conversationsStarted = parseInt((row['conversas iniciadas'] || row['conversations_started'] || '0').toString().replace(/\D/g, ''));
        const costPerConversation = parseCurrency(row['custo por conversa (r$)'] || row['cost_per_conversation'] || '0');
        const profileVisits = parseInt((row['visitas ao perfil'] || row['profile_visits'] || '0').toString().replace(/\D/g, ''));
        const costPerVisit = parseCurrency(row['custo por visita (r$)'] || row['cost_per_visit'] || '0');
        const reach = parseInt((row['alcance'] || row['reach'] || '0').toString().replace(/\D/g, ''));
        const impressions = parseInt((row['impressões'] || row['impressoes'] || row['impressions'] || '0').toString().replace(/\D/g, ''));
        const frequency = parseNumber(row['frequência'] || row['frequencia'] || row['frequency'] || '0');
        const dailyBudget = parseCurrency(row['orçamento diário (r$)'] || row['orcamento diario'] || row['daily_budget'] || '0');
        const amountSpent = parseCurrency(row['valor investido (r$)'] || row['amount_spent'] || '0');
        
        // Calculate additional metrics
        const cpm = impressions > 0 ? (amountSpent / impressions) * 1000 : 0;
        const linkClicks = profileVisits; // Using profile visits as clicks
        const cpc = linkClicks > 0 ? amountSpent / linkClicks : 0;
        const ctr = impressions > 0 ? (linkClicks / impressions) * 100 : 0;

        campaignData.push({
          user_id: userId,
          dashboard_id: dashboardId,
          campaign_name: campaignName,
          reach: reach,
          impressions: impressions,
          frequency: frequency,
          results: conversationsStarted,
          cost_per_result: costPerConversation,
          amount_spent: amountSpent,
          cpm: cpm,
          link_clicks: linkClicks,
          cpc: cpc,
          ctr: ctr,
          cost_per_conversation: costPerConversation,
          conversations_started: conversationsStarted,
          profile_visits: profileVisits,
          cost_per_visit: costPerVisit,
          week_start: startDate,
          week_end: endDate,
          report_type: reportType,
          report_date: startDate
        });
      }
      
      return campaignData;
    };

    // Buscar as 3 abas usando os GIDs fornecidos
    console.log('Fetching all report types...');
    
    const [dailyData, weeklyData, monthlyData] = await Promise.all([
      fetchAndProcessSheet(dailyGid || '0', 'daily'),
      fetchAndProcessSheet(weeklyGid || '1', 'weekly'),
      fetchAndProcessSheet(monthlyGid || '2', 'monthly')
    ]);

    const allData = [...dailyData, ...weeklyData, ...monthlyData];
    console.log(`Total records parsed: ${allData.length} (Daily: ${dailyData.length}, Weekly: ${weeklyData.length}, Monthly: ${monthlyData.length})`);

    // Delete old data for this dashboard
    const { error: deleteError } = await supabase
      .from('campaign_data')
      .delete()
      .eq('dashboard_id', dashboardId);

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

    // Update last sync time for dashboard
    const { error: updateError } = await supabase
      .from('user_dashboards')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', dashboardId);

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