import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ApiMovieCard from "@/components/ApiMovieCard";
import BottomNav from "@/components/BottomNav";
import { fetchSeries, type ApiItem } from "@/lib/api";

const SeriesPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["series-page", page],
    queryFn: async () => {
      const results: ApiItem[] = [];
      for (let p = 1; p <= page; p++) {
        const res = await fetchSeries(p);
        results.push(...(res.data || []));
      }
      const lastRes = await fetchSeries(page);
      return { items: results, totalPages: lastRes.total_pages };
    },
  });

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen gradient-dark pb-28">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/30 px-4 py-3 md:px-8 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-secondary transition-colors flex-shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">📺 Series</h1>
      </div>

      <div className="px-4 md:px-8 mt-5">
        {isLoading && items.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[2/3] rounded-xl bg-secondary animate-pulse mb-2" />
                <div className="h-3 bg-secondary rounded animate-pulse mb-1.5" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {items.map((item: ApiItem, idx: number) => (
              <ApiMovieCard key={`${item.id}-${idx}`} item={item} />
            ))}
          </div>
        )}

        {page < totalPages && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={isLoading}
              className="gradient-primary text-primary-foreground px-10 py-3 rounded-xl font-semibold text-sm hover:scale-105 transition-transform disabled:opacity-60"
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

export default SeriesPage;
