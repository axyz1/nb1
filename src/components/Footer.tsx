import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';
import { useSiteSettings } from '../lib/settings';

export default function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-forest-950 text-forest-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {settings.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={settings.site_title}
                  className="h-8 w-auto object-contain brightness-[0.9]"
                />
              ) : (
                <>
                  <BookOpen className="w-5 h-5 text-forest-400" />
                  <span className="font-display text-lg font-semibold text-forest-100">
                    {settings.site_title}
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-forest-400 leading-relaxed">
              {settings.footer_about}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-forest-100 font-medium text-sm uppercase tracking-wider mb-3">
              Контакты
            </h4>
            <ul className="space-y-2 text-sm">
              {settings.contact_address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-forest-500 flex-shrink-0" />
                  <span>{settings.contact_address}</span>
                </li>
              )}
              {settings.contact_phone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-forest-500 flex-shrink-0" />
                  <span>{settings.contact_phone}</span>
                </li>
              )}
              {settings.contact_email_display && (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-forest-500 flex-shrink-0" />
                  <span>{settings.contact_email_display}</span>
                </li>
              )}
            </ul>
          </div>

          {/* How to buy */}
          <div>
            <h4 className="text-forest-100 font-medium text-sm uppercase tracking-wider mb-3">
              Как купить
            </h4>
            <ol className="space-y-2 text-sm text-forest-400">
              <li className="flex items-start gap-2">
                <span className="text-forest-600 font-semibold">1.</span>
                Выберите продукцию в каталоге
              </li>
              <li className="flex items-start gap-2">
                <span className="text-forest-600 font-semibold">2.</span>
                Заполните форму заказа
              </li>
              <li className="flex items-start gap-2">
                <span className="text-forest-600 font-semibold">3.</span>
                Мы свяжемся с вами для уточнения оплаты и доставки
              </li>
            </ol>
          </div>
        </div>

        <div className="border-t border-forest-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-forest-500">
          <span>&copy; {new Date().getFullYear()} {settings.site_title}. Все права защищены.</span>
          <div className="flex items-center gap-4">
            <Link to="/reviews" className="hover:text-forest-300 transition-colors">Отзывы</Link>
            <Link to="/contact" className="hover:text-forest-300 transition-colors">Контакты</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
