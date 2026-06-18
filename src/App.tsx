import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { SettingsProvider } from './lib/settings';
import Header from './components/Header';
import Footer from './components/Footer';
import PortfolioPage from './pages/PortfolioPage';
import ItemPage from './pages/ItemPage';
import ContactPage from './pages/ContactPage';
import ReviewsPage from './pages/ReviewsPage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminCategories from './pages/AdminCategories';
import AdminItems from './pages/AdminItems';
import AdminMessages from './pages/AdminMessages';
import AdminSettings from './pages/AdminSettings';
import AdminAppearance from './pages/AdminAppearance';
import AdminReviews from './pages/AdminReviews';
import type { ItemType } from './lib/types';

function AppRoutes() {
  const location = useLocation();
  const [activeType, setActiveType] = useState<ItemType | null>(null);
  const isPublicPage = !location.pathname.startsWith('/admin') && location.pathname !== '/login';

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
        <Route path="/reviews" element={<div className="flex flex-col min-h-screen"><ReviewsPage /><Footer /></div>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="appearance" element={<AdminAppearance />} />
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
      <SettingsProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}
