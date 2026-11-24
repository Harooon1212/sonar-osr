import React, { useState } from 'react';
import { Menu, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileDrawer from './MobileDrawer';
import { useHealth } from '../hooks/useHealth';

export default function AppFrame({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  useHealth(30000);

  return (
    <div className="min-h-screen bg-page lg:p-6 xl:p-8 flex justify-center">
      <div className="w-full max-w-[1440px] bg-frame lg:rounded-frame lg:shadow-frame flex flex-col lg:flex-row min-h-screen lg:min-h-[calc(100vh-4rem)] overflow-x-clip">
        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3.5 border-b border-line bg-sidebar sticky top-0 z-30">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
              <Radio size={18} strokeWidth={2.2} />
            </div>
            <span className="text-lg font-bold tracking-tight text-ink">
              SONAR<span className="text-primary">OSR</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            className="w-10 h-10 rounded-control bg-soft flex items-center justify-center text-ink-2"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-[272px] xl:w-[296px] shrink-0 bg-sidebar rounded-l-frame border-r border-line p-7">
          <div className="sticky top-7 h-[calc(100vh-7.5rem)]">
            <Sidebar />
          </div>
        </aside>

        {/* Mobile Drawer */}
        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9 flex flex-col justify-between">
          <div>{children}</div>

          {/* Slim Academic Footer */}
          <footer className="mt-12 pt-5 border-t border-line flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
            <div>
              <span className="font-semibold text-ink-2">SonarOSR</span> · Final Year Project · Dept. of Computer Science, Bahria University Islamabad
            </div>
            <div className="font-mono text-[11px] text-ink-faint">
              ARIS Explorer 3000 · 3.0 MHz · Mohammad Khizar Hayat Cheema &amp; Muhammad Haroon · Sup: Dr. Arif Ur Rahman
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
