export function formatDecimal(val, digits = 4) {
  if (val === null || val === undefined || Number.isNaN(Number(val))) return '—';
  return Number(val).toFixed(digits);
}

export function formatPercent(val, digits = 2) {
  if (val === null || val === undefined || Number.isNaN(Number(val))) return '—';
  const n = Number(val);
  // If 0..1 ratio, convert to 0..100
  const pct = n <= 1 && n >= 0 ? n * 100 : n;
  return `${pct.toFixed(digits)}%`;
}

export function formatInt(val) {
  if (val === null || val === undefined || Number.isNaN(Number(val))) return '—';
  return Number(val).toLocaleString('en-US');
}

export function formatMs(val) {
  if (val === null || val === undefined || Number.isNaN(Number(val))) return '—';
  return `${Number(val).toFixed(1)} ms`;
}

export function titleCase(str) {
  if (!str) return '';
  return String(str)
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
