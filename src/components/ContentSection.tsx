import { ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import type { Movie } from "@/data/mockData";

interface ContentSectionProps {
  title: string;
  movies: Movie[];
  onViewMore?: () => void;
}

const ContentSection = ({ title, movies, onViewMore }: ContentSectionProps) => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold">{title}</h2>
        {onViewMore && (
          <button
            onClick={onViewMore}
            className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
          >
            View More
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default ContentSection;
