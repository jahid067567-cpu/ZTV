import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MovieCard from "@/components/MovieCard";
import BottomNav from "@/components/BottomNav";
import { getMovies } from "@/data/mockData";

const ITEMS_PER_PAGE = 6;

const MoviesPage = () => {
  const navigate = useNavigate();
  const allMovies = getMovies();
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(allMovies.length / ITEMS_PER_PAGE);
  const items = allMovies.slice(0, page * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen gradient-dark pb-24">
      <div className="flex items-center gap-3 px-4 py-4 md:px-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-secondary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">🎬 Movies</h1>
      </div>

      <div className="px-4 md:px-8">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {page < totalPages && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="gradient-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold text-sm hover:scale-105 transition-transform"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default MoviesPage;
