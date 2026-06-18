import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';
import type { SiteSettings } from './types';

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  contact_email: '',
  logo_url: undefined,
  banner_url: undefined,
  site_title: 'НорильскБук',
  banner_title: 'НорильскБук',
  banner_subtitle: 'Издательство, которое создаёт книги с душой',
  primary_color: '#2D5016',
  secondary_color: '#4A7C2F',
  accent_color: '#8FBF6A',
  hero_bg_color: '#1a3a0a',
  contact_page_title: 'Свяжитесь с нами',
  contact_page_subtitle: 'Мы всегда рады ответить на ваши вопросы',
  contact_address: 'г. Норильск, ул. Примерная, 1',
  contact_phone: '+7 (391) 000-00-00',
  contact_email_display: 'info@norilskbook.ru',
  footer_about: 'Норильское издательство, создающее книги, открытки и календари с 2000 года.',
  reviews_page_title: 'Отзывы',
  reviews_page_subtitle: 'Что говорят наши читатели и партнёры',
};

interface SettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
  refresh: () => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  loading: true,
  refresh: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    if (data) setSettings({ ...DEFAULT_SETTINGS, ...data });
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh: load }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SettingsContext);
}
