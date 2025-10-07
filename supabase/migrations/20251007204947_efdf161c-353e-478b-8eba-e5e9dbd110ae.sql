-- Create checklist_items table
CREATE TABLE IF NOT EXISTS public.checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  due_date DATE,
  due_time TIME,
  created_by UUID NOT NULL,
  assigned_to UUID,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

-- Admins and moderators can manage all checklist items
CREATE POLICY "Admins can manage all checklist items"
ON public.checklist_items
FOR ALL
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'moderator'::app_role)
);

-- Create trigger for updated_at
CREATE TRIGGER update_checklist_items_updated_at
BEFORE UPDATE ON public.checklist_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_checklist_items_created_by ON public.checklist_items(created_by);
CREATE INDEX idx_checklist_items_assigned_to ON public.checklist_items(assigned_to);
CREATE INDEX idx_checklist_items_due_date ON public.checklist_items(due_date);
CREATE INDEX idx_checklist_items_is_completed ON public.checklist_items(is_completed);