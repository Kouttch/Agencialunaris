-- Enable pg_cron and pg_net extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create a function to sync all configured sheets
CREATE OR REPLACE FUNCTION public.sync_all_google_sheets()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sync_record RECORD;
BEGIN
  -- Loop through all sync configurations
  FOR sync_record IN 
    SELECT user_id, sheet_url 
    FROM public.sheets_sync_config
  LOOP
    -- Call the edge function for each configuration
    PERFORM net.http_post(
      url := 'https://urrctozczprwjfyqogmw.supabase.co/functions/v1/sync-google-sheets',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'userId', sync_record.user_id,
        'sheetUrl', sync_record.sheet_url
      )
    );
  END LOOP;
END;
$$;

-- Schedule the sync function to run every Monday at 5:00 AM
SELECT cron.schedule(
  'sync-google-sheets-weekly',
  '0 5 * * 1', -- Every Monday at 5:00 AM
  $$
  SELECT public.sync_all_google_sheets();
  $$
);