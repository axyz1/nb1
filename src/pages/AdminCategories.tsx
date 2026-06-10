import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category } from '../lib/types';
import CategoryModal from '../components/CategoryModal';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (data) setCategories(data as Category[]);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleSave(data: {
    name: string;
    slug: string;
    description: string;
    sort_order: number;
  }) {
    if (editing) {
      await supabase
        .from('categories')
        .update(data)
        .eq('id', editing.id);
    } else {
      await supabase.from('categories').insert(data);
    }
    setModalOpen(false);
    setEditing(null);
    fetchCategories();
  }

  async function handleDelete(id: string) {
    await supabase.from('categories').delete().eq('id', id);
    setDeleting(null);
    fetchCategories();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-forest-900">
          Категории
        </h1>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Добавить
        </button>
      </div>

      <div className="card divide-y divide-forest-100">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-forest-400">
            Нет категорий. Нажмите «Добавить» для создания.
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between px-5 py-3.5"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm text-forest-400 w-8">#{cat.sort_order}</span>
                <div>
                  <p className="font-medium text-forest-900">{cat.name}</p>
                  <p className="text-sm text-forest-500">
                    /{cat.slug}
                    {cat.description && ` — ${cat.description}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditing(cat);
                    setModalOpen(true);
                  }}
                  className="p-2 text-forest-500 hover:text-forest-800 hover:bg-forest-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {deleting === cat.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="btn-danger text-sm px-3 py-1"
                    >
                      Удалить
                    </button>
                    <button
                      onClick={() => setDeleting(null)}
                      className="btn-secondary text-sm px-3 py-1"
                    >
                      Нет
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleting(cat.id)}
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
        <CategoryModal
          category={editing}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
