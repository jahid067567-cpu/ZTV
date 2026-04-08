import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import type { Movie } from "@/data/mockData";

const MovieCard = ({ movie }: { movie: Movie }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/info/${movie.id}`)}
      className="flex-shrink-0 w-[140px] md:w-[180px] group text-left"
    >
      <div className="relative overflow-hidden rounded-xl mb-2 aspect-[2/3]">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2 right-2 glass rounded-lg px-2 py-1 flex items-center gap-1">
          <Star className="w-3 h-3 text-primary fill-primary" />
          <span className="text-xs font-bold">{movie.rating}</span>
        </div>
      </div>
      <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
      <p className="text-xs text-muted-foreground">{movie.year} • {movie.type === "series" ? "Series" : "Movie"}</p>
    </button>
  );
};

export default MovieCard;
