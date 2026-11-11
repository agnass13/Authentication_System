import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          backgroundColor: '#090d16',
          color: '#f8fafc',
        }}
      >
        <div className="spinner" style={{ width: '2rem', height: '2rem' }} />
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Verifying security credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and remember the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
