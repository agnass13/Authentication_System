import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { authService } from '../services/api';
import {
  ShieldCheck,
  User,
  Mail,
  Calendar,
  KeyRound,
  CheckCircle,
  Activity,
  Lock,
  Database,
  Terminal,
  FileCode,
  Sparkles,
  Layers,
  Copy,
  Check
} from 'lucide-react';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStats, setSystemStats] = useState(null);
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      const stats = await authService.checkHealth();
      if (isMounted && stats.online) {
        setSystemStats(stats);
      }
    };
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Active Session';

  return (
    <div className="dashboard-page">
      <ThemeSwitcher />
      <Navbar />

      <main className="dashboard-content">
        {/* Welcome Hero Banner */}
        <div className="welcome-banner">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge-pill badge-active">
              <CheckCircle size={12} /> Active Authenticated Session
            </span>
            <span className="badge-pill badge-secure">
              <Lock size={12} /> Bcrypt Salt 10 & JWT (HS256)
            </span>
          </div>
          <h1>Welcome, {user?.name || 'Authorized User'}! 👋</h1>
          <p>
            You have successfully authenticated against the SQLite database backend. Your session is cryptographically signed and guarded by middleware.
          </p>
        </div>

        {/* Dashboard Tab Navigation */}
        <div className="dashboard-tabs">
          <button
            type="button"
            className={`dashboard-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <User size={16} />
            <span>Profile & Overview</span>
          </button>
          <button
            type="button"
            className={`dashboard-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <ShieldCheck size={16} />
            <span>Security & JWT Inspector</span>
          </button>
          <button
            type="button"
            className={`dashboard-tab-btn ${activeTab === 'database' ? 'active' : ''}`}
            onClick={() => setActiveTab('database')}
          >
            <Database size={16} />
            <span>SQLite Database Schema</span>
          </button>
        </div>

        {/* Tab 1: Profile & Overview */}
        {activeTab === 'overview' && (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <div
                  className="stat-icon-box"
                  style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-500)' }}
                >
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div className="stat-title">Access Level</div>
                  <div className="stat-value" style={{ color: 'var(--primary-500)' }}>Authorized User</div>
                </div>
              </div>

              <div className="stat-card">
                <div
                  className="stat-icon-box"
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}
                >
                  <KeyRound size={24} />
                </div>
                <div>
                  <div className="stat-title">Password Protection</div>
                  <div className="stat-value" style={{ color: '#34d399' }}>Bcrypt (10 Rounds)</div>
                </div>
              </div>

              <div className="stat-card">
                <div
                  className="stat-icon-box"
                  style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}
                >
                  <Activity size={24} />
                </div>
                <div>
                  <div className="stat-title">Database Persistence</div>
                  <div className="stat-value" style={{ color: '#a78bfa' }}>SQLite Relational</div>
                </div>
              </div>
            </div>

            <div className="profile-card">
              <div className="profile-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: 'rgba(99, 102, 241, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-500)',
                    }}
                  >
                    <User size={22} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Stored Profile Attributes</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Information loaded from the SQLite users table
                    </p>
                  </div>
                </div>
                <span className="badge-pill badge-active">Active</span>
              </div>

              <table className="profile-table">
                <tbody>
                  <tr>
                    <td>Record ID</td>
                    <td>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                        }}
                      >
                        USER-{user?.id ?? 'DEMO'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Full Name</td>
                    <td>{user?.name || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Email Address</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Mail size={15} color="#94a3b8" />
                        {user?.email || 'N/A'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Registered At</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={15} color="#94a3b8" />
                        {formattedDate}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Password Hash Status</td>
                    <td>
                      <span style={{ color: '#34d399', fontWeight: 600 }}>
                        🔒 Protected (Bcrypt hash safely isolated on server)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Security & JWT Inspector */}
        {activeTab === 'security' && (
          <div className="profile-card">
            <div className="profile-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#c084fc',
                  }}
                >
                  <Lock size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Security & JWT Inspector</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Demonstrates how authentication tokens and headers protect your API
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Active JWT Token (Bearer format attached to Axios headers)
                </span>
                <button
                  type="button"
                  onClick={handleCopyToken}
                  className="btn-secondary"
                  style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
                >
                  {copiedToken ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copiedToken ? 'Copied' : 'Copy Token'}</span>
                </button>
              </div>
              <div className="inspector-code-box" style={{ wordBreak: 'break-all' }}>
                {token || 'No active JWT token found in session'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.92rem', marginBottom: '0.5rem', color: '#818cf8' }}>
                  ✓ Cryptographic Algorithm
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Signed with <strong>HMAC SHA-256 (HS256)</strong> using an environment secret key loaded via dotenv.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.92rem', marginBottom: '0.5rem', color: '#34d399' }}>
                  ✓ Zero Plaintext Passwords
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Passwords are processed through 10 rounds of bcrypt salt before insertion into SQLite, preventing rainbow table attacks.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.92rem', marginBottom: '0.5rem', color: '#fbbf24' }}>
                  ✓ SQL Injection Defense
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  All database queries use parameterized placeholders (<code>?</code>) preventing malicious SQL injection strings.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: SQLite Database Schema */}
        {activeTab === 'database' && (
          <div className="profile-card">
            <div className="profile-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#34d399',
                  }}
                >
                  <Database size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>SQLite Database Architecture</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Schema layout for persistent storage in <code>backend/database/auth.db</code>
                  </p>
                </div>
              </div>
              <span className="badge-pill badge-active">
                Total Users: {systemStats?.database?.total_registered_users ?? '1'}
              </span>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.92rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                SQL Definition Table:
              </h4>
              <div className="inspector-code-box">
{`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div>• <strong>Primary Key:</strong> <code>id</code> (Auto-incrementing integer)</div>
              <div>• <strong>Uniqueness Constraint:</strong> <code>email</code> is strictly unique with <code>COLLATE NOCASE</code> to prevent duplicate registrations with varying capitalization.</div>
              <div>• <strong>Concurrency:</strong> SQLite Write-Ahead Logging (<code>PRAGMA journal_mode = WAL</code>) enabled for high-speed concurrent read/write transactions.</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
