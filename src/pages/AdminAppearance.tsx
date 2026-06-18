import { useState, useEffect } from 'react';
import { Save, Upload, Palette, Type, Image, Globe, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { SiteSettings } from '../lib/types';
import { useSiteSettings } from '../lib/settings';

const DEFAULT: Partial<SiteSettings> = {
  logo_url: '',
  banner_url: '',
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

type Tab = 'brand' | 'colors' | 'texts';

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({ label, hint, children }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-forest-700 mb-1">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-forest-400">{hint}</p>}
    </div>
  );
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}

function ColorPicker({ label, value, onChange, hint }: ColorPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-forest-700 mb-1">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded-lg cursor-pointer border border-forest-200 p-0.5 bg-white"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field font-mono text-sm w-36"
          placeholder="#000000"
        />
        <div
          className="w-10 h-10 rounded-lg border border-forest-200 flex-shrink-0"
          style={{ background: value }}
        />
      </div>
      {hint && <p className="mt-1 text-xs text-forest-400">{hint}</p>}
    </div>
  );
}

export default function AdminAppearance() {
  const { refresh } = useSiteSettings();
  const [form, setForm] = useState<Partial<SiteSettings>>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('brand');

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setForm({ ...DEFAULT, ...data });
        setLoading(false);
      });
  }, []);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const { error } = await supabase
      .from('site_settings')
      .update({ ...form, updated_at: new Date().toISOString() })
      .eq('id', 1);
    setSaving(false);
    if (!error) {
      setSaved(true);
      refresh();
      setTimeout(() => setSaved(false), 3000);
    }
  }

  const tabs: { id: Tab; icon: typeof Palette; label: string }[] = [
    { id: 'brand', icon: Image, label: 'Логотип и баннер' },
    { id: 'colors', icon: Palette, label: 'Цвета' },
    { id: 'texts', icon: Type, label: 'Тексты' },
  ];

  if (loading) return <p className="text-forest-400 text-sm">Загрузка...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-forest-500" />
          <h1 className="text-xl font-semibold text-forest-900">Внешний вид</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Сохранено
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {saving ? 'Сохранение...' : 'Сохранить'}
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-forest-50 border border-forest-200 p-1 rounded-xl mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-forest-900 shadow-sm'
                : 'text-forest-500 hover:text-forest-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-forest-200 p-6 space-y-6">
        {/* ─── BRAND ─── */}
        {activeTab === 'brand' && (
          <>
            <h2 className="font-semibold text-forest-800 flex items-center gap-2">
              <Image className="w-4 h-4" /> Логотип и баннер
            </h2>

            <Field
              label="Название сайта"
              hint="Отображается в браузерной вкладке и в шапке, если не загружен логотип"
            >
              <input
                className="input-field"
                value={form.site_title ?? ''}
                onChange={(e) => set('site_title', e.target.value)}
                placeholder="НорильскБук"
              />
            </Field>

            <Field
              label="URL логотипа"
              hint="Прямая ссылка на изображение (PNG/SVG с прозрачным фоном). Рекомендуемая высота — 40 пикселей."
            >
              <div className="flex items-center gap-3">
                <input
                  className="input-field flex-1"
                  value={form.logo_url ?? ''}
                  onChange={(e) => set('logo_url', e.target.value)}
                  placeholder="https://..."
                />
                {form.logo_url && (
                  <img
                    src={form.logo_url}
                    alt="Логотип"
                    className="h-10 rounded border border-forest-200 bg-forest-900 px-2"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                  />
                )}
              </div>
            </Field>

            <div className="border-t border-forest-100 pt-6">
              <h3 className="font-medium text-forest-700 mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4" /> Главный баннер
              </h3>

              <Field
                label="URL фонового изображения баннера"
                hint="Рекомендуется изображение 1920×600 пикселей"
              >
                <div className="space-y-3">
                  <input
                    className="input-field"
                    value={form.banner_url ?? ''}
                    onChange={(e) => set('banner_url', e.target.value)}
                    placeholder="https://images.pexels.com/..."
                  />
                  {form.banner_url && (
                    <div className="rounded-xl overflow-hidden border border-forest-200 aspect-[5/1] bg-forest-100">
                      <img
                        src={form.banner_url}
                        alt="Баннер"
                        className="w-full h-full object-cover"
                        onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                      />
                    </div>
                  )}
                </div>
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Field label="Заголовок баннера">
                  <input
                    className="input-field"
                    value={form.banner_title ?? ''}
                    onChange={(e) => set('banner_title', e.target.value)}
                    placeholder="НорильскБук"
                  />
                </Field>
                <Field label="Подзаголовок баннера">
                  <input
                    className="input-field"
                    value={form.banner_subtitle ?? ''}
                    onChange={(e) => set('banner_subtitle', e.target.value)}
                    placeholder="Издательство, которое создаёт книги с душой"
                  />
                </Field>
              </div>
            </div>
          </>
        )}

        {/* ─── COLORS ─── */}
        {activeTab === 'colors' && (
          <>
            <h2 className="font-semibold text-forest-800 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Цветовая палитра
            </h2>
            <p className="text-sm text-forest-500">
              Изменения цветов сохраняются в базе и применяются ко всем страницам сайта через CSS-переменные.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ColorPicker
                label="Основной цвет"
                value={form.primary_color ?? '#2D5016'}
                onChange={(v) => set('primary_color', v)}
                hint="Кнопки, акценты, активные элементы"
              />
              <ColorPicker
                label="Дополнительный цвет"
                value={form.secondary_color ?? '#4A7C2F'}
                onChange={(v) => set('secondary_color', v)}
                hint="Ссылки, второстепенные акценты"
              />
              <ColorPicker
                label="Акцентный цвет"
                value={form.accent_color ?? '#8FBF6A'}
                onChange={(v) => set('accent_color', v)}
                hint="Бейджи, выделения, тонкие акценты"
              />
              <ColorPicker
                label="Фон шапки / Hero"
                value={form.hero_bg_color ?? '#1a3a0a'}
                onChange={(v) => set('hero_bg_color', v)}
                hint="Тёмный фон навигации и баннера"
              />
            </div>

            {/* Preview swatch */}
            <div className="mt-2 rounded-xl overflow-hidden border border-forest-100">
              <div
                className="h-14 flex items-center justify-between px-6 text-white"
                style={{ background: form.hero_bg_color ?? '#1a3a0a' }}
              >
                <span className="font-semibold">{form.site_title || 'Сайт'}</span>
                <div className="flex gap-3 text-sm opacity-70">
                  <span>Каталог</span><span>Контакты</span>
                </div>
              </div>
              <div className="h-10 flex items-center gap-3 px-6 bg-white">
                <span
                  className="text-sm font-medium px-3 py-1 rounded-full text-white"
                  style={{ background: form.primary_color ?? '#2D5016' }}
                >
                  Кнопка
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: form.secondary_color ?? '#4A7C2F' }}
                >
                  Ссылка
                </span>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                  style={{ background: form.accent_color ?? '#8FBF6A' }}
                >
                  Бейдж
                </span>
              </div>
            </div>
          </>
        )}

        {/* ─── TEXTS ─── */}
        {activeTab === 'texts' && (
          <>
            <h2 className="font-semibold text-forest-800 flex items-center gap-2">
              <Type className="w-4 h-4" /> Тексты страниц
            </h2>

            {/* Contact page */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-forest-500 uppercase tracking-wider">
                Страница «Контакты»
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Заголовок страницы">
                  <input
                    className="input-field"
                    value={form.contact_page_title ?? ''}
                    onChange={(e) => set('contact_page_title', e.target.value)}
                  />
                </Field>
                <Field label="Подзаголовок страницы">
                  <input
                    className="input-field"
                    value={form.contact_page_subtitle ?? ''}
                    onChange={(e) => set('contact_page_subtitle', e.target.value)}
                  />
                </Field>
                <Field label="Адрес">
                  <input
                    className="input-field"
                    value={form.contact_address ?? ''}
                    onChange={(e) => set('contact_address', e.target.value)}
                  />
                </Field>
                <Field label="Телефон">
                  <input
                    className="input-field"
                    value={form.contact_phone ?? ''}
                    onChange={(e) => set('contact_phone', e.target.value)}
                  />
                </Field>
                <Field label="Отображаемый email">
                  <input
                    className="input-field"
                    value={form.contact_email_display ?? ''}
                    onChange={(e) => set('contact_email_display', e.target.value)}
                  />
                </Field>
              </div>
            </div>

            {/* Footer */}
            <div className="space-y-4 border-t border-forest-100 pt-6">
              <h3 className="text-sm font-medium text-forest-500 uppercase tracking-wider">
                Подвал (Footer)
              </h3>
              <Field label="О компании (краткое описание)">
                <textarea
                  className="input-field"
                  rows={3}
                  value={form.footer_about ?? ''}
                  onChange={(e) => set('footer_about', e.target.value)}
                />
              </Field>
            </div>

            {/* Reviews page */}
            <div className="space-y-4 border-t border-forest-100 pt-6">
              <h3 className="text-sm font-medium text-forest-500 uppercase tracking-wider">
                Страница «Отзывы»
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Заголовок">
                  <input
                    className="input-field"
                    value={form.reviews_page_title ?? ''}
                    onChange={(e) => set('reviews_page_title', e.target.value)}
                  />
                </Field>
                <Field label="Подзаголовок">
                  <input
                    className="input-field"
                    value={form.reviews_page_subtitle ?? ''}
                    onChange={(e) => set('reviews_page_subtitle', e.target.value)}
                  />
                </Field>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
