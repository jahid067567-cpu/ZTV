import { ArrowLeft, Star, Download, Globe, Calendar, Film, Clock, Tv, Award, User, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchInfo, fetchOmdb, fetchOmdbByTitle, cleanTitle, parseSeasonsCount } from "@/lib/api";

const InfoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: infoData, isLoading: infoLoading } = useQuery({
    queryKey: ["info", id],
    queryFn: () => fetchInfo(id || ""),
    enabled: !!id,
  });

  const info = infoData?.data;
  const rawImdbId = info?.imdb_id || "";

  // Try to get OMDB data — first by imdb_id if it's a tt-id, otherwise by title
  const { data: omdbData, isLoading: omdbLoading } = useQuery({
    queryKey: ["omdb-info", rawImdbId, info?.title],
    queryFn: async () => {
      if (rawImdbId && rawImdbId.startsWith("tt")) {
        return fetchOmdb(rawImdbId);
      }
      // Fallback: search by cleaned title
      if (info?.title) {
        return fetchOmdbByTitle(info.title);
      }
      return null;
    },
    enabled: !!info,
    staleTime: 60000,
  });

  if (infoLoading) {
    return (
      <div className="min-h-screen gradient-dark">
        <div className="w-full aspect-[2/3] sm:aspect-[16/9] bg-secondary animate-pulse" />
        <div className="px-4 md:px-8 max-w-2xl mx-auto mt-4 space-y-4">
          <div className="h-8 bg-secondary rounded animate-pulse w-3/4" />
          <div className="h-4 bg-secondary rounded animate-pulse" />
          <div className="h-4 bg-secondary rounded animate-pulse w-2/3" />
        </div>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="min-h-screen gradient-dark flex items-center justify-center">
        <p className="text-muted-foreground">Not found</p>
      </div>
    );
  }

  const title = cleanTitle(info.title);

  // OMDB enriched data
  const omdbPoster = omdbData?.Poster && omdbData.Poster !== "N/A" ? omdbData.Poster : null;
  // Use OMDB poster as banner (it's usually a proper poster), fallback to first screenshot
  const bannerUrl = omdbPoster || info.images?.[0] || "";
  const rating = omdbData?.imdbRating && omdbData.imdbRating !== "N/A" ? omdbData.imdbRating : "";
  const year = omdbData?.Year && omdbData.Year !== "N/A" ? omdbData.Year : "";
  const runtime = omdbData?.Runtime && omdbData.Runtime !== "N/A" ? omdbData.Runtime : "";
  const rated = omdbData?.Rated && omdbData.Rated !== "N/A" ? omdbData.Rated : "";
  const genres = omdbData?.Genre ? omdbData.Genre.split(", ").filter(Boolean) : [];
  const plot = omdbData?.Plot && omdbData.Plot !== "N/A" ? omdbData.Plot : info.description || "";
  const actors = omdbData?.Actors ? omdbData.Actors.split(", ").filter((a) => a && a !== "N/A") : [];
  const director = omdbData?.Director && omdbData.Director !== "N/A" ? omdbData.Director : "";
  const writer = omdbData?.Writer && omdbData.Writer !== "N/A" ? omdbData.Writer : "";
  const awards = omdbData?.Awards && omdbData.Awards !== "N/A" ? omdbData.Awards : "";
  const country = omdbData?.Country && omdbData.Country !== "N/A" ? omdbData.Country : "";
  const boxOffice = omdbData?.BoxOffice && omdbData.BoxOffice !== "N/A" ? omdbData.BoxOffice : "";
  const imdbVotes = omdbData?.imdbVotes && omdbData.imdbVotes !== "N/A" ? omdbData.imdbVotes : "";
  const imdbID = omdbData?.imdbID || "";

  const images = info.images || [];
  const totalSeasons = omdbData?.totalSeasons
    ? parseInt(omdbData.totalSeasons)
    : parseSeasonsCount(info.seasons);

  // Determine content type
  const contentType: "movie" | "series" =
    omdbData?.Type === "series" || omdbData?.Type === "episode"
      ? "series"
      : omdbData?.Type === "movie"
      ? "movie"
      : totalSeasons > 1
      ? "series"
      : "movie";

  const langMatch = info.language?.match(/^([^\n]+)/);
  const language = langMatch ? langMatch[1].trim() : "Dual Audio";

  return (
    <div className="min-h-screen gradient-dark pb-28">
      {/* Back Button — floating on banner */}
      <div className="absolute top-4 left-4 md:left-8 z-30">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-xl glass hover:bg-secondary transition-colors shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Banner */}
      <div className="relative w-full aspect-[2/3] max-h-[75vh] sm:aspect-[16/9] sm:max-h-[60vh] overflow-hidden">
        {bannerUrl ? (
          <img
            src={bannerUrl}
            alt={title}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <Film className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent" />

        {/* Type badge on banner */}
        <div className="absolute top-4 right-4 z-10">
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide shadow-lg ${
              contentType === "series"
                ? "bg-blue-500/90 text-white"
                : "bg-primary/90 text-primary-foreground"
            }`}
          >
            {contentType === "series" ? "Series" : "Movie"}
          </span>
        </div>

        {/* Bottom overlay info on banner */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 drop-shadow-lg leading-tight">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            {rating && (
              <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-lg px-2.5 py-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold text-yellow-400">{rating}</span>
                <span className="text-xs text-white/60">/10</span>
              </div>
            )}
            {imdbVotes && (
              <span className="text-xs bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg text-white/70">
                {imdbVotes} votes
              </span>
            )}
            {year && (
              <span className="text-xs bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg text-white/80">
                {year}
              </span>
            )}
            {rated && (
              <span className="text-xs bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg text-white/80">
                {rated}
              </span>
            )}
            {runtime && (
              <span className="text-xs bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg text-white/80">
                {runtime}
              </span>
            )}
          </div>
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {genres.map((g) => (
                <span
                  key={g}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-primary/25 text-primary font-medium backdrop-blur-sm border border-primary/30"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 md:px-8 max-w-2xl mx-auto mt-5 space-y-6 relative z-10">

        {/* Description */}
        {plot && (
          <div>
            <h2 className="text-base font-bold mb-2 text-foreground/90">Overview</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{plot}</p>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {year && (
            <div className="glass rounded-xl p-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Year</p>
                <p className="text-sm font-semibold truncate">{year}</p>
              </div>
            </div>
          )}
          {runtime && (
            <div className="glass rounded-xl p-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Runtime</p>
                <p className="text-sm font-semibold truncate">{runtime}</p>
              </div>
            </div>
          )}
          <div className="glass rounded-xl p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Language</p>
              <p className="text-sm font-semibold truncate">{language}</p>
            </div>
          </div>
          <div className="glass rounded-xl p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Film className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Quality</p>
              <p className="text-sm font-semibold truncate">{info.quality?.split("\n")[0] || "HD"}</p>
            </div>
          </div>
          {rated && (
            <div className="glass rounded-xl p-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Rated</p>
                <p className="text-sm font-semibold truncate">{rated}</p>
              </div>
            </div>
          )}
          {contentType === "series" && totalSeasons > 0 && (
            <div className="glass rounded-xl p-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Tv className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Seasons</p>
                <p className="text-sm font-semibold truncate">{totalSeasons}</p>
              </div>
            </div>
          )}
          {country && (
            <div className="glass rounded-xl p-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Country</p>
                <p className="text-sm font-semibold truncate">{country}</p>
              </div>
            </div>
          )}
          {boxOffice && (
            <div className="glass rounded-xl p-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Film className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Box Office</p>
                <p className="text-sm font-semibold truncate">{boxOffice}</p>
              </div>
            </div>
          )}
        </div>

        {/* Season boxes — kept as data display */}
        {contentType === "series" && totalSeasons > 1 && (
          <div>
            <h2 className="text-base font-bold mb-3">Seasons</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
                <div
                  key={s}
                  className="flex-shrink-0 glass rounded-xl px-5 py-3 text-center min-w-[72px]"
                >
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Season</p>
                  <p className="text-xl font-bold text-primary">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Director & Writer */}
        {(director || writer) && (
          <div className="space-y-2">
            {director && (
              <div className="glass rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Director</p>
                  <p className="text-sm font-semibold truncate">{director}</p>
                </div>
              </div>
            )}
            {writer && (
              <div className="glass rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Writer</p>
                  <p className="text-sm font-semibold truncate">{writer}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cast Section */}
        {actors.length > 0 && (
          <div>
            <h2 className="text-base font-bold mb-3">Cast</h2>
            <div className="flex gap-3 overflow-x-auto pb-3 hide-scrollbar">
              {actors.map((actor) => {
                const initials = actor
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase();
                return (
                  <div key={actor} className="flex-shrink-0 text-center w-[72px]">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mx-auto mb-2 ring-2 ring-primary/20 shadow-md">
                      <span className="text-sm font-bold text-primary">{initials}</span>
                    </div>
                    <p className="text-[11px] font-medium leading-tight line-clamp-2">{actor}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Awards */}
        {awards && (
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-yellow-400" />
              <p className="text-xs font-bold text-yellow-400 uppercase tracking-wide">Awards</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{awards}</p>
          </div>
        )}

        {/* Screenshots */}
        {images.length > 0 && (
          <div>
            <h2 className="text-base font-bold mb-3">Screenshots</h2>
            <div className="flex gap-3 overflow-x-auto pb-3 hide-scrollbar">
              {images.map((ss, i) => (
                <div key={i} className="flex-shrink-0 rounded-xl overflow-hidden w-56 sm:w-64 aspect-video shadow-lg">
                  <img
                    src={ss}
                    alt={`Screenshot ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IMDB Link */}
        {imdbID && (
          <a
            href={`https://www.imdb.com/title/${imdbID}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-xl p-3 flex items-center justify-between hover:bg-surface-hover transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">IMDB</p>
                <p className="text-sm font-semibold">{imdbID}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </a>
        )}

        {omdbLoading && !omdbData && (
          <div className="text-xs text-muted-foreground text-center py-2 animate-pulse">
            Loading IMDB data…
          </div>
        )}
      </div>

      {/* Download Float Button */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4">
        <button
          onClick={() => navigate(`/download/${id}`)}
          className="gradient-primary text-primary-foreground px-10 py-4 rounded-2xl font-bold text-sm glow-primary hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 shadow-2xl w-full max-w-xs justify-center"
        >
          <Download className="w-5 h-5" />
          Download Now
        </button>
      </div>
    </div>
  );
};

export default InfoPage;
