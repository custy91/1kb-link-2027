
CREATE TABLE public.links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  target_url TEXT NOT NULL,
  title TEXT,
  kind TEXT NOT NULL DEFAULT 'url',
  fg_color TEXT NOT NULL DEFAULT '#171717',
  bg_color TEXT NOT NULL DEFAULT '#ffffff',
  is_active BOOLEAN NOT NULL DEFAULT true,
  edit_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  referrer TEXT,
  device TEXT,
  browser TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX clicks_link_id_idx ON public.clicks(link_id);
CREATE INDEX clicks_created_at_idx ON public.clicks(created_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.links TO anon, authenticated;
GRANT ALL ON public.links TO service_role;
GRANT SELECT, INSERT ON public.clicks TO anon, authenticated;
GRANT ALL ON public.clicks TO service_role;

ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read links" ON public.links FOR SELECT USING (true);
CREATE POLICY "Anyone can create links" ON public.links FOR INSERT WITH CHECK (true);
CREATE POLICY "Edit key holders can update links" ON public.links FOR UPDATE
  USING (edit_key = current_setting('request.headers', true)::json->>'x-edit-key')
  WITH CHECK (edit_key = current_setting('request.headers', true)::json->>'x-edit-key');
CREATE POLICY "Edit key holders can delete links" ON public.links FOR DELETE
  USING (edit_key = current_setting('request.headers', true)::json->>'x-edit-key');

CREATE POLICY "Anyone can read clicks" ON public.clicks FOR SELECT USING (true);
CREATE POLICY "Anyone can record clicks" ON public.clicks FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER links_touch_updated_at BEFORE UPDATE ON public.links
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
