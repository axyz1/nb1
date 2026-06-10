import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import Footer from './components/Footer';
import PortfolioPage from './pages/PortfolioPage';
import ItemPage from './pages/ItemPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminCategories from './pages/AdminCategories';
import AdminItems from './pages/AdminItems';
import AdminMessages from './pages/AdminMessages';
import AdminSettings from './pages/AdminSettings';
import type { ItemType } from './lib/types';

function AppRoutes() {
  const location = useLocation();
  const [activeType, setActiveType] = useState<ItemType | null>(null);
  const isPublicPage = !location.pathname.startsWith('/admin') && location.pathname !== '/login';

  // Reset active type when navigating to non-public pages
  useEffect(() => {
    if (!isPublicPage) setActiveType(null);
  }, [isPublicPage]);

  const { user } = useAuth();
  useEffect(() => {
    if (user && location.pathname === '/login') {
      window.location.href = '/admin';
    }
  }, [user, location.pathname]);

  return (
    <>
      {isPublicPage && <Header onNavigate={setActiveType} activeType={activeType} />}
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col min-h-screen">
              <PortfolioPage activeType={activeType} />
              <Footer />
            </div>
          }
        />
        <Route path="/item/:id" element={<div className="flex flex-col min-h-screen"><ItemPage /><Footer /></div>} />
        <Route path="/contact" element={<div className="flex flex-col min-h-screen"><ContactPage /><Footer /></div>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="items" element={<AdminItems />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
