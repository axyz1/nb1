import { useEffect, useState } from 'react';
import { Mail, Trash2, Eye, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ContactMessage } from '../lib/types';

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchMessages() {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMessages(data as ContactMessage[]);
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  async function markRead(id: string) {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    fetchMessages();
  }

  async function handleDelete(id: string) {
    await supabase.from('contact_messages').delete().eq('id', id);
    setDeleting(null);
    fetchMessages();
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-semibold text-forest-900">
            Сообщения
          </h1>
          {unreadCount > 0 && (
            <span className="bg-forest-700 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {unreadCount} новых
            </span>
          )}
        </div>
      </div>

      <div className="card divide-y divide-forest-100">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-forest-400">
            <Mail className="w-8 h-8 mx-auto mb-2 text-forest-300" />
            Нет сообщений
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`px-5 py-4 ${!msg.is_read ? 'bg-forest-50/50' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.is_read && (
                      <span className="w-2 h-2 bg-forest-600 rounded-full flex-shrink-0" />
                    )}
                    <span className="font-medium text-forest-900">{msg.name}</span>
                    <span className="text-sm text-forest-400">
                      &lt;{msg.email}&gt;
                    </span>
                  </div>
                  <p className="text-sm text-forest-700 whitespace-pre-wrap break-words">
                    {msg.message}
                  </p>
                  <p className="text-xs text-forest-400 mt-2">
                    {new Date(msg.created_at).toLocaleString('ru-RU')}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!msg.is_read && (
                    <button
                      onClick={() => markRead(msg.id)}
                      className="p-2 text-forest-500 hover:text-forest-800 hover:bg-forest-50 rounded-lg transition-colors"
                      title="Прочитано"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {msg.is_read && (
                    <span className="p-2 text-forest-300">
                      <Eye className="w-4 h-4" />
                    </span>
                  )}
                  {deleting === msg.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="btn-danger text-sm px-3 py-1"
                      >
                        Удалить
                      </button>
                      <button
                        onClick={() => setDeleting(null)}
                        className="btn-secondary text-sm px-3 py-1"
                      >
                        Нет
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleting(msg.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
