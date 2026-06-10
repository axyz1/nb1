-- Site settings table (single-row config)
CREATE TABLE site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  contact_email TEXT NOT NULL DEFAULT 'admin@norilskbook.ru',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default row
INSERT INTO site_settings (id, contact_email) VALUES (1, 'admin@norilskbook.ru');

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_site_settings" ON site_settings FOR SELECT
  TO public USING (true);

CREATE POLICY "update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
