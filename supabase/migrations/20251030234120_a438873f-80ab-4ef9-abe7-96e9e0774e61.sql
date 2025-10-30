-- Add columns for the 3 sheet GIDs (daily, weekly, monthly)
ALTER TABLE user_dashboards 
ADD COLUMN daily_gid TEXT DEFAULT '0',
ADD COLUMN weekly_gid TEXT DEFAULT '1',
ADD COLUMN monthly_gid TEXT DEFAULT '2';