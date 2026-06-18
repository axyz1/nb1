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
  postcard: 'Открытка',
  calendar_kvart: 'Квартальный',
  calendar_perekid: 'Перекидной',
  calendar_poster: 'Постер',
  painting: 'Картина',
  music: 'Музыка',
  design: 'Дизайн',
  poster: 'Плакат',
};

export const ITEM_TYPE_GROUPS = [
  { label: 'Книги', types: ['book'] as ItemType[] },
  { label: 'Открытки', types: ['postcard'] as ItemType[] },
  {
    label: 'Календари',
    types: ['calendar_kvart', 'calendar_perekid', 'calendar_poster'] as ItemType[],
  },
  { label: 'Другое', types: ['painting', 'music', 'design', 'poster'] as ItemType[] },
];

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  category_id?: string;
  item_type: ItemType;
  author?: string;
  year?: number;
  link?: string;
  sort_order: number;
  price?: number;
  publisher?: string;
  pages?: number;
  category?: Category;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export interface SiteSettings {
  id: number;
  // Contact/functional
  contact_email: string;
  // Appearance
  logo_url?: string;
  banner_url?: string;
  site_title: string;
  banner_title: string;
  banner_subtitle: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  hero_bg_color: string;
  // Text content
  contact_page_title: string;
  contact_page_subtitle: string;
  contact_address: string;
  contact_phone: string;
  contact_email_display: string;
  footer_about: string;
  reviews_page_title: string;
  reviews_page_subtitle: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  author_name: string;
  author_role?: string;
  author_avatar_url?: string;
  content: string;
  rating: number;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}
