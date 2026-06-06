import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header    from './components/Header';
import Footer    from './components/Footer';
import HomePage      from './pages/HomePage';
import LoginPage     from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage     from './pages/AdminPage';

function Protected({ children }) {
  const { isAuth, ready } = useAuth();
  if (!ready) return <div className="spinner-wrap"><div className="spinner"/></div>;
  return isAuth ? children : <Navigate to="/login" replace />;
}

function Inner() {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'ar');

  useEffect(() => {
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className={`app ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      <Header lang={lang} setLang={setLang} />
      <main className="page">
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/login"     element={<LoginPage />} />
          <Route path="/admin"     element={<AdminPage />} />
          <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <BrowserRouter>
          <Inner />
        </BrowserRouter>
      </AuthProvider>
    </I18nextProvider>
  );
}
