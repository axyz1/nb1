-- Create contact_messages table
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_read BOOLEAN DEFAULT false
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_contact_messages" ON contact_messages FOR INSERT
  TO public WITH CHECK (true);

CREATE POLICY "select_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);
