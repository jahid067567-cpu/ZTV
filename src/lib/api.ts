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
  server: string;
  url: string;
}

export interface ApiDownloadResponse {
  success: boolean;
  data: ApiDownloadLink[];
}

// Parse seasons count from info.seasons field (e.g. "05\nEpisode:...")
export function parseSeasonsCount(seasons: string): number {
  if (!seasons) return 1;
  const match = seasons.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 1;
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
  Runtime: string;
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  imdbID: string;
  Type: string;
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

export async function fetchDownloadLinks(id: string, season: number, quality: number): Promise<ApiDownloadResponse> {
  const res = await fetch(`${BASE_URL}/api/download?id=${encodeURIComponent(id)}&se=${season}&quality=${quality}`);
  if (!res.ok) throw new Error("Failed to fetch download links");
  return res.json();
}
