import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, GripVertical } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Review } from '../lib/types';
import ReviewModal from '../components/ReviewModal';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);

  async function load() {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('sort_order')
      .order('created_at');
    setReviews(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function togglePublish(review: Review) {
    await supabase
      .from('reviews')
      .update({ is_published: !review.is_published })
      .eq('id', review.id);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Удалить отзыв?')) return;
    await supabase.from('reviews').delete().eq('id', id);
    load();
  }

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(review: Review) {
    setEditing(review);
    setModalOpen(true);
  }

  function StarBadge({ n }: { n: number }) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
        {n}
      </span>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-forest-900">Отзывы</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Добавить
        </button>
      </div>

      {loading && <p className="text-forest-400 text-sm">Загрузка...</p>}

      {!loading && reviews.length === 0 && (
        <div className="text-center py-16 text-forest-400">
          <Star className="w-8 h-8 mx-auto mb-2 text-forest-200" />
          <p>Нет отзывов. Добавьте первый.</p>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-xl border p-4 flex gap-4 items-start transition-opacity ${
                review.is_published ? 'border-forest-200' : 'border-forest-100 opacity-60'
              }`}
            >
              <GripVertical className="w-4 h-4 text-forest-300 mt-1 flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-medium text-forest-900 text-sm">
                    {review.author_name}
                  </span>
                  {review.author_role && (
                    <span className="text-xs text-forest-400">— {review.author_role}</span>
                  )}
                  <StarBadge n={review.rating} />
                  {!review.is_published && (
                    <span className="text-xs bg-forest-100 text-forest-500 px-2 py-0.5 rounded-full">
                      Скрыт
                    </span>
                  )}
                </div>
                <p className="text-sm text-forest-600 line-clamp-2">{review.content}</p>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => togglePublish(review)}
                  title={review.is_published ? 'Скрыть' : 'Опубликовать'}
                  className="p-1.5 text-forest-400 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition-colors"
                >
                  {review.is_published ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => openEdit(review)}
                  className="p-1.5 text-forest-400 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <ReviewModal
          review={editing}
          onClose={() => setModalOpen(false)}
          onSave={() => { setModalOpen(false); load(); }}
        />
      )}
    </div>
  );
}
