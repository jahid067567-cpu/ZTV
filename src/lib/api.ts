const BASE_URL = "https://vegamovies-api-v8.jhshamim81.workers.dev";
const OMDB_URL = "https://www.omdbapi.com";
const OMDB_KEY = "b9bd48a6"; // free tier key

export interface ApiItem {
  id: string;
  title: string;
  image: string;
  quality: string;
  imdb: string; // "⭐ 8.6/10" or "tt12345"
}

export interface ApiListResponse {
  success: boolean;
  page: number;
  total_pages: number;
  data: ApiItem[];
}

export interface ApiSearchResponse {
  success: boolean;
  query: string;
  data: ApiItem[];
}

export interface ApiInfoData {
  title: string;
  imdb_id: string;
  language: string;
  quality: string;
  seasons: string;
  description: string;
  images: string[];
}

export interface ApiInfoResponse {
  success: boolean;
  id: string;
  data: ApiInfoData;
}

export interface ApiDownloadLink {
  episode?: string;
  server: string;
  url: string;
}

export interface ApiDownloadResponse {
  success: boolean;
  id: string;
  quality: string;
  season: string | null;
  matched_section: string;
  nexdrive_url?: string;
  data: ApiDownloadLink[];
}

// Parse seasons count from info.seasons field (e.g. "05\nEpisode:...")
export function parseSeasonsCount(seasons: string): number {
  if (!seasons) return 1;
  const match = seasons.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 1;
}

/**
 * Parse the list of season numbers from the info.seasons field.
 *
 * Examples:
 *   "1 – 2 – 3 – 4"  → [1, 2, 3, 4]   (multi-season → show S1 S2 S3 S4)
 *   "05\nEpisode:…"   → []              (single value → no multi-season selector)
 *   ""                → []              (movie / no season info)
 *
 * Rule: if the raw string contains a separator (–, -, |, /) joining multiple
 * numbers we return all those numbers. If it is just a single number we
 * return an empty array so the caller knows there is only one season box.
 */
export function parseSeasonNumbers(seasons: string): number[] {
  if (!seasons) return [];
  // Take only the first line (ignore episode/episode-count lines)
  const firstLine = seasons.split(/\n/)[0].trim();
  // Find all numbers
  const nums = firstLine.match(/\d+/g);
  if (!nums || nums.length === 0) return [];
  // If more than one number is present, it's a multi-season list
  if (nums.length > 1) return nums.map(Number);
  // Single number → one season, return [] so UI shows single box
  return [];
}

// Parse available qualities from info.quality field (e.g. "480p || 720p || 1080p || 2160p – WEB-DL")
export function parseQualities(quality: string): string[] {
  if (!quality) return ["720p", "1080p"];
  const matches = quality.match(/\d+p/g);
  if (!matches || matches.length === 0) return ["720p", "1080p"];
  // Deduplicate
  return [...new Set(matches)];
}

// Get numeric quality value from string like "1080p" -> 1080
export function qualityToNumber(q: string): number {
  const match = q.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 720;
}

export interface OmdbData {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  BoxOffice?: string;
  totalSeasons?: string;
  Response: string;
}

// Parse rating from "⭐ 8.6/10" or empty
export function parseRating(imdb: string): string {
  if (!imdb) return "N/A";
  const match = imdb.match(/([\d.]+)\/10/);
  return match ? match[1] : "N/A";
}

// Clean title - remove "Download" prefix and quality/size info
export function cleanTitle(rawTitle: string): string {
  let t = rawTitle
    .replace(/^Download\s+/i, "")
    .replace(/\s*-\s*Vegamovies\.\w+$/i, "")
    .replace(/\s+(Dual Audio|BluRay|WEB-DL|Blu-Ray).*$/i, "")
    .replace(/\s+\{[^}]*\}.*$/i, "")
    .replace(/\s+480p.*$/i, "")
    .trim();
  return t;
}

// Extract IMDB ID from imdb field (could be "tt12345" or "⭐ 8.6/10")
export function extractImdbId(imdb: string): string | null {
  if (!imdb) return null;
  const match = imdb.match(/(tt\d+)/);
  return match ? match[1] : null;
}

export async function fetchLatestReleases(page = 1): Promise<ApiListResponse> {
  const res = await fetch(`${BASE_URL}/api/latest-releases?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch latest releases");
  return res.json();
}

export async function fetchMovies(page = 1): Promise<ApiListResponse> {
  const res = await fetch(`${BASE_URL}/api/movies?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}

export async function fetchSeries(page = 1): Promise<ApiListResponse> {
  const res = await fetch(`${BASE_URL}/api/series?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch series");
  return res.json();
}

export async function searchContent(query: string): Promise<ApiSearchResponse> {
  const res = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search");
  return res.json();
}

export async function fetchInfo(id: string): Promise<ApiInfoResponse> {
  const res = await fetch(`${BASE_URL}/api/info?id=${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error("Failed to fetch info");
  return res.json();
}

export async function fetchOmdb(imdbId: string): Promise<OmdbData | null> {
  try {
    const res = await fetch(`${OMDB_URL}/?i=${imdbId}&apikey=${OMDB_KEY}&plot=full`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.Response === "False") return null;
    return data;
  } catch {
    return null;
  }
}

// Search OMDB by title (used when no imdb_id is available)
// Returns the best matching result or null
export async function fetchOmdbByTitle(title: string, year?: string): Promise<OmdbData | null> {
  try {
    const cleanedTitle = cleanTitle(title);
    // Extract year hint from title if not provided
    let yearHint = year;
    if (!yearHint) {
      const yearMatch = cleanedTitle.match(/\b(19|20)\d{2}\b/);
      if (yearMatch) yearHint = yearMatch[0];
    }
    const titleForSearch = cleanedTitle
      .replace(/\b(19|20)\d{2}\b/g, "")
      .replace(/season\s*\d+/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    const params = new URLSearchParams({
      t: titleForSearch,
      apikey: OMDB_KEY,
      plot: "full",
    });
    if (yearHint) params.set("y", yearHint);

    const res = await fetch(`${OMDB_URL}/?${params.toString()}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.Response === "False") {
      // Retry without year hint
      if (yearHint) {
        const retryParams = new URLSearchParams({ t: titleForSearch, apikey: OMDB_KEY, plot: "full" });
        const retryRes = await fetch(`${OMDB_URL}/?${retryParams.toString()}`);
        if (!retryRes.ok) return null;
        const retryData = await retryRes.json();
        if (retryData.Response === "False") return null;
        return retryData;
      }
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * Fetch download links.
 * - Movie / no season: omit the `se` param  → /api/download?id=…&quality=…
 * - Series:            include `se`          → /api/download?id=…&se=…&quality=…
 */
export async function fetchDownloadLinks(
  id: string,
  quality: number,
  season?: number,
): Promise<ApiDownloadResponse> {
  const params = new URLSearchParams({
    id: id,
    quality: String(quality),
  });
  if (season !== undefined) params.set("se", String(season));
  const res = await fetch(`${BASE_URL}/api/download?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch download links");
  return res.json();
}
