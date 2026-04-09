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
    <div className="min-h-screen gradient-dark">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 md:px-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-secondary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search movies & series..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-secondary rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          />
        </div>
      </div>

      {/* Results */}
      <div className="px-4 md:px-8 mt-4">
        {query.length <= 2 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <SearchIcon className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-sm">Search for your favorite movies & series</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[2/3] rounded-xl bg-secondary animate-pulse mb-2" />
                <div className="h-4 bg-secondary rounded animate-pulse mb-1" />
                <div className="h-3 bg-secondary rounded animate-pulse w-2/3" />
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-lg font-semibold mb-1">No results found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-3">
            {results.map((item) => (
              <ApiMovieCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
