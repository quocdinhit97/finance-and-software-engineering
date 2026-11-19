/**
 * The reader's last position in the book, kept in this browser only
 * (localStorage, one entry per locale). Written by the readingPosition client
 * module, read by the "Continue reading" card on the home page.
 */
export interface ReadingPosition {
  path: string; // pathname without the site base URL
  title: string;
  section?: string;
  sectionId?: string;
  percent: number;
  at: number; // epoch ms
}

const KEY = 'book.lastRead.v1.';

export function loadPosition(locale: string): ReadingPosition | null {
  try {
    const raw = window.localStorage.getItem(KEY + locale);
    if (!raw) return null;
    const p = JSON.parse(raw) as ReadingPosition;
    return typeof p?.path === 'string' && typeof p?.title === 'string' ? p : null;
  } catch {
    return null;
  }
}

export function savePosition(locale: string, position: ReadingPosition): void {
  try {
    window.localStorage.setItem(KEY + locale, JSON.stringify(position));
  } catch {
    // storage full or disabled (private mode): the feature silently does nothing
  }
}
