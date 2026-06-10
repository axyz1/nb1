import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ITEM_TYPE_GROUPS } from '../lib/types';
import type { ItemType } from '../lib/types';

interface Props {
  onNavigate: (type: ItemType | null) => void;
  activeType: ItemType | null;
}

export default function Header({ onNavigate, activeType }: Props) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-forest-900 text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group" onClick={() => onNavigate(null)}>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-forest-300 group-hover:text-forest-200 transition-colors" />
              <Calendar className="w-5 h-5 text-forest-400 group-hover:text-forest-300 transition-colors" />
            </div>
            <div>
              <span className="font-display text-lg font-semibold tracking-tight block leading-tight">
                НорильскБук
              </span>
              <span className="text-[10px] text-forest-400 uppercase tracking-widest">
                Издательство
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isAdmin
                  ? 'bg-forest-800 text-white'
                  : 'text-forest-300 hover:text-white hover:bg-forest-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Админ</span>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden p-2 text-forest-300 hover:text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation — catalog sections */}
        <nav
          className={`${
            mobileOpen ? 'block' : 'hidden'
          } sm:block border-t border-forest-800 pb-3 sm:pb-0`}
        >
          <ul className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-1 pt-2 sm:pt-1">
            <li>
              <button
                onClick={() => {
                  onNavigate(null);
                  setMobileOpen(false);
                }}
                className={`w-full text-left px-3 py-2 sm:py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeType === null && !isAdmin
                    ? 'bg-forest-800 text-forest-100'
                    : 'text-forest-300 hover:text-white hover:bg-forest-800/60'
                }`}
              >
                Главная
              </button>
            </li>
            {ITEM_TYPE_GROUPS.map((group) => (
              <li key={group.label} className="group relative">
                {group.types.length === 1 ? (
                  <button
                    onClick={() => {
                      onNavigate(group.types[0]);
                      setMobileOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 sm:py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeType && group.types.includes(activeType) && !isAdmin
                        ? 'bg-forest-800 text-forest-100'
                        : 'text-forest-300 hover:text-white hover:bg-forest-800/60'
                    }`}
                  >
                    {group.label}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onNavigate(group.types[0]);
                        setMobileOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 sm:py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activeType && group.types.includes(activeType) && !isAdmin
                          ? 'bg-forest-800 text-forest-100'
                          : 'text-forest-300 hover:text-white hover:bg-forest-800/60'
                      }`}
                    >
                      {group.label}
                    </button>
                    {/* Sub-items for calendar group on mobile */}
                    <div className="sm:hidden pl-4">
                      {group.types.map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            onNavigate(t);
                            setMobileOpen(false);
                          }}
                          className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                            activeType === t
                              ? 'text-forest-200 bg-forest-800/40'
                              : 'text-forest-400 hover:text-white'
                          }`}
                        >
                          {t === 'calendar_kvart'
                            ? 'Квартальные'
                            : t === 'calendar_perekid'
                            ? 'Перекидные'
                            : 'Постеры'}
                        </button>
                      ))}
                    </div>
                    {/* Desktop dropdown */}
                    <div className="hidden sm:block absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="bg-forest-800 rounded-lg shadow-xl py-1 min-w-[160px]">
                        {group.types.map((t) => (
                          <button
                            key={t}
                            onClick={() => onNavigate(t)}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                              activeType === t
                                ? 'text-forest-200 bg-forest-700'
                                : 'text-forest-300 hover:text-white hover:bg-forest-700'
                            }`}
                          >
                            {t === 'calendar_kvart'
                              ? 'Квартальные'
                              : t === 'calendar_perekid'
                              ? 'Перекидные'
                              : 'Постеры'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
            <li>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 sm:py-1.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/contact'
                    ? 'bg-forest-800 text-forest-100'
                    : 'text-forest-300 hover:text-white hover:bg-forest-800/60'
                }`}
              >
                Связаться
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
