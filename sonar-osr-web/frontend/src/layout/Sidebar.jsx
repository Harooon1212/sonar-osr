import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  TrendingUp,
  Activity,
  LayoutDashboard,
  FlaskConical,
  BookOpen,
  Database,
  Users,
  Lightbulb,
  Settings,
  Radio,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '../lib/cn';
import { useTheme } from '../store/useTheme';
import EngineStatus from './EngineStatus';

export const PRIMARY_NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard', label: 'Reports', icon: TrendingUp },
  { to: '/demo', label: 'Live Demo', icon: Activity },
  { to: '/lab', label: 'Pipeline Lab', icon: FlaskConical },
  { to: '/methods', label: 'Methods', icon: BookOpen },
  { to: '/dataset', label: 'Dataset', icon: Database },
  { to: '/about', label: 'About', icon: Users },
];

export const SUPPORT_NAV = [
  { to: '/get-started', label: 'Get Started', icon: Lightbulb },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ onNavigate }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col h-full justify-between select-none">
      <div>
        {/* Brand Wordmark */}
        <NavLink
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 mb-7 rounded-control focus-visible:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
            <Radio size={20} strokeWidth={2.2} />
          </div>
          <div className="leading-tight">
            <span className="text-[19px] font-bold tracking-tight text-ink block">
              SONAR<span className="text-primary">OSR</span>
            </span>
            <span className="text-[11px] font-medium text-ink-muted block">
              ARIS Explorer 3000
            </span>
          </div>
        </NavLink>

        {/* Primary Navigation */}
        <nav aria-label="Primary navigation" className="flex flex-col gap-1.5">
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3.5 px-4 h-12 rounded-control text-[15px] font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-primary-soft text-primary font-semibold'
                      : 'text-ink-2 hover:bg-hover hover:text-ink'
                  )
                }
              >
                <Icon size={19} strokeWidth={1.9} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Support Section */}
        <div className="mt-7">
          <div className="px-4 mb-2 text-[14px] font-medium text-ink-muted">Support</div>
          <nav aria-label="Support navigation" className="flex flex-col gap-1.5">
            {SUPPORT_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3.5 px-4 h-12 rounded-control text-[15px] font-medium transition-colors duration-150',
                      isActive
                        ? 'bg-primary-soft text-primary font-semibold'
                        : 'text-ink-2 hover:bg-hover hover:text-ink'
                    )
                  }
                >
                  <Icon size={19} strokeWidth={1.9} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Project / Engine Status Block */}
      <div className="mt-6 pt-5 border-t border-line">
        <div className="flex items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary-soft text-primary font-bold text-sm flex items-center justify-center shrink-0">
              BU
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-ink truncate">
                SonarOSR · BUIC
              </div>
              <EngineStatus />
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="w-9 h-9 rounded-full bg-soft hover:bg-hover border border-line flex items-center justify-center text-ink-2 transition-colors shrink-0"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
