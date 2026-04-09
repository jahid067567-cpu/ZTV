import { ArrowLeft, Star, Download, Globe, Calendar, Film, Clock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchInfo, fetchOmdb, cleanTitle } from "@/lib/api";

const InfoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: infoData, isLoading: infoLoading } = useQuery({
    queryKey: ["info", id],
    queryFn: () => fetchInfo(id || ""),
    enabled: !!id,
  });

  const imdbId = infoData?.data?.imdb_id || "";

  const { data: omdbData } = useQuery({
    queryKey: ["omdb", imdbId],
    queryFn: () => fetchOmdb(imdbId),
    enabled: !!imdbId && imdbId.startsWith("tt"),
  });

  if (infoLoading) {
    return (
      <div className="min-h-screen gradient-dark">
        <div className="w-full aspect-[16/9] bg-secondary animate-pulse" />
        <div className="px-4 md:px-8 max-w-2xl mx-auto mt-4 space-y-4">
          <div className="h-8 bg-secondary rounded animate-pulse w-3/4" />
          <div className="h-4 bg-secondary rounded animate-pulse" />
          <div className="h-4 bg-secondary rounded animate-pulse w-2/3" />
        </div>
      </div>
    );
  }

  if (!infoData?.data) {
    return (
      <div className="min-h-screen gradient-dark flex items-center justify-center">
        <p className="text-muted-foreground">Not found</p>
      </div>
    );
  }

  const info = infoData.data;
  const title = cleanTitle(info.title);
  const posterUrl = omdbData?.Poster && omdbData.Poster !== "N/A" ? omdbData.Poster : null;
  const bannerUrl = info.images?.[0] || posterUrl || "";
  const rating = omdbData?.imdbRating || "";
  const year = omdbData?.Year || "";
  const runtime = omdbData?.Runtime || "";
  const genres = omdbData?.Genre?.split(", ") || [];
  const plot = omdbData?.Plot || info.description || "";
  const actors = omdbData?.Actors?.split(", ") || [];
  const director = omdbData?.Director || "";
  const description = info.description || "";
  const images = info.images || [];

  // Parse language from info
  const langMatch = info.language?.match(/^([^\n]+)/);
  const language = langMatch ? langMatch[1].trim() : "Dual Audio";

  return (
    <div className="min-h-screen gradient-dark pb-28">
      {/* Banner */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
        {bannerUrl ? (
          <img src={bannerUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
        {/* Back Button */}
        <div className="absolute top-4 left-4 md:left-8 z-10">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl glass hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        {/* Rating on banner */}
        {rating && (
          <div className="absolute bottom-4 left-4 md:left-8 flex items-center gap-2">
            <Star className="w-5 h-5 text-primary fill-primary" />
            <span className="text-lg font-bold text-primary">{rating}</span>
            <span className="text-sm text-muted-foreground">/ 10</span>
          </div>
        )}
      </div>

      <div className="px-4 md:px-8 max-w-2xl mx-auto -mt-6 relative z-10">
        {/* Poster + Title row */}
        <div className="flex gap-4 mb-4">
          {posterUrl && (
            <div className="flex-shrink-0 w-24 md:w-32 rounded-xl overflow-hidden shadow-2xl -mt-12 ring-2 ring-primary/30">
              <img src={posterUrl} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 pt-2">
            <h1 className="text-xl md:text-2xl font-bold mb-2">{title}</h1>
            {/* Genres */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {genres.map((g) => (
                <span key={g} className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                  {g}
                </span>
              ))}
            </div>
            {/* Quality badge */}
            {info.quality && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                {info.quality.split("\n")[0]}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {plot || description}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {year && (
            <div className="glass rounded-xl p-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Year</p>
                <p className="text-sm font-semibold">{year}</p>
              </div>
            </div>
          )}
          {runtime && runtime !== "N/A" && (
            <div className="glass rounded-xl p-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Runtime</p>
                <p className="text-sm font-semibold">{runtime}</p>
              </div>
            </div>
          )}
          <div className="glass rounded-xl p-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Language</p>
              <p className="text-sm font-semibold truncate">{language}</p>
            </div>
          </div>
          <div className="glass rounded-xl p-3 flex items-center gap-2">
            <Film className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Quality</p>
              <p className="text-sm font-semibold">{info.quality?.split("\n")[0] || "HD"}</p>
            </div>
          </div>
        </div>

        {/* Cast (from OMDB) */}
        {actors.length > 0 && actors[0] !== "N/A" && (
          <>
            <h2 className="text-lg font-bold mb-3">Cast</h2>
            <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar mb-6">
              {actors.map((actor) => (
                <div key={actor} className="flex-shrink-0 text-center">
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-2 ring-2 ring-primary/30">
                    <span className="text-lg font-bold text-primary">
                      {actor.charAt(0)}
                    </span>
                  </div>
                  <p className="text-xs font-semibold w-20 truncate">{actor}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {director && director !== "N/A" && (
          <div className="glass rounded-xl p-3 mb-6">
            <p className="text-xs text-muted-foreground">Director</p>
            <p className="text-sm font-semibold">{director}</p>
          </div>
        )}

        {/* Screenshots */}
        {images.length > 0 && (
          <>
            <h2 className="text-lg font-bold mb-3">Screenshots</h2>
            <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
              {images.map((ss, i) => (
                <div key={i} className="flex-shrink-0 rounded-xl overflow-hidden w-64 aspect-video">
                  <img src={ss} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Download Float */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => navigate(`/download/${id}`)}
          className="gradient-primary text-primary-foreground px-10 py-4 rounded-2xl font-bold text-sm glow-primary hover:scale-105 transition-transform flex items-center gap-2 shadow-2xl"
        >
          <Download className="w-5 h-5" />
          Download Now
        </button>
      </div>
    </div>
  );
};

export default InfoPage;
