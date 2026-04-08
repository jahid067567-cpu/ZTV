import { useState } from "react";
import { ArrowLeft, Download, Globe } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieById } from "@/data/mockData";

const DownloadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = getMovieById(id || "");
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState("");

  if (!movie) {
    return (
      <div className="min-h-screen gradient-dark flex items-center justify-center">
        <p className="text-muted-foreground">Not found</p>
      </div>
    );
  }

  const hasSeason = movie.type === "series" && (movie.seasons || 1) > 1;
  const qualities = movie.qualities || ["720p", "1080p"];

  return (
    <div className="min-h-screen gradient-dark pb-8">
      {/* Header */}
      <div className="px-4 py-4 md:px-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-secondary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 md:px-8 max-w-2xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>

        {/* Language */}
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Available in <span className="text-foreground font-medium">{movie.language}</span></span>
        </div>

        {/* Selection Buttons */}
        <div className="flex gap-3 mb-6">
          {/* Season / Movie label */}
          <div className="flex-1">
            {hasSeason ? (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Season</p>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                  {Array.from({ length: movie.seasons || 1 }, (_, i) => i + 1).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSeason(s)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        selectedSeason === s
                          ? "gradient-primary text-primary-foreground glow-sm"
                          : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
                      }`}
                    >
                      S{s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass rounded-xl px-4 py-3">
                <p className="text-xs text-muted-foreground mb-0.5">Type</p>
                <p className="text-sm font-semibold">
                  {movie.type === "movie" ? "Movie" : `Season ${movie.seasons || 1}`}
                </p>
              </div>
            )}
          </div>

          {/* Quality */}
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-2">Quality</p>
            <div className="flex gap-2 flex-wrap">
              {qualities.map((q) => (
                <button
                  key={q}
                  onClick={() => setSelectedQuality(q)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    selectedQuality === q
                      ? "gradient-primary text-primary-foreground glow-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Download Servers */}
        <h2 className="text-lg font-bold mb-3">Download Links</h2>
        <div className="space-y-3">
          {movie.servers.map((server, i) => (
            <button
              key={i}
              className="w-full glass rounded-xl p-4 flex items-center justify-between hover:bg-surface-hover transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-sm">
                  <Download className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">{server.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedQuality || qualities[0]} • {movie.language}
                  </p>
                </div>
              </div>
              <span className="text-xs text-primary font-semibold group-hover:underline">
                Download
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
