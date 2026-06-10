import { useState } from 'react';
import type { Category } from '../lib/types';

interface Props {
  category: Category | null;
  onSave: (data: { name: string; slug: string; description: string; sort_order: number }) => void;
  onClose: () => void;
}

export default function CategoryModal({ category, onSave, onClose }: Props) {
  const [name, setName] = useState(category?.name ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [sortOrder, setSortOrder] = useState(category?.sort_order ?? 0);

  function handleNameChange(val: string) {
    setName(val);
    if (!category) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-zа-яё0-9]+/gi, '-')
          .replace(/^-|-$/g, '')
      );
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;
    onSave({ name: name.trim(), slug: slug.trim(), description, sort_order: sortOrder });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="font-display text-xl font-semibold text-forest-900 mb-5">
          {category ? 'Редактировать категорию' : 'Новая категория'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-1">Название</label>
            <input
              className="input-field"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Книги"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-1">Slug</label>
            <input
              className="input-field"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="books"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-1">Описание</label>
            <textarea
              className="input-field"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-1">Порядок</label>
            <input
              type="number"
              className="input-field"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Отмена
            </button>
            <button type="submit" className="btn-primary">
              {category ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
