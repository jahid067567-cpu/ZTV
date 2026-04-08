import { ArrowLeft, Star, Download } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieById } from "@/data/mockData";

const InfoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = getMovieById(id || "");

  if (!movie) {
    return (
      <div className="min-h-screen gradient-dark flex items-center justify-center">
        <p className="text-muted-foreground">Movie not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dark pb-28">
      {/* Back Button */}
      <div className="px-4 py-4 md:px-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-secondary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Poster */}
      <div className="px-4 md:px-8 mb-6">
        <div className="relative rounded-2xl overflow-hidden aspect-[2/3] max-w-sm mx-auto shadow-2xl">
          <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary fill-primary" />
              <span className="text-lg font-bold text-primary">{movie.rating}</span>
              <span className="text-sm text-muted-foreground">/ 10</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-2xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{movie.title}</h1>
        
        {/* Meta */}
        <div className="flex flex-wrap gap-2 mb-4">
          {movie.genre.map((g) => (
            <span key={g} className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
              {g}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{movie.description}</p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="glass rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Year</p>
            <p className="text-sm font-semibold">{movie.year}</p>
          </div>
          <div className="glass rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Type</p>
            <p className="text-sm font-semibold capitalize">{movie.type}</p>
          </div>
          <div className="glass rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Language</p>
            <p className="text-sm font-semibold">{movie.language}</p>
          </div>
          <div className="glass rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">{movie.type === "movie" ? "Duration" : "Seasons"}</p>
            <p className="text-sm font-semibold">{movie.type === "movie" ? movie.duration : `${movie.seasons} Seasons`}</p>
          </div>
        </div>

        {/* Cast */}
        <h2 className="text-lg font-bold mb-3">Cast</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar mb-6">
          {movie.cast.map((person) => (
            <div key={person.name} className="flex-shrink-0 text-center w-20">
              <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2 ring-2 ring-primary/30">
                <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs font-semibold truncate">{person.name}</p>
              <p className="text-xs text-muted-foreground truncate">{person.character}</p>
            </div>
          ))}
        </div>

        {/* Screenshots */}
        <h2 className="text-lg font-bold mb-3">Screenshots</h2>
        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
          {movie.screenshots.map((ss, i) => (
            <div key={i} className="flex-shrink-0 rounded-xl overflow-hidden w-64 aspect-video">
              <img src={ss} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Download Float */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => navigate(`/download/${movie.id}`)}
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
