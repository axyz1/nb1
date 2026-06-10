import { useEffect, useState } from 'react';
import { Settings, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminSettings() {
  const [contactEmail, setContactEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('contact_email')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) setContactEmail(data.contact_email);
        setLoading(false);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!contactEmail.trim()) return;

    setSaving(true);
    setError('');
    setSaved(false);

    const { error: updateError } = await supabase
      .from('site_settings')
      .update({ contact_email: contactEmail.trim(), updated_at: new Date().toISOString() })
      .eq('id', 1);

    if (updateError) {
      setError('Не удалось сохранить настройки');
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-forest-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-forest-600" />
        <h1 className="font-display text-2xl font-semibold text-forest-900">
          Настройки сайта
        </h1>
      </div>

      <div className="card p-6 max-w-xl">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-1">
              Email для получения сообщений
            </label>
            <p className="text-xs text-forest-500 mb-2">
              На этот адрес будут отправляться письма из формы «Связаться».
              Адрес не отображается на сайте.
            </p>
            <input
              type="email"
              className="input-field"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 text-forest-700 text-sm">
              <CheckCircle className="w-4 h-4" />
              Настройки сохранены
            </div>
          )}

          <button
            type="submit"
            disabled={saving || !contactEmail.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </form>
      </div>

      <div className="mt-8 card p-6 max-w-xl">
        <h3 className="font-semibold text-forest-900 mb-3">Отправка писем</h3>
        <p className="text-sm text-forest-600 mb-3">
          Для отправки писем из формы контактов используется Edge Function
          <code className="bg-forest-100 px-1.5 py-0.5 rounded text-forest-800 text-xs ml-1">
            send-contact-email
          </code>
          . Она отправляет письма через Resend API.
        </p>
        <div className="bg-forest-50 border border-forest-200 rounded-lg p-4 text-sm text-forest-700">
          <p className="font-medium mb-2">Чтобы включить отправку писем:</p>
          <ol className="space-y-1 text-forest-600 list-decimal list-inside">
            <li>Зарегистрируйтесь на <strong>resend.com</strong></li>
            <li>Получите API-ключ</li>
            <li>Добавьте секрет <code className="bg-forest-100 px-1 py-0.5 rounded text-xs">RESEND_API_KEY</code> в настройках Edge Functions Supabase</li>
          </ol>
          <p className="mt-3 text-forest-500 text-xs">
            Без API-ключа сообщения сохраняются в базу данных и отображаются в разделе «Сообщения», но email не отправляется.
          </p>
        </div>
      </div>
    </div>
  );
}
