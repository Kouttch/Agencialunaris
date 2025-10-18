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

    // Fetch data from Google Sheets (using CSV export)
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    console.log('Fetching from URL:', csvUrl);
    
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets fetch failed:', response.status, errorText);
      throw new Error(`Failed to fetch Google Sheets data. Status: ${response.status}. A planilha precisa estar pública (compartilhada com "Qualquer pessoa com o link pode visualizar"). Verifique as configurações de compartilhamento.`);
    }

    const csvText = await response.text();
    console.log('CSV preview (first 500 chars):', csvText.substring(0, 500));
    
    const lines = csvText.split('\n');
    const header = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
    
    console.log('CSV Headers:', header);
    
    // Parse CSV based on actual column names
    const rawCampaignData = [];
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
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      if (values.length < 3) continue;

      // Map columns by header names (case insensitive)
      const row: any = {};
      header.forEach((col, idx) => {
        row[col] = values[idx] || '';
      });

      // Extract date from date_start (format: 26/09/2025 -> 2025-09-26)
      let weekStart = new Date().toISOString().split('T')[0];
      if (row.date_start || row.date) {
        const dateStr = row.date_start || row.date;
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          weekStart = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }

      // Parse campaign name
      const campaignName = row.campaign_name || row.campaign || 'Sem nome';
      
      // Parse numeric values
      const spend = parseFloat(row.spend || row.amount_spent || '0');
      const impressions = parseInt(row.impressions || '0');
      const actions = parseInt(row.actions || row.results || '0');
      
      // Calculate metrics
      const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
      const costPerResult = actions > 0 ? spend / actions : 0;

      rawCampaignData.push({
        user_id: userId,
        campaign_name: campaignName,
        reach: 0, // Not in this spreadsheet format
        impressions: impressions,
        frequency: 0, // Not in this spreadsheet format
        results: actions,
        cost_per_result: costPerResult,
        amount_spent: spend,
        cpm: cpm,
        link_clicks: 0, // Not in this spreadsheet format
        cpc: 0, // Not in this spreadsheet format
        ctr: 0, // Not in this spreadsheet format
        cost_per_conversation: null,
        conversations_started: actions > 0 ? actions : null,
        week_start: weekStart,
        week_end: weekStart
      });
    }

    console.log(`Parsed ${rawCampaignData.length} raw campaign records`);

    // Agrupar campanhas pelo nome e somar as métricas
    const campaignGroups = new Map();
    
    for (const campaign of rawCampaignData) {
      const key = `${campaign.campaign_name}_${campaign.week_start}`;
      
      if (!campaignGroups.has(key)) {
        campaignGroups.set(key, { ...campaign });
      } else {
        const existing = campaignGroups.get(key);
        existing.reach += campaign.reach;
        existing.impressions += campaign.impressions;
        existing.results += campaign.results;
        existing.amount_spent += campaign.amount_spent;
        existing.link_clicks += campaign.link_clicks;
        existing.conversations_started = (existing.conversations_started || 0) + (campaign.conversations_started || 0);
        
        // Recalcular médias ponderadas
        const totalSpent = existing.amount_spent;
        existing.cost_per_result = existing.results > 0 ? totalSpent / existing.results : 0;
        existing.cpm = existing.impressions > 0 ? (totalSpent / existing.impressions) * 1000 : 0;
        existing.cpc = existing.link_clicks > 0 ? totalSpent / existing.link_clicks : 0;
        existing.ctr = existing.impressions > 0 ? (existing.link_clicks / existing.impressions) * 100 : 0;
        existing.frequency = existing.reach > 0 ? existing.impressions / existing.reach : 0;
        existing.cost_per_conversation = existing.conversations_started > 0 ? totalSpent / existing.conversations_started : null;
      }
    }

    const campaignData = Array.from(campaignGroups.values());
    console.log(`Aggregated to ${campaignData.length} unique campaigns`);

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
    if (campaignData.length > 0) {
      const { error: insertError } = await supabase
        .from('campaign_data')
        .insert(campaignData);

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
        recordsProcessed: campaignData.length 
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