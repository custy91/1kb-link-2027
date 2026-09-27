
CREATE POLICY "Anyone can upload pdfs" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'pdfs');
CREATE POLICY "Anyone can read pdfs" ON storage.objects FOR SELECT
  USING (bucket_id = 'pdfs');
