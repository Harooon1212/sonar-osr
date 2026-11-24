import React from 'react';
import { Sun, Moon, Sliders, Server, Sparkles } from 'lucide-react';
import PageHeader from '../layout/PageHeader';
import { Card, CardHeader } from '../ui/Card';
import EngineStatus from '../layout/EngineStatus';
import { useTheme } from '../store/useTheme';
import { useSettings } from '../store/useSettings';
import { API_BASE } from '../lib/api';
import { cn } from '../lib/cn';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { defaultTau, reducedMotion, setDefaultTau, setReducedMotion } = useSettings();

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Customize appearance, default inference threshold, motion preferences, and inspect backend configuration"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Appearance Theme"
            subtitle="Persists in localStorage (key: sonar_theme)"
          />
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={cn(
                'p-4 rounded-control border flex items-center gap-3 text-left transition-all',
                theme === 'light'
                  ? 'border-primary bg-primary-soft/60 text-primary font-semibold'
                  : 'border-line bg-soft text-ink-2 hover:bg-hover'
              )}
            >
              <Sun size={18} />
              <div>
                <div className="text-sm">Light</div>
                <div className="text-[11px] opacity-75">Reports default</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={cn(
                'p-4 rounded-control border flex items-center gap-3 text-left transition-all',
                theme === 'dark'
                  ? 'border-primary bg-primary-soft/60 text-primary font-semibold'
                  : 'border-line bg-soft text-ink-2 hover:bg-hover'
              )}
            >
              <Moon size={18} />
              <div>
                <div className="text-sm">Dark</div>
                <div className="text-[11px] opacity-75">Low-light console</div>
              </div>
            </button>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Default Open-Set Threshold (τ)"
            subtitle="Initial threshold loaded in Live Demo"
            right={
              <span className="font-mono text-sm font-bold text-primary">
                {defaultTau.toFixed(2)}
              </span>
            }
          />
          <div className="flex items-center gap-3">
            <Sliders size={16} className="text-ink-muted shrink-0" />
            <input
              type="range"
              min={0.1}
              max={0.9}
              step={0.01}
              value={defaultTau}
              onChange={(e) => setDefaultTau(Number(e.target.value))}
              aria-label="Default threshold tau"
              className="sonar-slider"
            />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Accessibility & Motion"
            subtitle="Disable non-essential animations and number count-ups"
            right={<Sparkles size={16} className="text-primary" />}
          />
          <label className="flex items-center justify-between gap-4 p-3.5 rounded-control bg-soft border border-line cursor-pointer">
            <div>
              <div className="text-sm font-semibold text-ink">Reduced Motion</div>
              <div className="text-xs text-ink-muted">Also respects OS prefers-reduced-motion</div>
            </div>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(e) => setReducedMotion(e.target.checked)}
              className="w-5 h-5 accent-primary rounded"
            />
          </label>
        </Card>

        <Card>
          <CardHeader
            title="Backend Engine Connection"
            subtitle="FastAPI inference & physics service"
            right={<Server size={16} className="text-primary" />}
          />
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-control bg-soft border border-line flex items-center justify-between">
              <span className="text-ink-muted">API Base URL</span>
              <code className="font-mono font-semibold text-ink">{API_BASE}</code>
            </div>
            <div className="p-3 rounded-control bg-soft border border-line flex items-center justify-between">
              <span className="text-ink-muted">Live Health</span>
              <EngineStatus compact />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
