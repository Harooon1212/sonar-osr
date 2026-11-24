import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Waves, Activity, Cpu, FlaskConical, BookOpen, Database, Users, Sun, Moon } from 'lucide-react';
import { checkBackendHealth } from '../lib/api';

export default function Navigation() {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sonar_theme') || 'slate';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sonar_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'slate' : 'light'));
  };

  useEffect(() => {
    let mounted = true;
    checkBackendHealth().then((res) => {
      if (mounted) {
        setBackendStatus(res.status === 'online' ? 'online' : 'offline');
      }
    });
    const interval = setInterval(() => {
      checkBackendHealth().then((res) => {
        if (mounted) {
          setBackendStatus(res.status === 'online' ? 'online' : 'offline');
        }
      });
    }, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand-section">
          <div className="brand-logo" aria-hidden="true">
            <Waves size={16} strokeWidth={1.5} />
          </div>
          <div>
            <div className="brand-title">SonarOSR</div>
            <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '-1px' }}>
              Acoustic anomaly detection
            </div>
          </div>
          <span className="brand-badge tabular-nums">ARIS 3000</span>
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            Overview
          </NavLink>
          <NavLink to="/demo" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Activity size={15} strokeWidth={1.5} />
            Live demo
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Cpu size={15} strokeWidth={1.5} />
            Benchmark suite
          </NavLink>
          <NavLink to="/lab" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FlaskConical size={15} strokeWidth={1.5} />
            Acoustic lab
          </NavLink>
          <NavLink to="/methods" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BookOpen size={15} strokeWidth={1.5} />
            Methodology
          </NavLink>
          <NavLink to="/dataset" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Database size={15} strokeWidth={1.5} />
            Dataset
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={15} strokeWidth={1.5} />
            Team
          </NavLink>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Dual-Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: 'var(--radius-pill)',
              cursor: 'pointer'
            }}
            title={`Switch to ${theme === 'light' ? 'Slate (Dark)' : 'Laboratory (Light)'} theme`}
          >
            {theme === 'light' ? <Moon size={13} strokeWidth={1.5} /> : <Sun size={13} strokeWidth={1.5} />}
            <span className="font-mono" style={{ fontSize: '11px', textTransform: 'capitalize' }}>
              {theme === 'light' ? 'Slate' : 'Light'}
            </span>
          </button>

          {/* Status badge: reports /api/health with ARIS Explorer 3000 sub-label */}
          <div className="nav-status">
            <span
              className="pulse-dot"
              style={{ backgroundColor: backendStatus === 'online' ? 'var(--highlight-green)' : 'var(--semantic-warning)' }}
            />
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontWeight: 500, color: 'var(--text-bright)', fontSize: '11px' }}>
                {backendStatus === 'online' ? 'Model online' : 'Waking up the model'}
              </div>
              <div style={{ fontSize: '9px', color: 'var(--text-faint)' }}>
                Trained on ARIS Explorer 3000 data
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
