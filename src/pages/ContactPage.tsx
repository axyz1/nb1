import { useState, useMemo } from 'react';
import { MapPin, Phone, Mail, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSiteSettings } from '../lib/settings';

function generateCaptcha() {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  return { a, b };
}

export default function ContactPage() {
  const { settings } = useSiteSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [captchaGen, setCaptchaGen] = useState(0);
  const currentCaptcha = useMemo(() => generateCaptcha(), [captchaGen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        'send-contact-email',
        {
          body: {
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            captcha_answer: captchaAnswer.trim(),
            honeypot,
            captcha_a: currentCaptcha.a,
            captcha_b: currentCaptcha.b,
          },
        }
      );

      if (fnError) {
        setError('Не удалось отправить сообщение. Попробуйте позже.');
        return;
      }

      const result = data as { success?: boolean; error?: string };
      if (result?.error) {
        setError(result.error);
        return;
      }

      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
      setCaptchaAnswer('');
      setHoneypot('');
      setCaptchaGen((g) => g + 1);
    } catch {
      setError('Ошибка соединения. Попробуйте позже.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-forest-900 mb-3">
        {settings.contact_page_title}
      </h1>
      <p className="text-forest-600 mb-10 max-w-xl">
        {settings.contact_page_subtitle}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact info */}
        <div className="space-y-6">
          {settings.contact_address && (
            <div className="card p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-forest-100 rounded-lg text-forest-700">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-forest-900 mb-1">Адрес</h3>
                  <p className="text-sm text-forest-600">{settings.contact_address}</p>
                </div>
              </div>
            </div>
          )}

          {settings.contact_phone && (
            <div className="card p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-forest-100 rounded-lg text-forest-700">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-forest-900 mb-1">Телефон</h3>
                  <p className="text-sm text-forest-600">{settings.contact_phone}</p>
                </div>
              </div>
            </div>
          )}

          {settings.contact_email_display && (
            <div className="card p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-forest-100 rounded-lg text-forest-700">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-forest-900 mb-1">Электронная почта</h3>
                  <p className="text-sm text-forest-600">{settings.contact_email_display}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-forest-50 border border-forest-200 rounded-xl p-5">
            <h3 className="font-display font-semibold text-forest-900 mb-2">Как купить</h3>
            <ol className="space-y-2 text-sm text-forest-600">
              <li className="flex items-start gap-2">
                <span className="text-forest-700 font-bold">1.</span>
                Вы выбираете продукцию в каталоге
              </li>
              <li className="flex items-start gap-2">
                <span className="text-forest-700 font-bold">2.</span>
                Заполняете форму заказа или связываетесь с нами
              </li>
              <li className="flex items-start gap-2">
                <span className="text-forest-700 font-bold">3.</span>
                Мы связываемся с вами для уточнения условий оплаты и доставки
              </li>
            </ol>
          </div>
        </div>

        {/* Form */}
        <div className="card p-6">
          <h2 className="font-display text-xl font-semibold text-forest-900 mb-5">
            Написать нам
          </h2>

          {sent && (
            <div className="flex items-start gap-3 bg-forest-100 text-forest-800 text-sm rounded-lg px-4 py-3 mb-5">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Сообщение отправлено!</p>
                <p className="text-forest-600 mt-0.5">Мы свяжемся с вами в ближайшее время.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1">Имя</label>
              <input
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1">Email</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1">Сообщение</label>
              <textarea
                className="input-field"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1">
                Сколько будет {currentCaptcha.a} + {currentCaptcha.b}?
              </label>
              <input
                className="input-field w-32"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                required
                inputMode="numeric"
                autoComplete="off"
              />
            </div>

            <div className="absolute -left-[9999px] opacity-0 h-0 overflow-hidden" aria-hidden="true">
              <label htmlFor="hp_website">Website</label>
              <input
                id="hp_website"
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Отправка...' : 'Отправить'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
