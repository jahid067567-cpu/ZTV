import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { type ApiItem, parseRating } from "@/lib/api";

const ApiMovieCard = ({ item }: { item: ApiItem }) => {
  const navigate = useNavigate();
  const rating = parseRating(item.imdb);

  return (
    <button
      onClick={() => navigate(`/info/${item.id}`)}
      className="flex-shrink-0 w-[140px] md:w-[180px] group text-left min-w-0"
    >
      <div className="relative overflow-hidden rounded-xl mb-2 aspect-[2/3]">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {rating !== "N/A" && (
          <div className="absolute top-2 right-2 glass rounded-lg px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 text-primary fill-primary" />
            <span className="text-xs font-bold">{rating}</span>
          </div>
        )}
        {item.quality && (
          <div className="absolute top-2 left-2 bg-primary/90 rounded-lg px-2 py-0.5">
            <span className="text-[10px] font-bold text-primary-foreground">{item.quality}</span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold truncate">{item.title.replace(/^Download\s+/i, "").split(/\s+(Dual|BluRay|\(|{|480p|720p|WEB)/i)[0].trim()}</h3>
      <p className="text-xs text-muted-foreground">{item.quality}</p>
    </button>
  );
};

export default ApiMovieCard;
