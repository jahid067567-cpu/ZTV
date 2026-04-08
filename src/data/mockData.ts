export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  rating: number;
  year: number;
  type: "movie" | "series";
  genre: string[];
  description: string;
  language: string;
  duration?: string;
  seasons?: number;
  episodes?: { season: number; episode: number; title: string }[];
  cast: { name: string; character: string; image: string }[];
  screenshots: string[];
  qualities: string[];
  servers: { name: string; url: string }[];
}

export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "The Dark Horizon",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=600&fit=crop",
    rating: 8.5,
    year: 2024,
    type: "movie",
    genre: ["Action", "Sci-Fi", "Thriller"],
    description: "In a dystopian future where technology controls everything, a lone rebel discovers a secret that could change the course of humanity forever. With time running out, they must navigate a dangerous world of AI overlords and corrupt corporations.",
    language: "English",
    duration: "2h 18m",
    cast: [
      { name: "John Carter", character: "Alex Mercer", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
      { name: "Sarah Chen", character: "Dr. Maya Lin", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" },
      { name: "Marcus Wright", character: "Commander Rex", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
      { name: "Elena Voss", character: "Agent Nyx", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=225&fit=crop",
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=225&fit=crop",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=225&fit=crop",
    ],
    qualities: ["480p", "720p", "1080p", "4K"],
    servers: [
      { name: "Server 1 - Fast", url: "#" },
      { name: "Server 2 - HD", url: "#" },
      { name: "Server 3 - Mirror", url: "#" },
    ],
  },
  {
    id: "2",
    title: "Neon Dynasty",
    poster: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=600&fit=crop",
    rating: 9.1,
    year: 2024,
    type: "series",
    genre: ["Drama", "Cyberpunk", "Mystery"],
    description: "Set in a neon-lit megacity, this gripping series follows detective Kai Tanaka as he uncovers a web of conspiracies involving the most powerful families in the city. Each season peels back another layer of the dark underworld.",
    language: "English",
    seasons: 3,
    episodes: [
      { season: 1, episode: 1, title: "Pilot - New Dawn" },
      { season: 1, episode: 2, title: "Shadows" },
      { season: 1, episode: 3, title: "The Signal" },
      { season: 2, episode: 1, title: "Return" },
      { season: 2, episode: 2, title: "Fracture" },
      { season: 3, episode: 1, title: "Endgame" },
    ],
    cast: [
      { name: "Kai Nakamura", character: "Kai Tanaka", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face" },
      { name: "Lena Park", character: "Yuki Sato", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face" },
      { name: "Diego Ruiz", character: "Marco", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=225&fit=crop",
      "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=225&fit=crop",
      "https://images.unsplash.com/photo-1460881680858-30d872d5b530?w=400&h=225&fit=crop",
    ],
    qualities: ["480p", "720p", "1080p"],
    servers: [
      { name: "Server 1 - Fast", url: "#" },
      { name: "Server 2 - HD", url: "#" },
    ],
  },
  {
    id: "3",
    title: "Shadow Protocol",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=600&fit=crop",
    rating: 7.8,
    year: 2023,
    type: "movie",
    genre: ["Thriller", "Espionage"],
    description: "A retired spy is pulled back into action when a ghost from their past threatens global security. Packed with intense action sequences and unexpected twists.",
    language: "English",
    duration: "2h 05m",
    cast: [
      { name: "David Stone", character: "Agent Black", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
      { name: "Mia Torres", character: "Director Wells", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" },
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=225&fit=crop",
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=225&fit=crop",
    ],
    qualities: ["720p", "1080p"],
    servers: [
      { name: "Server 1 - Fast", url: "#" },
      { name: "Server 2 - Mirror", url: "#" },
    ],
  },
  {
    id: "4",
    title: "The Last Kingdom",
    poster: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&h=600&fit=crop",
    rating: 8.9,
    year: 2024,
    type: "series",
    genre: ["Fantasy", "Adventure", "Drama"],
    description: "An epic tale of kingdoms at war, ancient magic, and the heroes who rise to defend the realm. With breathtaking visuals and a compelling narrative that spans generations.",
    language: "Hindi",
    seasons: 2,
    episodes: [
      { season: 1, episode: 1, title: "The Beginning" },
      { season: 1, episode: 2, title: "The Alliance" },
      { season: 1, episode: 3, title: "War" },
      { season: 2, episode: 1, title: "New Throne" },
      { season: 2, episode: 2, title: "Betrayal" },
    ],
    cast: [
      { name: "Arjun Kapoor", character: "King Vikram", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face" },
      { name: "Priya Sharma", character: "Queen Devi", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face" },
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop",
      "https://images.unsplash.com/photo-1460881680858-30d872d5b530?w=400&h=225&fit=crop",
    ],
    qualities: ["480p", "720p", "1080p", "4K"],
    servers: [
      { name: "Server 1 - Fast", url: "#" },
      { name: "Server 2 - HD", url: "#" },
      { name: "Server 3 - Backup", url: "#" },
    ],
  },
  {
    id: "5",
    title: "Crimson Tide",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1200&h=600&fit=crop",
    rating: 7.4,
    year: 2023,
    type: "movie",
    genre: ["Action", "War"],
    description: "A gripping war drama set during a pivotal battle that changed the course of history. Based on true events, it follows soldiers on both sides of the conflict.",
    language: "English",
    duration: "2h 32m",
    cast: [
      { name: "Robert Kane", character: "Captain Miles", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
      { name: "Anna Petrova", character: "Lt. Sokolov", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=225&fit=crop",
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=225&fit=crop",
    ],
    qualities: ["720p", "1080p"],
    servers: [
      { name: "Server 1 - Fast", url: "#" },
      { name: "Server 2 - HD", url: "#" },
    ],
  },
  {
    id: "6",
    title: "Echoes of Tomorrow",
    poster: "https://images.unsplash.com/photo-1460881680858-30d872d5b530?w=400&h=600&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=600&fit=crop",
    rating: 8.2,
    year: 2024,
    type: "series",
    genre: ["Sci-Fi", "Drama"],
    description: "A mind-bending journey through parallel timelines where every choice creates a new reality. When a scientist discovers how to communicate across dimensions, chaos ensues.",
    language: "English",
    seasons: 1,
    episodes: [
      { season: 1, episode: 1, title: "The Rift" },
      { season: 1, episode: 2, title: "Convergence" },
      { season: 1, episode: 3, title: "Paradox" },
      { season: 1, episode: 4, title: "Resolution" },
    ],
    cast: [
      { name: "Emma Clarke", character: "Dr. Iris Nova", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" },
      { name: "James Liu", character: "Professor Chen", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=225&fit=crop",
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=225&fit=crop",
    ],
    qualities: ["720p", "1080p", "4K"],
    servers: [
      { name: "Server 1 - Ultra Fast", url: "#" },
      { name: "Server 2 - HD", url: "#" },
    ],
  },
];

export const getMovieById = (id: string) => mockMovies.find((m) => m.id === id);
export const getMovies = () => mockMovies.filter((m) => m.type === "movie");
export const getSeries = () => mockMovies.filter((m) => m.type === "series");
export const getLatest = () => [...mockMovies].sort((a, b) => b.year - a.year).slice(0, 6);
export const searchMovies = (query: string) =>
  mockMovies.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()));

export interface DownloadItem {
  id: string;
  movieId: string;
  title: string;
  poster: string;
  quality: string;
  server: string;
  progress: number;
  status: "downloading" | "completed" | "paused";
  size: string;
  date: string;
}

export const mockDownloads: DownloadItem[] = [
  { id: "d1", movieId: "1", title: "The Dark Horizon", poster: mockMovies[0].poster, quality: "1080p", server: "Server 1", progress: 100, status: "completed", size: "2.4 GB", date: "2024-03-15" },
  { id: "d2", movieId: "2", title: "Neon Dynasty S01E01", poster: mockMovies[1].poster, quality: "720p", server: "Server 2", progress: 67, status: "downloading", size: "890 MB", date: "2024-03-16" },
  { id: "d3", movieId: "3", title: "Shadow Protocol", poster: mockMovies[2].poster, quality: "1080p", server: "Server 1", progress: 45, status: "paused", size: "1.8 GB", date: "2024-03-14" },
  { id: "d4", movieId: "4", title: "The Last Kingdom S01E01", poster: mockMovies[3].poster, quality: "4K", server: "Server 1", progress: 100, status: "completed", size: "4.2 GB", date: "2024-03-13" },
];
