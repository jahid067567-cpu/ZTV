import { Search, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ApiHeroSlider from "@/components/ApiHeroSlider";
import ApiContentSection from "@/components/ApiContentSection";
import BottomNav from "@/components/BottomNav";
import { fetchLatestReleases, fetchMovies, fetchSeries } from "@/lib/api";

const Index = () => {
  const navigate = useNavigate();

  const { data: latestData, isLoading: latestLoading } = useQuery({
    queryKey: ["latest"],
    queryFn: () => fetchLatestReleases(),
  });

  const { data: moviesData, isLoading: moviesLoading } = useQuery({
    queryKey: ["movies", 1],
    queryFn: () => fetchMovies(1),
  });

  const { data: seriesData, isLoading: seriesLoading } = useQuery({
    queryKey: ["series", 1],
    queryFn: () => fetchSeries(1),
  });

  return (
    <div className="min-h-screen gradient-dark pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <button onClick={() => navigate("/search")} className="p-2 rounded-xl hover:bg-secondary transition-colors">
          <Search className="w-5 h-5 text-muted-foreground" />
        </button>
        <h1 className="text-xl font-bold text-gradient tracking-tight">CINEMAX</h1>
        <button className="p-2 rounded-xl hover:bg-secondary transition-colors">
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 space-y-6">
        <ApiHeroSlider items={latestData?.data || []} />
        <ApiContentSection
          title="🔥 Latest Releases"
          items={latestData?.data?.slice(0, 10) || []}
          loading={latestLoading}
          onViewMore={() => navigate("/latest")}
        />
        <ApiContentSection
          title="🎬 Movies"
          items={moviesData?.data?.slice(0, 10) || []}
          loading={moviesLoading}
          onViewMore={() => navigate("/movies")}
        />
        <ApiContentSection
          title="📺 Series"
          items={seriesData?.data?.slice(0, 10) || []}
          loading={seriesLoading}
          onViewMore={() => navigate("/series")}
        />
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
