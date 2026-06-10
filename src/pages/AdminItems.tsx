import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Image } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category, ItemType, PortfolioItem } from '../lib/types';
import { ITEM_TYPE_LABELS } from '../lib/types';
import ItemModal from '../components/ItemModal';

const VALID_TYPES: ItemType[] = [
  'book', 'postcard', 'calendar_kvart', 'calendar_perekid', 'calendar_poster',
  'painting', 'music', 'design', 'poster',
];

export default function AdminItems() {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type') as ItemType | null;
  const typeFilter: ItemType = typeParam && VALID_TYPES.includes(typeParam) ? typeParam : 'book';

  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchData() {
    const [itemsRes, catRes] = await Promise.all([
      supabase
        .from('portfolio_items')
        .select('*, category:categories(*)')
        .eq('item_type', typeFilter)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    if (itemsRes.data) setItems(itemsRes.data as PortfolioItem[]);
    if (catRes.data) setCategories(catRes.data as Category[]);
  }

  useEffect(() => {
    fetchData();
  }, [typeFilter]);

  async function handleSave(data: Omit<PortfolioItem, 'id' | 'created_at' | 'category'> & { category_id: string | null }) {
    if (editing) {
      await supabase.from('portfolio_items').update(data).eq('id', editing.id);
    } else {
      await supabase.from('portfolio_items').insert(data);
    }
    setModalOpen(false);
    setEditing(null);
    fetchData();
  }

  async function handleDelete(id: string) {
    await supabase.from('portfolio_items').delete().eq('id', id);
    setDeleting(null);
    fetchData();
  }

  const label = ITEM_TYPE_LABELS[typeFilter];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-forest-900">{label}</h1>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Добавить
        </button>
      </div>

      <div className="card divide-y divide-forest-100">
        {items.length === 0 ? (
          <div className="p-8 text-center text-forest-400">
            Нет записей. Нажмите «Добавить» для создания.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
              <div className="w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-forest-100">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-forest-300">
                    <Image className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-forest-900 truncate">{item.title}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {item.author && <span className="text-sm text-forest-600">{item.author}</span>}
                  {item.year && <span className="text-xs text-forest-400">{item.year}</span>}
                  {item.price && <span className="text-xs font-medium text-forest-700">{item.price}</span>}
                  {item.category && (
                    <span className="text-xs bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full">
                      {item.category.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => { setEditing(item); setModalOpen(true); }}
                  className="p-2 text-forest-500 hover:text-forest-800 hover:bg-forest-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {deleting === item.id ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleDelete(item.id)} className="btn-danger text-sm px-3 py-1">Удалить</button>
                    <button onClick={() => setDeleting(null)} className="btn-secondary text-sm px-3 py-1">Нет</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleting(item.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <ItemModal
          item={editing}
          categories={categories}
          defaultType={typeFilter}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
