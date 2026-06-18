import { NavLink } from 'react-router-dom';
import { LayoutGrid, FolderOpen, BookOpen, Calendar, LogOut, Image, Music, Palette, FileText, Mail, Settings, Layers, Star } from 'lucide-react';
import { ITEM_TYPE_LABELS, ITEM_TYPE_GROUPS } from '../lib/types';
import type { ItemType } from '../lib/types';

interface Props {
  onLogout: () => void;
}

const topNavItems = [
  { to: '/admin', icon: LayoutGrid, label: 'Обзор', end: true },
  { to: '/admin/messages', icon: Mail, label: 'Сообщения', end: false },
  { to: '/admin/reviews', icon: Star, label: 'Отзывы', end: false },
  { to: '/admin/categories', icon: FolderOpen, label: 'Категории', end: false },
  { to: '/admin/appearance', icon: Layers, label: 'Внешний вид', end: false },
  { to: '/admin/settings', icon: Settings, label: 'Настройки', end: false },
];

const contentNavItems = ITEM_TYPE_GROUPS.flatMap((group) =>
  group.types.map((t: ItemType) => ({
    to: `/admin/items?type=${t}`,
    icon:
      t === 'book' ? BookOpen
      : t === 'postcard' ? Image
      : t.startsWith('calendar') ? Calendar
      : t === 'painting' ? Palette
      : t === 'music' ? Music
      : FileText,
    label: ITEM_TYPE_LABELS[t],
    end: false,
  }))
);

export default function AdminSidebar({ onLogout }: Props) {
  return (
    <aside className="w-56 bg-white border-r border-forest-200 flex flex-col min-h-[calc(100vh-4rem)]">
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 mb-1">
          <p className="text-[10px] font-semibold text-forest-400 uppercase tracking-widest px-1 mb-1">
            Управление
          </p>
          {topNavItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5 ${
                  isActive
                    ? 'bg-forest-50 text-forest-800'
                    : 'text-forest-600 hover:bg-forest-50 hover:text-forest-800'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="px-3 mt-3">
          <p className="text-[10px] font-semibold text-forest-400 uppercase tracking-widest px-1 mb-1">
            Каталог
          </p>
          {contentNavItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5 ${
                  isActive
                    ? 'bg-forest-50 text-forest-800'
                    : 'text-forest-600 hover:bg-forest-50 hover:text-forest-800'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      <div className="p-4 border-t border-forest-100">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-sm text-forest-500 hover:text-forest-800 transition-colors w-full px-1"
        >
          <LogOut className="w-4 h-4" />
          Выйти
        </button>
      </div>
    </aside>
  );
}
