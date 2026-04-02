import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '../css/app.css';
import ClientPage from './components/ClientPage';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { LanguageProvider } from './i18n/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Route publique - Page d'accueil clients */}
          <Route path="/" element={<ClientPage />} />

          {/* Route login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Route protégée - Dashboard admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Route par défaut */}
          <Route path="*" element={<ClientPage />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

// Monter l'application React
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
