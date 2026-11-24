import { create } from 'zustand';

function readStoredTheme() {
  try {
    const raw = localStorage.getItem('sonar_theme');
    return raw === 'dark' || raw === 'slate' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function applyTheme(theme) {
  try {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sonar_theme', theme);
  } catch {
    // ignore storage errors
  }
}

export const useTheme = create((set) => ({
  theme: readStoredTheme(),
  setTheme: (theme) => {
    const normalized = theme === 'dark' || theme === 'slate' ? 'dark' : 'light';
    applyTheme(normalized);
    set({ theme: normalized });
  },
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      return { theme: next };
    }),
}));
