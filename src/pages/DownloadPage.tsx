import { useState, useEffect } from "react";
import {
  ArrowLeft, Download, Globe, Loader2, ExternalLink,
  Film, Tv, ChevronDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchInfo,
  fetchDownloadLinks,
  cleanTitle,
  parseSeasonNumbers,
  parseQualities,
  qualityToNumber,
} from "@/lib/api";
import { addDownloadRecord } from "@/lib/downloadHistory";

// ─── helpers ────────────────────────────────────────────────────────────────

/**
 * Group download links by their `episode` label so we can render
 *   Episode 01
 *     [Server A]  [Server B]  [Server C]
 *   Episode 02
 *     …
 */
function groupByEpisode(
  data: { episode?: string; server: string; url: string }[],
) {
  const map = new Map<string, { server: string; url: string }[]>();
  for (const link of data) {
    const key = link.episode?.trim() || "";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push({ server: link.server, url: link.url });
  }
  return Array.from(map.entries()).map(([episode, servers]) => ({
    episode,
    servers,
  }));
}

// ─── component ───────────────────────────────────────────────────────────────

const DownloadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [selectedQuality, setSelectedQuality] = useState("");
  const [expandedEpisode, setExpandedEpisode] = useState<string | null>(null);

  // ── Info query ──────────────────────────────────────────────────────────
  const { data: infoData, isLoading: infoLoading } = useQuery({
    queryKey: ["info", id],
    queryFn: () => fetchInfo(id || ""),
    enabled: !!id,
  });

  const info = infoData?.data;
  const title = info ? cleanTitle(info.title) : "";

  // ── Parse seasons from "1 – 2 – 3 – 4" or "05" or "" ──────────────────
  const seasonNumbers = info ? parseSeasonNumbers(info.seasons) : [];
  // isMovie: no season field at all; isSingleSeason: one number only
  const isMovie = !info?.seasons || info.seasons.trim() === "";
  const isMultiSeason = seasonNumbers.length > 1;
  // If multi-season, the user picks; otherwise for series there is exactly 1 season
  const singleSeasonNum = !isMultiSeason && !isMovie
    ? (() => {
        const m = info?.seasons?.match(/\d+/);
        return m ? Number(m[0]) : 1;
      })()
    : null;

  // ── Parse qualities ─────────────────────────────────────────────────────
  const qualities = info ? parseQualities(info.quality) : ["720p", "1080p"];

  // ── Set defaults once info loads ────────────────────────────────────────
  useEffect(() => {
    if (!info) return;
    if (qualities.length > 0 && !selectedQuality) {
      setSelectedQuality(
        qualities.includes("1080p")
          ? "1080p"
          : qualities.includes("720p")
          ? "720p"
          : qualities[0],
      );
    }
    if (isMultiSeason && selectedSeason === null) {
      setSelectedSeason(seasonNumbers[0]);
    }
  }, [info, qualities, isMultiSeason, seasonNumbers, selectedQuality, selectedSeason]);

  const qualityNum = qualityToNumber(selectedQuality || qualities[0] || "720p");

  // ── Determine which season to pass to the download endpoint ────────────
  // movie → undefined (no se= param), single-season series → that number, multi → selected
  const seasonForEndpoint: number | undefined = isMovie
    ? undefined
    : isMultiSeason
    ? (selectedSeason ?? seasonNumbers[0])
    : singleSeasonNum ?? 1;

  // ── Download query ──────────────────────────────────────────────────────
  const canFetch =
    !!id &&
    !!selectedQuality &&
    (isMovie || isMultiSeason ? selectedSeason !== null : true);

  const { data: downloadData, isLoading: downloadLoading } = useQuery({
    queryKey: ["download", id, seasonForEndpoint, qualityNum],
    queryFn: () => fetchDownloadLinks(id!, qualityNum, seasonForEndpoint),
    enabled: canFetch,
    staleTime: 30000,
  });

  const groups = downloadData?.data ? groupByEpisode(downloadData.data) : [];
  const matchedSection = downloadData?.matched_section || "";

  // ── Language ────────────────────────────────────────────────────────────
  const langMatch = info?.language?.match(/^([^\n]+)/);
  const language = langMatch ? langMatch[1].trim() : "Dual Audio";

  // ── Loading / not-found states ──────────────────────────────────────────
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
        <p className="text-muted-foreground">Content not found</p>
      </div>
    );
  }

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen gradient-dark pb-10">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/30 px-4 py-3 md:px-8 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-secondary transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-sm font-bold truncate">{title}</h1>
          <p className="text-xs text-muted-foreground">{isMovie ? "Movie" : "Series"}</p>
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-2xl mx-auto mt-5 space-y-6">

        {/* ── Content type chip + language ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
              isMovie
                ? "bg-primary/20 text-primary"
                : "bg-blue-500/20 text-blue-400"
            }`}
          >
            {isMovie ? (
              <Film className="w-3.5 h-3.5" />
            ) : (
              <Tv className="w-3.5 h-3.5" />
            )}
            {isMovie ? "Movie" : "Series"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-secondary text-muted-foreground">
            <Globe className="w-3.5 h-3.5" />
            {language}
          </span>
        </div>

        {/* ── Season selector (only for multi-season) ── */}
        {isMultiSeason && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Select Season
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {seasonNumbers.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSeason(s)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    selectedSeason === s
                      ? "gradient-primary text-primary-foreground shadow-lg scale-105"
                      : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
                  }`}
                >
                  S{s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Single-season info box (no selector needed) ── */}
        {!isMultiSeason && !isMovie && (
          <div className="glass rounded-xl px-4 py-3 inline-flex items-center gap-2.5">
            <Tv className="w-4 h-4 text-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Season</p>
              <p className="text-sm font-bold">Season {singleSeasonNum ?? 1}</p>
            </div>
          </div>
        )}

        {/* ── Quality selector ── */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Quality
          </p>
          <div className="flex gap-2 flex-wrap">
            {qualities.map((q) => (
              <button
                key={q}
                onClick={() => setSelectedQuality(q)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  selectedQuality === q
                    ? "gradient-primary text-primary-foreground shadow-lg scale-105"
                    : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* ── Matched section label ── */}
        {matchedSection && (
          <div className="glass rounded-xl px-4 py-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
              Matched
            </p>
            <p className="text-xs font-medium text-foreground/80 leading-snug">
              {matchedSection}
            </p>
          </div>
        )}

        {/* ── Download Links ── */}
        <div>
          <h2 className="text-base font-bold mb-4 flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" />
            Download Links
            {!isMovie && (selectedSeason || singleSeasonNum) && (
              <span className="text-xs text-muted-foreground font-normal">
                — Season {isMultiSeason ? selectedSeason : singleSeasonNum}
              </span>
            )}
          </h2>

          {downloadLoading ? (
            <div className="flex items-center justify-center py-14">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2.5 text-sm text-muted-foreground">
                Fetching links…
              </span>
            </div>
          ) : groups.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center">
              <Download className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm font-medium mb-1">No links available</p>
              <p className="text-xs text-muted-foreground">
                Try a different quality{isMultiSeason ? " or season" : ""}.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {groups.map(({ episode, servers }, gi) => (
                <div key={gi} className="rounded-2xl overflow-hidden border border-border/30">
                  {/* Episode header — always visible */}
                  {episode && (
                    <button
                      onClick={() =>
                        setExpandedEpisode(
                          expandedEpisode === episode ? null : episode,
                        )
                      }
                      className="w-full flex items-center justify-between px-4 py-3 bg-secondary/60 hover:bg-secondary transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-sm font-semibold">{episode}</span>
                        <span className="text-xs text-muted-foreground">
                          {servers.length} server{servers.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform ${
                          expandedEpisode === episode ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}

                  {/* Server buttons — always shown for movies/single groups, collapsible for episodes */}
                  {(!episode || expandedEpisode === episode || groups.length === 1) && (
                    <div className="divide-y divide-border/20">
                      {servers.map((link, si) => (
                        <a
                          key={si}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            addDownloadRecord({
                              contentId: id!,
                              title,
                              poster: info.images?.[0] || "",
                              quality: selectedQuality,
                              type: isMovie ? "movie" : "series",
                              season: seasonForEndpoint,
                              episode: episode || undefined,
                              server: link.server,
                            });
                          }}
                          className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-hover transition-colors group"
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              si === 0
                                ? "gradient-primary glow-sm"
                                : "bg-primary/15"
                            }`}
                          >
                            <Download
                              className={`w-4 h-4 ${
                                si === 0
                                  ? "text-primary-foreground"
                                  : "text-primary"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {link.server}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {selectedQuality} • {language}
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
