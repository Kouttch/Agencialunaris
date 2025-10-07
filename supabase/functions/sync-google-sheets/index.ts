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
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Google Sheets data');
    }

    const csvText = await response.text();
    const lines = csvText.split('\n');
    
    // Parse CSV (skip header)
    const campaignData = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.replace(/^"|"$/g, '').trim());
      
      if (values.length < 15) continue;

      campaignData.push({
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

    console.log(`Parsed ${campaignData.length} campaign records`);

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