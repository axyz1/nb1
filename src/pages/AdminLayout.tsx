import { Outlet, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-50">
        <div className="w-8 h-8 border-2 border-forest-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 bg-forest-50/50 p-6 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
