import { useState, useEffect } from "react";
import { ArrowLeft, Download, CheckCircle, Trash2, Film, Tv, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import {
  getDownloadHistory,
  clearDownloadHistory,
  formatDownloadDate,
  type DownloadRecord,
} from "@/lib/downloadHistory";

const LibraryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<DownloadRecord[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);

  // Read from localStorage on mount and whenever the tab gets focus
  useEffect(() => {
    const load = () => setHistory(getDownloadHistory());
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  const handleClear = () => {
    if (confirmClear) {
      clearDownloadHistory();
      setHistory([]);
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  return (
    <div className="min-h-screen gradient-dark pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/30 px-4 py-3 md:px-8 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-secondary transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold flex-1">Library</h1>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
              confirmClear
                ? "bg-red-500/20 text-red-400"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            {confirmClear ? "Tap to confirm" : "Clear"}
          </button>
        )}
      </div>

      <div className="px-4 md:px-8 max-w-2xl mx-auto mt-5">
        {history.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <div className="w-20 h-20 rounded-full bg-secondary/60 flex items-center justify-center mb-4">
              <Download className="w-9 h-9 opacity-30" />
            </div>
            <p className="text-base font-semibold mb-1">No downloads yet</p>
            <p className="text-sm opacity-60 text-center max-w-xs">
              When you tap any download link, it will be tracked here automatically.
            </p>
          </div>
        ) : (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold">Download History</h2>
              <span className="ml-auto text-xs text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-full">
                {history.length}
              </span>
            </div>

            <div className="space-y-3">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/info/${item.contentId}`)}
                  className="w-full glass rounded-xl p-3.5 flex gap-3 text-left hover:bg-surface-hover transition-colors"
                >
                  {/* Poster */}
                  <div className="w-11 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                    {item.poster ? (
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-4 h-4 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-1.5 mb-0.5">
                      <h3 className="text-sm font-semibold truncate flex-1">{item.title}</h3>
                      {/* Type badge */}
                      <span
                        className={`flex-shrink-0 inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                          item.type === "series"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-primary/20 text-primary"
                        }`}
                      >
                        {item.type === "series" ? (
                          <><Tv className="w-2.5 h-2.5" />TV</>
                        ) : (
                          <><Film className="w-2.5 h-2.5" />Film</>
                        )}
                      </span>
                    </div>

                    {/* Season / Episode */}
                    {(item.season !== undefined || item.episode) && (
                      <p className="text-xs text-primary font-medium truncate mb-0.5">
                        {item.season !== undefined && `Season ${item.season}`}
                        {item.season !== undefined && item.episode && " · "}
                        {item.episode}
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground truncate">
                      {item.quality} · {item.server}
                    </p>

                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-2.5 h-2.5 text-muted-foreground/50" />
                      <p className="text-[10px] text-muted-foreground/50">
                        {formatDownloadDate(item.downloadedAt)}
                      </p>
                    </div>
                  </div>

                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 self-center" />
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default LibraryPage;
