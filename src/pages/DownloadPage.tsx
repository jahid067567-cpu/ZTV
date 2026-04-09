import { useState, useEffect } from "react";
import { ArrowLeft, Download, Globe, Loader2, ExternalLink } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchInfo, fetchDownloadLinks, cleanTitle, parseSeasonsCount, parseQualities, qualityToNumber } from "@/lib/api";

const DownloadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState("");

  const { data: infoData, isLoading: infoLoading } = useQuery({
    queryKey: ["info", id],
    queryFn: () => fetchInfo(id || ""),
    enabled: !!id,
  });

  const info = infoData?.data;
  const title = info ? cleanTitle(info.title) : "";
  const totalSeasons = info ? parseSeasonsCount(info.seasons) : 1;
  const qualities = info ? parseQualities(info.quality) : ["720p", "1080p"];
  const hasSeason = totalSeasons > 1;

  // Set default quality
  useEffect(() => {
    if (qualities.length > 0 && !selectedQuality) {
      setSelectedQuality(qualities.includes("720p") ? "720p" : qualities[0]);
    }
  }, [qualities, selectedQuality]);

  const qualityNum = qualityToNumber(selectedQuality || qualities[0]);

  const { data: downloadData, isLoading: downloadLoading } = useQuery({
    queryKey: ["download", id, selectedSeason, qualityNum],
    queryFn: () => fetchDownloadLinks(id || "", selectedSeason, qualityNum),
    enabled: !!id && !!selectedQuality,
  });

  const langMatch = info?.language?.match(/^([^\n]+)/);
  const language = langMatch ? langMatch[1].trim() : "Dual Audio";

  if (infoLoading) {
    return (
      <div className="min-h-screen gradient-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!info) {
    return (
      <div className="min-h-screen gradient-dark flex items-center justify-center">
        <p className="text-muted-foreground">Not found</p>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold mb-2">{title}</h1>

        {/* Language */}
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Available in <span className="text-foreground font-medium">{language}</span></span>
        </div>

        {/* Selection Buttons */}
        <div className="flex gap-3 mb-6">
          {/* Season / Movie label */}
          <div className="flex-1">
            {hasSeason ? (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Season</p>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                  {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
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
                  {totalSeasons === 1 ? "Season 1" : "Movie"}
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

        {downloadLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Fetching links...</span>
          </div>
        ) : downloadData?.data && downloadData.data.length > 0 ? (
          <div className="space-y-3">
            {downloadData.data.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full glass rounded-xl p-4 flex items-center justify-between hover:bg-surface-hover transition-colors group block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-sm">
                    <Download className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">{link.server}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedQuality} • {language}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-6 text-center">
            <p className="text-sm text-muted-foreground">No download links available for this selection.</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different quality or season.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
