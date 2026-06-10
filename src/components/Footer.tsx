import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-forest-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-forest-400" />
              <span className="font-display text-lg font-semibold text-forest-100">
                НорильскБук
              </span>
            </div>
            <p className="text-sm text-forest-400 leading-relaxed">
              Издательство книг и календарей о Норильске и Таймыре.
              Северная тема в каждом издании.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-forest-100 font-medium text-sm uppercase tracking-wider mb-3">
              Контакты
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-forest-500 flex-shrink-0" />
                <span>г. Норильск, ул. Богдана Хмельницкого, д. 1, офис 5</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-forest-500 flex-shrink-0" />
                <span>8 (3919) 46-91-14</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-forest-500 flex-shrink-0" />
                <a href="/contact" className="hover:text-forest-100 transition-colors">
                  Напишите нам
                </a>
              </li>
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

        <div className="border-t border-forest-800 mt-8 pt-6 text-center text-xs text-forest-500">
          &copy; {new Date().getFullYear()} НорильскБук. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
