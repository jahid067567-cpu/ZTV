import { useState } from "react";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ApiMovieCard from "@/components/ApiMovieCard";
import { searchContent } from "@/lib/api";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchContent(query),
    enabled: query.length > 2,
    staleTime: 30000,
  });

  const results = data?.data || [];

  return (
    <div className="min-h-screen gradient-dark pb-8">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/30 px-4 py-3 md:px-8 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-secondary transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search movies & series..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-secondary rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          />
        </div>
      </div>

      {/* Results */}
      <div className="px-4 md:px-8 mt-5">
        {query.length <= 2 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <div className="w-20 h-20 rounded-full bg-secondary/60 flex items-center justify-center mb-4">
              <SearchIcon className="w-9 h-9 opacity-40" />
            </div>
            <p className="text-base font-medium mb-1">Search for anything</p>
            <p className="text-sm opacity-60">Movies, series, and more</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[2/3] rounded-xl bg-secondary animate-pulse mb-2" />
                <div className="h-3 bg-secondary rounded animate-pulse mb-1.5" />
                <div className="h-2.5 bg-secondary rounded animate-pulse w-2/3" />
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <p className="text-lg font-semibold mb-1">No results found</p>
            <p className="text-sm opacity-60">Try a different search term</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-3">{results.length} results for "<span className="text-foreground">{query}</span>"</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {results.map((item) => (
                <ApiMovieCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
