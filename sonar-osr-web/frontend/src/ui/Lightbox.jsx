import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

export default function Lightbox({ items = [], index, onClose, onIndexChange }) {
  const [zoomed, setZoomed] = useState(false);
  const open = index !== null && index >= 0 && index < items.length;
  const item = open ? items[index] : null;

  useEffect(() => {
    setZoomed(false);
  }, [index]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onIndexChange((index + 1) % items.length);
      else if (e.key === 'ArrowLeft') onIndexChange((index - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, index, items.length, onClose, onIndexChange]);

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-8"
          onClick={onClose}
        >
          <div
            className="w-full max-w-5xl flex items-center justify-between text-white mb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="text-base font-semibold">{item.title}</div>
              <div className="text-xs text-white/60">
                Figure {index + 1} of {items.length}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                {zoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close lightbox"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div
            className="relative w-full max-w-5xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {items.length > 1 && (
              <button
                type="button"
                aria-label="Previous figure"
                onClick={() => onIndexChange((index - 1 + items.length) % items.length)}
                className="absolute left-2 sm:-left-12 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <div className="max-h-[78vh] overflow-auto rounded-card bg-white p-3 shadow-pop">
              <img
                src={item.src}
                alt={item.title}
                onClick={() => setZoomed((z) => !z)}
                className={`transition-transform duration-200 cursor-zoom-in ${
                  zoomed ? 'scale-150 cursor-zoom-out' : 'max-h-[72vh] w-auto object-contain'
                }`}
              />
            </div>

            {items.length > 1 && (
              <button
                type="button"
                aria-label="Next figure"
                onClick={() => onIndexChange((index + 1) % items.length)}
                className="absolute right-2 sm:-right-12 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
