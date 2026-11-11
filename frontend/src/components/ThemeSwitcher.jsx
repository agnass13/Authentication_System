import React, { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';

const THEMES = [
  {
    id: 'indigo',
    name: 'Cyber Indigo',
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    accent: '#8b5cf6',
    glow: 'rgba(99, 102, 241, 0.4)',
  },
  {
    id: 'cyan',
    name: 'Neon Cyan',
    primary: '#06b6d4',
    primaryDark: '#0891b2',
    accent: '#3b82f6',
    glow: 'rgba(6, 182, 212, 0.4)',
  },
  {
    id: 'emerald',
    name: 'Emerald Vault',
    primary: '#10b981',
    primaryDark: '#059669',
    accent: '#14b8a6',
    glow: 'rgba(16, 185, 129, 0.4)',
  },
  {
    id: 'amber',
    name: 'Sunset Amber',
    primary: '#f59e0b',
    primaryDark: '#d97706',
    accent: '#f97316',
    glow: 'rgba(245, 158, 11, 0.4)',
  },
];

export default function ThemeSwitcher() {
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'indigo';
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const selected = THEMES.find((t) => t.id === activeTheme) || THEMES[0];
    const root = document.documentElement;
    root.style.setProperty('--primary-500', selected.primary);
    root.style.setProperty('--primary-600', selected.primaryDark);
    root.style.setProperty('--primary-glow', selected.glow);
    root.style.setProperty('--accent-purple', selected.accent);
    localStorage.setItem('app_theme', activeTheme);
  }, [activeTheme]);

  return (
    <div style={{ position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 9999 }}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.45rem 0.85rem',
          backgroundColor: 'rgba(17, 24, 39, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '9999px',
          color: '#f8fafc',
          fontSize: '0.8rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease',
        }}
        title="Customize project accent theme"
      >
        <Palette size={14} color="var(--primary-500)" />
        <span style={{ fontSize: '0.75rem' }}>Theme</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '2.5rem',
            right: 0,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '0.6rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            minWidth: '150px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => {
                setActiveTheme(theme.id);
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.6rem',
                border: 'none',
                background: activeTheme === theme.id ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '0.78rem',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: theme.primary,
                  display: 'inline-block',
                }}
              />
              <span>{theme.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
