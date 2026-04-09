import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ApiMovieCard from "@/components/ApiMovieCard";
import BottomNav from "@/components/BottomNav";
import { fetchSeries } from "@/lib/api";

const SeriesPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["series-page", page],
    queryFn: async () => {
      const results = [];
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
    <div className="min-h-screen gradient-dark pb-24">
      <div className="flex items-center gap-3 px-4 py-4 md:px-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-secondary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">📺 Series</h1>
      </div>

      <div className="px-4 md:px-8">
        {isLoading && items.length === 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[2/3] rounded-xl bg-secondary animate-pulse mb-2" />
                <div className="h-4 bg-secondary rounded animate-pulse mb-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {items.map((item: any, idx: number) => (
              <ApiMovieCard key={`${item.id}-${idx}`} item={item} />
            ))}
          </div>
        )}

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

export default SeriesPage;
