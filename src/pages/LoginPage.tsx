import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen, Calendar } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message === 'Invalid login credentials'
        ? 'Неверный email или пароль'
        : authError.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-forest-400 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-forest-300 rounded-full blur-3xl" />
      </div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <BookOpen className="w-7 h-7 text-forest-700" />
          <Calendar className="w-6 h-6 text-forest-500" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-center text-forest-900 mb-2">
          Вход в админку
        </h1>
        <p className="text-sm text-forest-500 text-center mb-6">
          Введите email и пароль для управления портфолио
        </p>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-1">Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forest-700 mb-1">Пароль</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}
