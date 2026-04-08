import { ArrowLeft, Download, Pause, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockDownloads } from "@/data/mockData";
import BottomNav from "@/components/BottomNav";

const statusIcon = {
  downloading: <Download className="w-4 h-4 text-primary animate-pulse" />,
  completed: <CheckCircle className="w-4 h-4 text-primary" />,
  paused: <Pause className="w-4 h-4 text-muted-foreground" />,
};

const statusLabel = {
  downloading: "Downloading",
  completed: "Completed",
  paused: "Paused",
};

const LibraryPage = () => {
  const navigate = useNavigate();
  const completed = mockDownloads.filter((d) => d.status === "completed");
  const active = mockDownloads.filter((d) => d.status !== "completed");

  return (
    <div className="min-h-screen gradient-dark pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 md:px-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-secondary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Library</h1>
      </div>

      <div className="px-4 md:px-8 max-w-2xl mx-auto">
        {/* Active Downloads */}
        {active.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Active Downloads
            </h2>
            <div className="space-y-3">
              {active.map((item) => (
                <div key={item.id} className="glass rounded-xl p-4 animate-slide-in">
                  <div className="flex gap-3">
                    <div className="w-16 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-sm font-semibold truncate pr-2">{item.title}</h3>
                        {statusIcon[item.status]}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {item.quality} • {item.size} • {statusLabel[item.status]}
                      </p>
                      {/* Progress Bar */}
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full gradient-primary rounded-full transition-all duration-500"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-primary font-semibold mt-1">{item.progress}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Completed */}
        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Download History
          </h2>
          {completed.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Download className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No downloads yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completed.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/info/${item.movieId}`)}
                  className="w-full glass rounded-xl p-4 flex gap-3 text-left hover:bg-surface-hover transition-colors animate-slide-in"
                >
                  <div className="w-12 h-18 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.quality} • {item.size}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 self-center" />
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <BottomNav />
    </div>
  );
};

export default LibraryPage;
