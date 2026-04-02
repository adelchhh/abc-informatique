import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('user');

  // Si pas de token ou pas d'utilisateur, rediriger vers login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier que l'utilisateur est admin ou super_admin
  try {
    const userData = JSON.parse(user);
    if (userData.role !== 'admin' && userData.role !== 'super_admin') {
      return <Navigate to="/" replace />;
    }
  } catch (e) {
    return <Navigate to="/login" replace />;
  }

  // Si tout est OK, afficher le contenu
  return children;
}
