import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PortfolioItem } from '../lib/types';
import { ITEM_TYPE_LABELS } from '../lib/types';

interface Props {
  item: PortfolioItem;
}

const placeholderImages = [
  'https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1029147/pexels-photo-1029147.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2908985/pexels-photo-2908985.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1598666/pexels-photo-1598666.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1112563/pexels-photo-1112563.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3748251/pexels-photo-3748251.jpeg?auto=compress&cs=tinysrgb&w=600',
];

function getImage(item: PortfolioItem): string {
  if (item.image_url) return item.image_url;
  const idx =
    item.title.split('').reduce((a, c) => a + c.charCodeAt(0), 0) %
    placeholderImages.length;
  return placeholderImages[idx];
}

const typeBadgeColors: Record<string, string> = {
  book: 'bg-forest-700 text-white',
  postcard: 'bg-rose-600 text-white',
  calendar_kvart: 'bg-amber-600 text-white',
  calendar_perekid: 'bg-amber-700 text-white',
  calendar_poster: 'bg-orange-600 text-white',
  painting: 'bg-violet-700 text-white',
  music: 'bg-sky-600 text-white',
  design: 'bg-teal-600 text-white',
  poster: 'bg-indigo-600 text-white',
};

export default function PortfolioCard({ item }: Props) {
  return (
    <Link
      to={`/item/${item.id}`}
      className="card overflow-hidden group block"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-forest-100">
        <img
          src={getImage(item)}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              typeBadgeColors[item.item_type] ?? 'bg-forest-700 text-white'
            }`}
          >
            {ITEM_TYPE_LABELS[item.item_type]}
          </span>
        </div>
        {item.price && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-forest-900 text-sm font-semibold px-3 py-1 rounded-full">
            {item.price}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-forest-900 mb-1 line-clamp-2">
          {item.title}
        </h3>
        {item.author && (
          <p className="text-sm text-forest-600 mb-0.5">{item.author}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-forest-400 mb-2">
          {item.publisher && <span>{item.publisher}</span>}
          {item.year && <span>{item.year}</span>}
          {item.pages && <span>{item.pages} стр.</span>}
        </div>
        {item.description && (
          <p className="text-sm text-forest-600 line-clamp-2">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
}
