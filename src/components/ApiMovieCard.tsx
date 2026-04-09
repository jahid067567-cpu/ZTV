import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { type ApiItem, parseRating } from "@/lib/api";

const ApiMovieCard = ({ item }: { item: ApiItem }) => {
  const navigate = useNavigate();
  const rating = parseRating(item.imdb);
  const cleanedTitle = item.title
    .replace(/^Download\s+/i, "")
    .split(/\s+(Dual|BluRay|\(|{|480p|720p|WEB)/i)[0]
    .trim();

  return (
    <button
      onClick={() => navigate(`/info/${item.id}`)}
      className="group text-left w-full"
    >
      <div className="relative overflow-hidden rounded-xl mb-2 aspect-[2/3] w-full bg-secondary">
        <img
          src={item.image}
          alt={cleanedTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {rating !== "N/A" && (
          <div className="absolute top-1.5 right-1.5 glass rounded-md px-1.5 py-0.5 flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 text-primary fill-primary" />
            <span className="text-[10px] font-bold">{rating}</span>
          </div>
        )}
        {item.quality && (
          <div className="absolute top-1.5 left-1.5 bg-primary/90 rounded-md px-1.5 py-0.5">
            <span className="text-[9px] font-bold text-primary-foreground leading-none">{item.quality.split("\n")[0]}</span>
          </div>
        )}
      </div>
      <h3 className="text-xs sm:text-sm font-semibold line-clamp-2 leading-tight mb-0.5">{cleanedTitle}</h3>
      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{item.quality?.split("\n")[0]}</p>
    </button>
  );
};

export default ApiMovieCard;
