import { useEffect, useState } from 'react';
import { BookOpen, Calendar, FolderOpen, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category, PortfolioItem } from '../lib/types';

export default function AdminDashboard() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('portfolio_items').select('item_type', { count: 'exact', head: false }),
      supabase.from('categories').select('*', { count: 'exact', head: false }),
    ]).then(([itemsRes, catRes]) => {
      if (itemsRes.data) setItems(itemsRes.data as PortfolioItem[]);
      if (catRes.data) setCategories(catRes.data as Category[]);
    });
  }, []);

  const bookCount = items.filter((i) => i.item_type === 'book').length;
  const calendarCount = items.filter((i) => i.item_type === 'calendar').length;

  const stats = [
    { label: 'Книги', count: bookCount, icon: BookOpen, color: 'bg-forest-100 text-forest-700' },
    { label: 'Календари', count: calendarCount, icon: Calendar, color: 'bg-amber-100 text-amber-700' },
    { label: 'Категории', count: categories.length, icon: FolderOpen, color: 'bg-sky-100 text-sky-700' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-forest-900">Обзор</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-forest-900">{s.count}</p>
                <p className="text-sm text-forest-500">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="/admin/items?type=book"
          className="card p-5 flex items-center gap-4 hover:border-forest-400 group"
        >
          <Plus className="w-5 h-5 text-forest-500 group-hover:text-forest-700" />
          <div>
            <p className="font-medium text-forest-900">Добавить книгу</p>
            <p className="text-sm text-forest-500">Новое книжное издание</p>
          </div>
        </a>
        <a
          href="/admin/items?type=calendar"
          className="card p-5 flex items-center gap-4 hover:border-forest-400 group"
        >
          <Plus className="w-5 h-5 text-forest-500 group-hover:text-forest-700" />
          <div>
            <p className="font-medium text-forest-900">Добавить календарь</p>
            <p className="text-sm text-forest-500">Новый календарный проект</p>
          </div>
        </a>
      </div>
    </div>
  );
}
