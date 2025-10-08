-- Add recurrence fields to checklist_items table
ALTER TABLE public.checklist_items
ADD COLUMN is_recurring boolean DEFAULT false,
ADD COLUMN recurrence_type text CHECK (recurrence_type IN ('daily', 'weekly', 'monthly', 'custom')),
ADD COLUMN recurrence_days jsonb DEFAULT '[]'::jsonb,
ADD COLUMN recurrence_interval integer DEFAULT 1,
ADD COLUMN last_occurrence_date date;

-- Add comment to explain the recurrence fields
COMMENT ON COLUMN public.checklist_items.is_recurring IS 'Whether this task repeats';
COMMENT ON COLUMN public.checklist_items.recurrence_type IS 'Type of recurrence: daily, weekly, monthly, custom';
COMMENT ON COLUMN public.checklist_items.recurrence_days IS 'Array of days for weekly (0-6) or dates for monthly (1-31)';
COMMENT ON COLUMN public.checklist_items.recurrence_interval IS 'Interval for recurrence (every X days/weeks/months)';
COMMENT ON COLUMN public.checklist_items.last_occurrence_date IS 'Last date this recurring task was completed';