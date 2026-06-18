import { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Review } from '../lib/types';

interface Props {
  review: Review | null;
  onClose: () => void;
  onSave: () => void;
}

export default function ReviewModal({ review, onClose, onSave }: Props) {
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [isPublished, setIsPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (review) {
      setAuthorName(review.author_name);
      setAuthorRole(review.author_role ?? '');
      setAuthorAvatarUrl(review.author_avatar_url ?? '');
      setContent(review.content);
      setRating(review.rating);
      setIsPublished(review.is_published);
      setSortOrder(review.sort_order);
    }
  }, [review]);

  async function handleSave() {
    setError('');
    if (!authorName.trim() || !content.trim()) {
      setError('Заполните имя автора и текст отзыва.');
      return;
    }

    setSaving(true);
    const payload = {
      author_name: authorName.trim(),
      author_role: authorRole.trim() || null,
      author_avatar_url: authorAvatarUrl.trim() || null,
      content: content.trim(),
      rating,
      is_published: isPublished,
      sort_order: sortOrder,
    };

    const { error: dbError } = review
      ? await supabase.from('reviews').update(payload).eq('id', review.id)
      : await supabase.from('reviews').insert(payload);

    setSaving(false);
    if (dbError) { setError(dbError.message); return; }
    onSave();
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-forest-100">
          <h2 className="font-display font-semibold text-forest-900">
            {review ? 'Редактировать отзыв' : 'Добавить отзыв'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-forest-400 hover:text-forest-700 rounded-lg hover:bg-forest-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-forest-700 mb-1">
              Имя автора <span className="text-red-500">*</span>
            </label>
            <input
              className="input-field"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Иван Иванов"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-forest-700 mb-1">Должность / Роль</label>
            <input
              className="input-field"
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              placeholder="Читатель, Партнёр..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-forest-700 mb-1">URL аватара</label>
            <input
              className="input-field"
              value={authorAvatarUrl}
              onChange={(e) => setAuthorAvatarUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-forest-700 mb-1">
              Текст отзыва <span className="text-red-500">*</span>
            </label>
            <textarea
              className="input-field"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-forest-700 mb-2">Оценка</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className="p-0.5 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      n <= rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-forest-200'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-forest-500">{rating} / 5</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-forest-700 mb-1">Порядок</label>
              <input
                type="number"
                className="input-field"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="rv-published"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 accent-forest-700"
              />
              <label htmlFor="rv-published" className="text-sm text-forest-700">
                Опубликован
              </label>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-forest-100 flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">
            Отмена
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
}
