export type ItemType =
  | 'book'
  | 'postcard'
  | 'calendar_kvart'
  | 'calendar_perekid'
  | 'calendar_poster'
  | 'painting'
  | 'music'
  | 'design'
  | 'poster';

export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  book: 'Книга',
  postcard: 'Открытки',
  calendar_kvart: 'Квартальный',
  calendar_perekid: 'Перекидной',
  calendar_poster: 'Постер-календарь',
  painting: 'Картина',
  music: 'Музыка',
  design: 'Дизайн',
  poster: 'Постер',
};

export const ITEM_TYPE_GROUPS: { label: string; types: ItemType[] }[] = [
  { label: 'Книги', types: ['book'] },
  { label: 'Открытки', types: ['postcard'] },
  {
    label: 'Календари',
    types: ['calendar_kvart', 'calendar_perekid', 'calendar_poster'],
  },
  {
    label: 'Другое',
    types: ['painting', 'music', 'design', 'poster'],
  },
];

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category_id: string | null;
  item_type: ItemType;
  author: string | null;
  year: number | null;
  link: string | null;
  sort_order: number;
  created_at: string;
  category?: Category | null;
  price?: string | null;
  publisher?: string | null;
  pages?: number | null;
}
