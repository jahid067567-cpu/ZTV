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
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[120px] sm:w-[140px] md:w-[160px]">
              <div className="aspect-[2/3] rounded-xl bg-secondary animate-pulse mb-2" />
              <div className="h-3 bg-secondary rounded animate-pulse mb-1" />
              <div className="h-2.5 bg-secondary rounded animate-pulse w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {items.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-[120px] sm:w-[140px] md:w-[160px]">
              <ApiMovieCard item={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ApiContentSection;
