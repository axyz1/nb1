import { useState, useEffect, createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContext {
  user: User | null;
  loading: boolean;
}

const ctx = createContext<AuthContext>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return <ctx.Provider value={{ user, loading }}>{children}</ctx.Provider>;
}

export function useAuth() {
  return useContext(ctx);
}
