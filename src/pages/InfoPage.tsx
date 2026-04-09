import { ArrowLeft, Star, Download, Globe, Calendar, Film, Clock, Tv, Award, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchInfo, fetchOmdb, cleanTitle, parseSeasonsCount } from "@/lib/api";

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
  const bannerUrl = posterUrl || info.images?.[0] || "";
  const rating = omdbData?.imdbRating || "";
  const year = omdbData?.Year || "";
  const runtime = omdbData?.Runtime || "";
  const rated = omdbData?.Rated || "";
  const genres = omdbData?.Genre?.split(", ") || [];
  const plot = omdbData?.Plot || info.description || "";
  const actors = omdbData?.Actors?.split(", ") || [];
  const director = omdbData?.Director || "";
  const images = info.images || [];
  const totalSeasons = omdbData?.totalSeasons ? parseInt(omdbData.totalSeasons) : parseSeasonsCount(info.seasons);
  const contentType = omdbData?.Type || (totalSeasons > 1 ? "series" : "movie");

  const langMatch = info.language?.match(/^([^\n]+)/);
  const language = langMatch ? langMatch[1].trim() : "Dual Audio";

  return (
    <div className="min-h-screen gradient-dark pb-28">
      {/* Banner - full width cinematic */}
      <div className="relative w-full aspect-[2/3] max-h-[70vh] md:aspect-[16/9] overflow-hidden">
        {bannerUrl ? (
          <img src={bannerUrl} alt={title} className="w-full h-full object-cover md:object-top" />
        ) : (
          <div className="w-full h-full bg-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-4 left-4 md:left-8 z-10">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl glass hover:bg-secondary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom overlay info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">{title}</h1>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm font-bold text-primary">{rating}</span>
                <span className="text-xs text-muted-foreground">/10</span>
              </div>
            )}
            {year && <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/80 text-secondary-foreground">{year}</span>}
            {rated && rated !== "N/A" && <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/80 text-secondary-foreground">{rated}</span>}
            {runtime && runtime !== "N/A" && <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/80 text-secondary-foreground">{runtime}</span>}
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium capitalize">{contentType}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {genres.map((g) => (
              <span key={g} className="text-xs px-2.5 py-0.5 rounded-full bg-secondary/60 text-secondary-foreground font-medium backdrop-blur-sm">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-2xl mx-auto mt-4 relative z-10">
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          {plot}
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
          {rated && rated !== "N/A" && (
            <div className="glass rounded-xl p-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Rated</p>
                <p className="text-sm font-semibold">{rated}</p>
              </div>
            </div>
          )}
          {contentType === "series" && totalSeasons > 0 && (
            <div className="glass rounded-xl p-3 flex items-center gap-2">
              <Tv className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Seasons</p>
                <p className="text-sm font-semibold">{totalSeasons}</p>
              </div>
            </div>
          )}
        </div>

        {/* Season boxes for series */}
        {contentType === "series" && totalSeasons > 1 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3">Seasons</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
                <div key={s} className="flex-shrink-0 glass rounded-xl px-5 py-3 text-center min-w-[70px]">
                  <p className="text-xs text-muted-foreground">Season</p>
                  <p className="text-lg font-bold text-primary">{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Director */}
        {director && director !== "N/A" && (
          <div className="glass rounded-xl p-3 mb-6 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Director</p>
              <p className="text-sm font-semibold">{director}</p>
            </div>
          </div>
        )}

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
