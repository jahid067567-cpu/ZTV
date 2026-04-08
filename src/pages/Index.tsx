import { Search, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeroSlider from "@/components/HeroSlider";
import ContentSection from "@/components/ContentSection";
import BottomNav from "@/components/BottomNav";
import { getLatest, getMovies, getSeries } from "@/data/mockData";

const Index = () => {
  const navigate = useNavigate();

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
        <HeroSlider />
        <ContentSection title="🔥 Latest Releases" movies={getLatest()} onViewMore={() => navigate("/latest")} />
        <ContentSection title="🎬 Movies" movies={getMovies()} onViewMore={() => navigate("/movies")} />
        <ContentSection title="📺 Series" movies={getSeries()} onViewMore={() => navigate("/series")} />
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
