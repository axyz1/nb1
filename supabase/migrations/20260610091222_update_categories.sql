-- Reset and update categories
DELETE FROM categories;

INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Книги', 'books', 'Книжные издания о Норильске и Таймыре', 1),
  ('Открытки', 'postcards', 'Наборы открыток', 2),
  ('Календари', 'calendars', 'Календарная продукция', 3),
  ('Квартальные', 'calendar-kvart', 'Квартальные календари', 4),
  ('Перекидные', 'calendar-perekid', 'Перекидные календари', 5),
  ('Постеры-календари', 'calendar-poster', 'Календари-постеры', 6),
  ('Другое', 'other', 'Картины, музыка, дизайн, постеры', 7);

-- Update existing items to match new category IDs
UPDATE portfolio_items SET category_id = (SELECT id FROM categories WHERE slug = 'books') WHERE item_type = 'book';
UPDATE portfolio_items SET category_id = (SELECT id FROM categories WHERE slug = 'calendar-perekid') WHERE item_type = 'calendar_perekid';
