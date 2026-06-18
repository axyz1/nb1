import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Review } from '../lib/types';
import { useSiteSettings } from '../lib/settings';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-amber-400 fill-amber-400' : 'text-forest-200'
          }`}
        />
      ))}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export default function ReviewsPage() {
  const { settings } = useSiteSettings();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('reviews')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')
      .order('created_at')
      .then(({ data }) => {
        setReviews(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          Доверие наших читателей
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-bold text-forest-900 mb-3">
          {settings.reviews_page_title}
        </h1>
        <p className="text-forest-600 text-lg max-w-xl mx-auto">
          {settings.reviews_page_subtitle}
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-forest-100 rounded w-24 mb-3" />
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-forest-100 rounded w-full" />
                <div className="h-3 bg-forest-100 rounded w-5/6" />
                <div className="h-3 bg-forest-100 rounded w-4/5" />
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-forest-100" />
                <div className="space-y-1">
                  <div className="h-3 bg-forest-100 rounded w-24" />
                  <div className="h-3 bg-forest-100 rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="text-center py-24 text-forest-400">
          <Star className="w-10 h-10 mx-auto mb-3 text-forest-200" />
          <p>Пока нет отзывов.</p>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="card p-6 flex flex-col hover:shadow-lg transition-shadow"
            >
              <Quote className="w-8 h-8 text-forest-200 mb-3 flex-shrink-0" />

              <StarRating rating={review.rating} />

              <p className="text-forest-700 text-sm leading-relaxed mt-3 flex-1">
                {review.content}
              </p>

              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-forest-100">
                {review.author_avatar_url ? (
                  <img
                    src={review.author_avatar_url}
                    alt={review.author_name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-forest-700 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {initials(review.author_name)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-forest-900">{review.author_name}</p>
                  {review.author_role && (
                    <p className="text-xs text-forest-500">{review.author_role}</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* CTA */}
      {!loading && reviews.length > 0 && (
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-950 text-white text-center px-6 py-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            Хотите поделиться впечатлениями?
          </h2>
          <p className="text-forest-300 mb-6 max-w-md mx-auto">
            Напишите нам, и мы разместим ваш отзыв на сайте.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-forest-800 font-semibold px-6 py-2.5 rounded-lg hover:bg-forest-50 transition-colors"
          >
            Написать отзыв
          </a>
        </div>
      )}
    </div>
  );
}
