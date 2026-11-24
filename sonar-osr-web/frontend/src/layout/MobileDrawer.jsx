import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Sidebar from './Sidebar';

export default function MobileDrawer({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-[300px] max-w-[85vw] h-full bg-sidebar p-6 shadow-pop overflow-y-auto"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-soft flex items-center justify-center text-ink-2 hover:text-ink"
            >
              <X size={18} />
            </button>
            <Sidebar onNavigate={onClose} />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
