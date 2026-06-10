-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Portfolio items table
CREATE TABLE portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  item_type TEXT NOT NULL DEFAULT 'book' CHECK (item_type IN ('book', 'calendar')),
  author TEXT,
  year INT,
  link TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read, authenticated write)
CREATE POLICY "select_categories" ON categories FOR SELECT
  TO public USING (true);

CREATE POLICY "insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

-- Portfolio items policies (public read, authenticated write)
CREATE POLICY "select_portfolio_items" ON portfolio_items FOR SELECT
  TO public USING (true);

CREATE POLICY "insert_portfolio_items" ON portfolio_items FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "update_portfolio_items" ON portfolio_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_portfolio_items" ON portfolio_items FOR DELETE
  TO authenticated USING (true);

-- Insert default categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Книги', 'books', 'Книжные издания', 1),
  ('Календари', 'calendars', 'Календарная продукция', 2);
