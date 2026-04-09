import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { type ApiItem, parseRating } from "@/lib/api";

const ApiHeroSlider = ({ items }: { items: ApiItem[] }) => {
  const heroItems = items.slice(0, 5);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (heroItems.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroItems.length]);

  if (heroItems.length === 0) {
    return (
      <div className="w-full h-[55vh] md:h-[65vh] rounded-2xl bg-secondary animate-pulse" />
    );
  }

  const item = heroItems[current];
  const rating = parseRating(item.imdb);
  const cleanName = item.title
    .replace(/^Download\s+/i, "")
    .split(/\s+(Dual|BluRay|\(|{|480p|720p|WEB)/i)[0]
    .trim();

  return (
    <div className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden rounded-2xl">
      {heroItems.map((movie, i) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      ))}

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
        <div className="flex items-center gap-2 mb-2">
          {rating !== "N/A" && (
            <>
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-semibold text-primary">{rating}</span>
            </>
          )}
          {item.quality && (
            <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary font-medium">
              {item.quality}
            </span>
          )}
        </div>
        <h2 className="text-2xl md:text-4xl font-bold mb-3">{cleanName}</h2>
        <button
          onClick={() => navigate(`/info/${item.id}`)}
          className="gradient-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold text-sm glow-primary hover:scale-105 transition-transform"
        >
          Download Now
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 right-6 flex gap-2 z-10">
        {heroItems.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? "bg-primary w-6" : "bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ApiHeroSlider;
