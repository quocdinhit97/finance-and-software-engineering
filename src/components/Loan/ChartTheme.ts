// Two-colour palette shared by every loan chart: principal vs interest.
// Chosen to stay distinguishable in light and dark mode and for common colour-vision deficiencies.
export const PRINCIPAL = '#2f6f9f';
export const INTEREST = '#c98a2b';
export const BALANCE = '#2f6f9f';
export const GRID = 'var(--book-rule)';
export const AXIS = 'var(--book-muted)';

export const compactVnd = (v: number): string => {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toLocaleString('en-US', {maximumFractionDigits: 1})}M`;
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toLocaleString('en-US', {maximumFractionDigits: 0})}K`;
  return String(v);
};
