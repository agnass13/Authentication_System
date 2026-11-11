import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import { Shield, Database, Lock, Key, CheckCircle, Wifi, WifiOff } from 'lucide-react';

export default function AuthShowcase() {
  const [serverStatus, setServerStatus] = useState({ checked: false, online: false });

  useEffect(() => {
    let isMounted = true;
    const checkApi = async () => {
      const res = await authService.checkHealth();
      if (isMounted) {
        setServerStatus({ checked: true, online: res.online });
      }
    };
    checkApi();
    const interval = setInterval(checkApi, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="auth-showcase-panel">
      {/* Brand Header */}
      <div className="showcase-brand">
        <div className="showcase-logo-icon">
          <Shield size={24} />
        </div>
        <div>
          <h2 className="showcase-brand-title">AuthShield Core</h2>
          <span className="showcase-brand-sub">Production Authentication Architecture</span>
        </div>
      </div>

      {/* Live Backend Connection Indicator */}
      <div className={`status-pill ${serverStatus.online ? 'status-online' : 'status-offline'}`}>
        {serverStatus.online ? (
          <>
            <span className="pulsing-dot" />
            <Wifi size={14} />
            <span>SQLite & API Server: Connected (Port 5000)</span>
          </>
        ) : (
          <>
            <WifiOff size={14} />
            <span>Backend Offline • Run: <code>npm start</code> in backend</span>
          </>
        )}
      </div>

      {/* Architecture Highlights */}
      <div className="showcase-features">
        <div className="showcase-feature-item">
          <div className="feature-icon-box">
            <Lock size={18} />
          </div>
          <div>
            <h4>Bcrypt Salted Hashing</h4>
            <p>10 salt rounds with adaptive computational work factor to defeat rainbow tables.</p>
          </div>
        </div>

        <div className="showcase-feature-item">
          <div className="feature-icon-box">
            <Key size={18} />
          </div>
          <div>
            <h4>Stateless JWT Sessions</h4>
            <p>Cryptographically signed HS256 tokens carrying claims and session expiration.</p>
          </div>
        </div>

        <div className="showcase-feature-item">
          <div className="feature-icon-box">
            <Database size={18} />
          </div>
          <div>
            <h4>SQLite Relational Storage</h4>
            <p>ACID-compliant local database storing unique sanitized user entities.</p>
          </div>
        </div>
      </div>

      {/* College Assignment Badge */}
      <div className="showcase-footer-card">
        <div className="footer-card-tag">Technical Evaluation Spec</div>
        <p>
          Designed for practical demonstration with input validation, protected routing, and secure API contracts.
        </p>
      </div>
    </div>
  );
}
