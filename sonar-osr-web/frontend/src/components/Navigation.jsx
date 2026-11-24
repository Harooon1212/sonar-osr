import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Waves, Activity, Cpu, FlaskConical, BookOpen, Database, Users } from 'lucide-react';
import { checkBackendHealth } from '../lib/api';

export default function Navigation() {
  const [backendStatus, setBackendStatus] = useState('checking');

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
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '-1px' }}>
              Acoustic Anomaly Detection
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
            Live Demo
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Cpu size={15} strokeWidth={1.5} />
            Benchmark Suite
          </NavLink>
          <NavLink to="/lab" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FlaskConical size={15} strokeWidth={1.5} />
            Acoustic Lab
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

        <div className="nav-status">
          <span
            className="pulse-dot"
            style={{ backgroundColor: backendStatus === 'online' ? 'var(--semantic-positive)' : 'var(--semantic-warning)' }}
          />
          <span>{backendStatus === 'online' ? 'Inference engine active' : 'Fallback / Standby'}</span>
        </div>
      </div>
    </header>
  );
}
