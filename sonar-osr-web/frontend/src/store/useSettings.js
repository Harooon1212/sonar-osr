import { create } from 'zustand';

const STORAGE_KEY = 'sonar_settings';

function readSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { defaultTau: 0.5, reducedMotion: false };
    const parsed = JSON.parse(raw);
    return {
      defaultTau: typeof parsed.defaultTau === 'number' ? parsed.defaultTau : 0.5,
      reducedMotion: Boolean(parsed.reducedMotion),
    };
  } catch {
    return { defaultTau: 0.5, reducedMotion: false };
  }
}

function saveSettings(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export const useSettings = create((set) => ({
  ...readSettings(),
  setDefaultTau: (defaultTau) =>
    set((s) => {
      const next = { defaultTau, reducedMotion: s.reducedMotion };
      saveSettings(next);
      return next;
    }),
  setReducedMotion: (reducedMotion) =>
    set((s) => {
      const next = { defaultTau: s.defaultTau, reducedMotion: Boolean(reducedMotion) };
      saveSettings(next);
      return next;
    }),
}));
