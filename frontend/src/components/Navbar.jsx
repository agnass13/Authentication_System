import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className="dashboard-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="auth-logo-badge" style={{ width: 36, height: 36, marginBottom: 0 }}>
            <Shield size={20} />
          </div>
          <span>AuthShield</span>
        </div>

        {user && (
          <div className="navbar-user-actions">
            <div className="user-badge">
              <div className="user-avatar-circle" title={user.name}>
                {getInitials(user.name)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.name}</span>
                <span className="user-email" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {user.email}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="btn-danger"
              title="Terminate current session"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
