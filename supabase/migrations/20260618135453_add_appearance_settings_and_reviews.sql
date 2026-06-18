-- Extend site_settings with logo, banner, colors, and text content
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS banner_title text DEFAULT 'НорильскБук',
  ADD COLUMN IF NOT EXISTS banner_subtitle text DEFAULT 'Издательство, которое создаёт книги с душой',
  ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#2D5016',
  ADD COLUMN IF NOT EXISTS secondary_color text DEFAULT '#4A7C2F',
  ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#8FBF6A',
  ADD COLUMN IF NOT EXISTS hero_bg_color text DEFAULT '#1a3a0a',
  ADD COLUMN IF NOT EXISTS contact_page_title text DEFAULT 'Свяжитесь с нами',
  ADD COLUMN IF NOT EXISTS contact_page_subtitle text DEFAULT 'Мы всегда рады ответить на ваши вопросы',
  ADD COLUMN IF NOT EXISTS contact_address text DEFAULT 'г. Норильск, ул. Примерная, 1',
  ADD COLUMN IF NOT EXISTS contact_phone text DEFAULT '+7 (391) 000-00-00',
  ADD COLUMN IF NOT EXISTS contact_email_display text DEFAULT 'info@norilskbook.ru',
  ADD COLUMN IF NOT EXISTS footer_about text DEFAULT 'Норильское издательство, создающее книги, открытки и календари с 2000 года.',
  ADD COLUMN IF NOT EXISTS site_title text DEFAULT 'НорильскБук',
  ADD COLUMN IF NOT EXISTS reviews_page_title text DEFAULT 'Отзывы',
  ADD COLUMN IF NOT EXISTS reviews_page_subtitle text DEFAULT 'Что говорят наши читатели и партнёры';

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_role text,
  author_avatar_url text,
  content text NOT NULL,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can read published reviews
CREATE POLICY "select_published_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (is_published = true);

-- Only authenticated (admin) can insert
CREATE POLICY "insert_reviews" ON reviews FOR INSERT
  TO authenticated WITH CHECK (true);

-- Only authenticated (admin) can update
CREATE POLICY "update_reviews" ON reviews FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated (admin) can delete
CREATE POLICY "delete_reviews" ON reviews FOR DELETE
  TO authenticated USING (true);

-- Seed site_settings row if not present
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Seed a few sample reviews
INSERT INTO reviews (author_name, author_role, content, rating, sort_order) VALUES
  ('Мария Иванова', 'Читатель', 'Замечательное издательство! Книги высочайшего качества, красивое оформление и внимательный подход к каждому заказу. Рекомендую всем любителям настоящих книг.', 5, 1),
  ('Алексей Петров', 'Партнёр', 'Сотрудничаем с НорильскБуком уже несколько лет. Профессионализм команды и качество изданий на высшем уровне. Всегда в срок и с душой.', 5, 2),
  ('Светлана Козлова', 'Библиотекарь', 'Пополняем фонд библиотеки изданиями НорильскБука. Читатели в восторге от качества полиграфии и богатства содержания.', 5, 3),
  ('Дмитрий Новиков', 'Коллекционер', 'Собираю открытки и календари уже много лет. Продукция НорильскБука выделяется особым вкусом и вниманием к деталям.', 4, 4)
ON CONFLICT DO NOTHING;
