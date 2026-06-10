import { useState } from 'react';
import type { Category, ItemType, PortfolioItem } from '../lib/types';
import { ITEM_TYPE_LABELS } from '../lib/types';

interface Props {
  item: PortfolioItem | null;
  categories: Category[];
  defaultType: ItemType;
  onSave: (data: Omit<PortfolioItem, 'id' | 'created_at' | 'category'> & { category_id: string | null }) => void;
  onClose: () => void;
}

const ITEM_TYPES = Object.entries(ITEM_TYPE_LABELS) as [ItemType, string][];

export default function ItemModal({ item, categories, defaultType, onSave, onClose }: Props) {
  const [title, setTitle] = useState(item?.title ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? '');
  const [categoryId, setCategoryId] = useState(item?.category_id ?? '');
  const [itemType, setItemType] = useState<ItemType>(item?.item_type ?? defaultType);
  const [author, setAuthor] = useState(item?.author ?? '');
  const [year, setYear] = useState(item?.year?.toString() ?? '');
  const [link, setLink] = useState(item?.link ?? '');
  const [sortOrder, setSortOrder] = useState(item?.sort_order ?? 0);
  const [price, setPrice] = useState(item?.price ?? '');
  const [publisher, setPublisher] = useState(item?.publisher ?? '');
  const [pages, setPages] = useState(item?.pages?.toString() ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description || null,
      image_url: imageUrl || null,
      category_id: categoryId || null,
      item_type: itemType,
      author: author || null,
      year: year ? Number(year) : null,
      link: link || null,
      sort_order: sortOrder,
      price: price || null,
      publisher: publisher || null,
      pages: pages ? Number(pages) : null,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <h2 className="font-display text-xl font-semibold text-forest-900 mb-5">
          {item ? 'Редактировать' : 'Новый элемент'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-forest-700 mb-1">Название *</label>
              <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1">Тип</label>
              <select className="input-field" value={itemType} onChange={(e) => setItemType(e.target.value as ItemType)}>
                {ITEM_TYPES.map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1">Категория</label>
              <select className="input-field" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">— Без категории —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1">Автор</label>
              <input className="input-field" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1">Год</label>
              <input type="number" className="input-field" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1">Издательство</label>
              <input className="input-field" value={publisher} onChange={(e) => setPublisher(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1">Страниц</label>
              <input type="number" className="input-field" value={pages} onChange={(e) => setPages(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1">Цена</label>
              <input className="input-field" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="500 ₽" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-forest-700 mb-1">URL изображения</label>
              <input className="input-field" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-forest-700 mb-1">Описание</label>
              <textarea className="input-field" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-forest-700 mb-1">Ссылка</label>
              <input className="input-field" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1">Порядок</label>
              <input type="number" className="input-field" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Отмена</button>
            <button type="submit" className="btn-primary">{item ? 'Сохранить' : 'Создать'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
