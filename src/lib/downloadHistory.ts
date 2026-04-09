// Browser-local download history — persisted in localStorage.

const STORAGE_KEY = "cinemax_download_history";

export interface DownloadRecord {
  id: string;           // unique record id (timestamp-based)
  contentId: string;    // the API content id (used to navigate back to /info/:id)
  title: string;        // cleaned content title
  poster: string;       // poster/thumbnail URL
  quality: string;      // e.g. "1080p"
  type: "movie" | "series";
  season?: number;      // series only
  episode?: string;     // episode label if present, e.g. "Episodes 02"
  server: string;       // server name
  downloadedAt: string; // ISO date string
}

export function getDownloadHistory(): DownloadRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DownloadRecord[];
  } catch {
    return [];
  }
}

export function addDownloadRecord(record: Omit<DownloadRecord, "id" | "downloadedAt">): void {
  try {
    const history = getDownloadHistory();
    const newRecord: DownloadRecord = {
      ...record,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      downloadedAt: new Date().toISOString(),
    };
    // Keep max 200 records, newest first
    const updated = [newRecord, ...history].slice(0, 200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage might be unavailable (private browsing, etc.) — silently ignore
  }
}

export function clearDownloadHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}

export function formatDownloadDate(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso.slice(0, 10);
  }
}
