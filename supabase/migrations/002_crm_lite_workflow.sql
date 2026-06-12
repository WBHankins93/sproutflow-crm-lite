-- Adds the minimum daily-use CRM workflow fields for the lite MVP.

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS follow_up_date DATE;

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS follow_up_date DATE;

CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  body TEXT NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT notes_single_parent CHECK (
    (lead_id IS NOT NULL AND client_id IS NULL) OR
    (lead_id IS NULL AND client_id IS NOT NULL)
  )
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'notes'
      AND policyname = 'Users can read all notes'
  ) THEN
    CREATE POLICY "Users can read all notes" ON public.notes
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'notes'
      AND policyname = 'Users can create notes'
  ) THEN
    CREATE POLICY "Users can create notes" ON public.notes
      FOR INSERT WITH CHECK (auth.uid() = created_by OR created_by IS NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'notes'
      AND policyname = 'Users can update own notes'
  ) THEN
    CREATE POLICY "Users can update own notes" ON public.notes
      FOR UPDATE USING (auth.uid() = created_by);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'notes'
      AND policyname = 'Users can delete own notes'
  ) THEN
    CREATE POLICY "Users can delete own notes" ON public.notes
      FOR DELETE USING (auth.uid() = created_by);
  END IF;
END $$;
