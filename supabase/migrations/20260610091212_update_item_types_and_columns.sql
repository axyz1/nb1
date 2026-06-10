-- Update existing calendar items
UPDATE portfolio_items SET item_type = 'calendar_perekid' WHERE item_type = 'calendar';

-- Add new constraint
ALTER TABLE portfolio_items ADD CONSTRAINT portfolio_items_item_type_check
  CHECK (item_type IN ('book', 'postcard', 'calendar_kvart', 'calendar_perekid', 'calendar_poster', 'painting', 'music', 'design', 'poster'));

-- Add new columns
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS price TEXT;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS publisher TEXT;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS pages INT;
