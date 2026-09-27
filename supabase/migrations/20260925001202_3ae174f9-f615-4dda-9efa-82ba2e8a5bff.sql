ALTER TABLE public.links ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX links_user_id_idx ON public.links(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.links TO authenticated;
GRANT SELECT, INSERT ON public.clicks TO authenticated;
CREATE POLICY "Owners can update links" ON public.links FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can delete links" ON public.links FOR DELETE TO authenticated USING (auth.uid() = user_id);