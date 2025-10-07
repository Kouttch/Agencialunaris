-- Fix function search path by setting it explicitly
CREATE OR REPLACE FUNCTION public.sync_all_google_sheets()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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