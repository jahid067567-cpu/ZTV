import { Search, Bell } from "lucide-react";
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
    <div className="min-h-screen gradient-dark pb-28">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 md:px-8 sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <h1 className="text-xl font-extrabold text-gradient tracking-tight">CINEMAX</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate("/search")}
            className="p-2.5 rounded-xl hover:bg-secondary transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-secondary transition-colors" aria-label="Notifications">
            <Bell className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 space-y-6 mt-4">
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
