import { useEffect, useState, useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category, ItemType, PortfolioItem } from '../lib/types';
import { ITEM_TYPE_LABELS, ITEM_TYPE_GROUPS } from '../lib/types';
import PortfolioCard from '../components/PortfolioCard';
import { useSiteSettings } from '../lib/settings';

interface Props {
  activeType: ItemType | null;
}

export default function PortfolioPage({ activeType }: Props) {
  const { settings } = useSiteSettings();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [itemsRes, catRes] = await Promise.all([
        supabase
          .from('portfolio_items')
          .select('*, category:categories(*)')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
        supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true }),
      ]);
      if (itemsRes.data) setItems(itemsRes.data as PortfolioItem[]);
      if (catRes.data) setCategories(catRes.data as Category[]);
      setLoading(false);
    }
    fetchData();
  }, []);

  const currentGroup = useMemo(() => {
    if (!activeType) return null;
    return ITEM_TYPE_GROUPS.find((g) => g.types.includes(activeType)) ?? null;
  }, [activeType]);

  const typesToShow = useMemo(() => {
    if (!activeType) return null;
    if (currentGroup && currentGroup.types.length > 1 && currentGroup.types.includes(activeType)) {
      return currentGroup.types;
    }
    return [activeType];
  }, [activeType, currentGroup]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (typesToShow && !typesToShow.includes(item.item_type)) return false;
      if (activeCategory && item.category_id !== activeCategory) return false;
      return true;
    });
  }, [items, typesToShow, activeCategory]);

  const pageTitle = activeType
    ? ITEM_TYPE_LABELS[activeType]
    : 'Каталог';

  const relevantCategories = useMemo(() => {
    if (!typesToShow) return categories;
    return categories.filter((c) => {
      if (c.slug === 'books' && typesToShow.includes('book')) return true;
      if (c.slug === 'postcards' && typesToShow.includes('postcard')) return true;
      if (c.slug.startsWith('calendar') && typesToShow.some((t) => t.startsWith('calendar'))) return true;
      if (c.slug === 'other' && typesToShow.some((t) => ['painting', 'music', 'design', 'poster'].includes(t))) return true;
      return false;
    });
  }, [categories, typesToShow]);

  return (
    <div>
      {/* Hero — only on main page */}
      {!activeType && (
        <section
          className="relative text-white overflow-hidden"
          style={
            settings.banner_url
              ? { backgroundImage: `url(${settings.banner_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { background: `linear-gradient(135deg, ${settings.hero_bg_color ?? '#1a3a0a'}, ${settings.primary_color ?? '#2D5016'})` }
          }
        >
          {settings.banner_url && (
            <div className="absolute inset-0 bg-black/50" />
          )}
          {!settings.banner_url && (
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 -left-20 w-72 h-72 bg-forest-400 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-forest-300 rounded-full blur-3xl" />
            </div>
          )}
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {settings.banner_title}
            </h1>
            <p className="text-forest-200 text-lg md:text-xl max-w-xl leading-relaxed">
              {settings.banner_subtitle}
            </p>
          </div>
        </section>
      )}

      {/* Section title for filtered views */}
      {activeType && (
        <section className="bg-forest-800 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              = {pageTitle} =
            </h1>
          </div>
        </section>
      )}

      {/* Sub-filter for calendars */}
      {activeType && currentGroup && currentGroup.types.length > 1 && (
        <section className="border-b border-forest-200 bg-white/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2">
              {currentGroup.types.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    // This would need a callback — simplified for now
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeType === t
                      ? 'bg-forest-700 text-white'
                      : 'bg-forest-50 text-forest-700 hover:bg-forest-100 border border-forest-200'
                  }`}
                >
                  {ITEM_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category filter */}
      {relevantCategories.length > 0 && (
        <section className="border-b border-forest-200 bg-white/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex flex-wrap items-center gap-2">
              {relevantCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    setActiveCategory(activeCategory === cat.id ? null : cat.id)
                  }
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? 'bg-forest-700 text-white'
                      : 'bg-forest-50 text-forest-700 hover:bg-forest-100 border border-forest-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[3/4] bg-forest-100" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-forest-100 rounded w-3/4" />
                  <div className="h-4 bg-forest-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-forest-300 mx-auto mb-4" />
            <p className="text-forest-500 text-lg">Пока ничего не найдено</p>
            <p className="text-forest-400 text-sm mt-1">Попробуйте изменить фильтры</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
