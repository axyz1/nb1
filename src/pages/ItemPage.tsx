import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { PortfolioItem } from '../lib/types';
import { ITEM_TYPE_LABELS } from '../lib/types';

const placeholderImages = [
  'https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1029147/pexels-photo-1029147.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2908985/pexels-photo-2908985.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1598666/pexels-photo-1598666.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1112563/pexels-photo-1112563.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3748251/pexels-photo-3748251.jpeg?auto=compress&cs=tinysrgb&w=800',
];

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('portfolio_items')
      .select('*, category:categories(*)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setItem(data as PortfolioItem | null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="animate-pulse flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 aspect-[3/4] bg-forest-100 rounded-xl" />
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-8 bg-forest-100 rounded w-3/4" />
            <div className="h-5 bg-forest-100 rounded w-1/2" />
            <div className="h-4 bg-forest-100 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <BookOpen className="w-12 h-12 text-forest-300 mx-auto mb-4" />
        <p className="text-forest-500 text-lg">Издание не найдено</p>
        <Link to="/" className="btn-secondary mt-4 inline-block">
          На главную
        </Link>
      </div>
    );
  }

  const image = item.image_url
    || placeholderImages[
      item.title.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
        % placeholderImages.length
    ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-forest-600 hover:text-forest-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад в каталог
      </Link>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Image */}
        <div className="w-full md:w-1/2 lg:w-2/5 flex-shrink-0">
          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-forest-100 shadow-lg">
            <img
              src={image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-forest-700 text-white mb-3">
            {ITEM_TYPE_LABELS[item.item_type]}
          </span>

          <h1 className="font-display text-3xl lg:text-4xl font-bold text-forest-900 mb-2 leading-tight">
            {item.title}
          </h1>

          {item.author && (
            <p className="text-lg text-forest-700 mb-1">{item.author}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm text-forest-500 mb-5">
            {item.publisher && <span>{item.publisher}</span>}
            {item.year && <span>{item.year}</span>}
            {item.pages && <span>{item.pages} стр.</span>}
            {item.category && (
              <span className="bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full">
                {item.category.name}
              </span>
            )}
          </div>

          {item.price && (
            <div className="text-2xl font-semibold text-forest-800 mb-5">
              {item.price}
            </div>
          )}

          {item.description && (
            <div className="prose prose-forest max-w-none mb-6">
              <p className="text-forest-700 leading-relaxed">{item.description}</p>
            </div>
          )}

          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              Подробнее <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <div className="mt-8 p-5 bg-forest-50 rounded-xl border border-forest-200">
            <h3 className="font-display font-semibold text-forest-900 mb-2">
              Как заказать
            </h3>
            <p className="text-sm text-forest-600 leading-relaxed">
              Для заказа свяжитесь с нами через страницу{' '}
              <Link to="/contact" className="text-forest-700 underline hover:text-forest-900">
                контактов
              </Link>
              , и мы уточним условия оплаты и доставки.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
