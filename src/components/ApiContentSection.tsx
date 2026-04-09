import { ChevronRight } from "lucide-react";
import ApiMovieCard from "./ApiMovieCard";
import { type ApiItem } from "@/lib/api";

interface ApiContentSectionProps {
  title: string;
  items: ApiItem[];
  loading?: boolean;
  onViewMore?: () => void;
}

const ApiContentSection = ({ title, items, loading, onViewMore }: ApiContentSectionProps) => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold">{title}</h2>
        {onViewMore && (
          <button
            onClick={onViewMore}
            className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
          >
            View More
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[140px] md:w-[180px]">
              <div className="aspect-[2/3] rounded-xl bg-secondary animate-pulse mb-2" />
              <div className="h-4 bg-secondary rounded animate-pulse mb-1" />
              <div className="h-3 bg-secondary rounded animate-pulse w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {items.map((item) => (
            <ApiMovieCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ApiContentSection;
