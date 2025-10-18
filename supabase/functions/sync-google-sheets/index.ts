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
    const lines = csvText.split('\n');
    
    // Parse CSV (skip header)
    const rawCampaignData = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.replace(/^"|"$/g, '').trim());
      
      if (values.length < 15) continue;

      rawCampaignData.push({
        user_id: userId,
        campaign_name: values[0],
        reach: parseInt(values[1]) || 0,
        impressions: parseInt(values[2]) || 0,
        frequency: parseFloat(values[3]) || 0,
        results: parseInt(values[4]) || 0,
        cost_per_result: parseFloat(values[5]) || 0,
        amount_spent: parseFloat(values[6]) || 0,
        cpm: parseFloat(values[7]) || 0,
        link_clicks: parseInt(values[8]) || 0,
        cpc: parseFloat(values[9]) || 0,
        ctr: parseFloat(values[10]) || 0,
        cost_per_conversation: parseFloat(values[11]) || null,
        conversations_started: parseInt(values[12]) || null,
        week_start: values[13] || new Date().toISOString().split('T')[0],
        week_end: values[14] || new Date().toISOString().split('T')[0]
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