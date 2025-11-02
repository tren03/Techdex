import Navbar from "@/components/Navbar";
import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import podcastsRaw from "../data/podcasts.json";

interface PodcastChapter {
  id: string | number;
  title: string;
  url: string;
  summary?: string;
  addedAt: string;
}

interface PodcastBook {
  bookTitle: string;
  chapters: PodcastChapter[];
}

interface PodcastsData {
  books: PodcastBook[];
}

interface PodcastEpisode {
  id: string | number;
  bookTitle: string;
  chapterTitle: string;
  url: string;
  summary?: string;
  addedAt: Date;
}

interface AudioPlayerProps {
  episode: PodcastEpisode;
  isPlaying: boolean;
  onPlayPause: () => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
}

function AudioPlayer({
  episode,
  isPlaying,
  onPlayPause,
  onTimeUpdate,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);

  console.log(
    "[AudioPlayer] Render - isPlaying:",
    isPlaying,
    "isLoading:",
    isLoading,
    "episode:",
    episode.chapterTitle
  );

  // Reset error and loading state when episode changes
  useEffect(() => {
    setError(null);
    setIsLoading(false);
    setCurrentTime(0);
    setDuration(0);
    setPresignedUrl(null);
  }, [episode.url]);

  // Fetch presigned URL from API
  const fetchPresignedUrl = useCallback(async () => {
    if (presignedUrl) {
      return presignedUrl; // Return cached presigned URL if available
    }

    try {
      setIsLoading(true);
      setError(null);
      const apiUrl = `/api/presigned-url`;
      console.log("Fetching presigned URL from:", apiUrl);
      console.log("Episode URL:", episode.url);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: episode.url }),
      });
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
        }));
        console.error("API error:", errorData);
        throw new Error(
          errorData.error ||
            `Failed to generate presigned URL: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(
        "Presigned URL received:",
        data.presignedUrl ? "Success" : "Failed"
      );
      setPresignedUrl(data.presignedUrl);
      return data.presignedUrl;
    } catch (err) {
      console.error("Error fetching presigned URL:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate presigned URL";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [episode.url, presignedUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      onTimeUpdate(audio.currentTime, audio.duration || 0);
    };

    const updateDuration = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };

    const handleEnded = () => {
      onPlayPause(); // Reset playing state when audio ends
    };

    const handleError = (e: Event) => {
      setIsLoading(false);
      const error = (e.target as HTMLAudioElement).error;
      if (error) {
        let errorMessage = "Failed to load audio";
        switch (error.code) {
          case error.MEDIA_ERR_ABORTED:
            errorMessage = "Audio loading was aborted";
            break;
          case error.MEDIA_ERR_NETWORK:
            errorMessage = "Network error while loading audio";
            break;
          case error.MEDIA_ERR_DECODE:
            errorMessage = "Audio decoding error";
            break;
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "Audio format not supported or source not found";
            break;
        }
        setError(errorMessage);
      } else {
        setError("Unknown error loading audio");
      }
    };

    const handleLoadStart = () => {
      console.log("[AudioPlayer] loadstart event fired");
      setIsLoading(true);
      setError(null);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [onTimeUpdate, onPlayPause]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      console.log(
        "[AudioPlayer] isPlaying changed to true, fetching presigned URL..."
      );
      // Pause all other audio elements
      document.querySelectorAll("audio").forEach((a) => {
        if (a !== audio) {
          a.pause();
          a.currentTime = 0;
        }
      });

      // Fetch presigned URL and play audio
      const playAudio = async () => {
        try {
          console.log("[AudioPlayer] Starting playAudio function");
          // Fetch presigned URL first
          const url = await fetchPresignedUrl();
          console.log("[AudioPlayer] Got presigned URL:");

          // Update audio source with presigned URL
          if (audio.src !== url) {
            audio.src = url;
          }

          // Wait for audio to be ready
          if (audio.readyState < 2) {
            console.log("[AudioPlayer] Waiting for audio to be ready...");
            await new Promise<void>((resolve, reject) => {
              const handleCanPlay = () => {
                console.log("[AudioPlayer] Audio can play");
                audio.removeEventListener("canplay", handleCanPlay);
                audio.removeEventListener("error", handleError);
                resolve();
              };
              const handleError = () => {
                console.error("[AudioPlayer] Audio error while loading");
                audio.removeEventListener("canplay", handleCanPlay);
                audio.removeEventListener("error", handleError);
                reject(new Error("Failed to load audio"));
              };
              audio.addEventListener("canplay", handleCanPlay);
              audio.addEventListener("error", handleError);
              // Load the audio if it hasn't started loading
              if (audio.readyState === 0) {
                audio.load();
              }
            });
          }

          console.log("[AudioPlayer] Playing audio...");
          await audio.play();
          setError(null);
          console.log("[AudioPlayer] Audio playing successfully");
        } catch (err) {
          console.error("[AudioPlayer] Error in playAudio:", err);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to play audio. Please check the audio URL."
          );
          onPlayPause(); // Reset playing state on error
        }
      };

      playAudio();
    } else {
      console.log("[AudioPlayer] isPlaying changed to false, pausing audio");
      audio.pause();
    }
  }, [isPlaying, onPlayPause, fetchPresignedUrl]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <audio
        ref={audioRef}
        src={presignedUrl || undefined}
        preload="none"
        crossOrigin="anonymous"
      />

      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-1">{episode.bookTitle}</div>
        <h3 className="text-xl font-semibold text-white">
          {episode.chapterTitle}
        </h3>
        <div className="text-sm text-gray-400 mt-1">
          Added: {episode.addedAt.toLocaleDateString()}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(
              "[AudioPlayer] Play button clicked, isPlaying:",
              isPlaying,
              "isLoading:",
              isLoading
            );
            console.log(
              "[AudioPlayer] Button not disabled, calling onPlayPause"
            );
            console.log("[AudioPlayer] onPlayPause function:", onPlayPause);
            onPlayPause();
            console.log("[AudioPlayer] onPlayPause called");
          }}
          disabled={isLoading}
          style={{ pointerEvents: isLoading ? "none" : "auto" }}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full p-3 transition-colors flex-shrink-0"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? (
            <svg
              className="w-6 h-6 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {episode.summary && (
        <div className="mt-4">
          <button
            onClick={() => setShowSummary(!showSummary)}
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            {showSummary ? "Hide Summary" : "Show Summary"}
          </button>
          {showSummary && (
            <div className="mt-2 text-gray-300 text-sm whitespace-pre-wrap">
              {episode.summary}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Podcasts() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [playingId, setPlayingId] = useState<string | number | null>(null);

  const episodes: PodcastEpisode[] = useMemo(() => {
    const data = podcastsRaw as PodcastsData;
    const flattened: PodcastEpisode[] = [];

    data.books.forEach((book) => {
      book.chapters.forEach((chapter) => {
        flattened.push({
          id: chapter.id,
          bookTitle: book.bookTitle,
          chapterTitle: chapter.title,
          url: chapter.url,
          summary: chapter.summary,
          addedAt: new Date(chapter.addedAt),
        });
      });
    });

    return flattened.reverse();
  }, []);

  const filteredEpisodes = episodes.filter((episode) => {
    const query = searchQuery.toLowerCase();
    return (
      episode.bookTitle.toLowerCase().includes(query) ||
      episode.chapterTitle.toLowerCase().includes(query) ||
      episode.summary?.toLowerCase().includes(query)
    );
  });

  const handlePlayPause = useCallback((id: string | number) => {
    console.log("[Podcasts] handlePlayPause called with id:", id);
    setPlayingId((prevId) => {
      console.log("[Podcasts] Previous playingId:", prevId, "New id:", id);
      // If clicking the same audio, toggle it
      if (prevId === id) {
        console.log("[Podcasts] Same audio clicked, toggling off");
        return null;
      }
      // Otherwise, play the new one (this will pause the previous one via the useEffect)
      console.log("[Podcasts] Switching to new audio");
      return id;
    });
  }, []);

  const handleTimeUpdate = useCallback(
    (_currentTime: number, _duration: number) => {
      // This can be used for additional functionality if needed
    },
    []
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="my-4 text-center font-bold text-3xl text-white">
          AI Podcasts
        </h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search podcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Podcast Episodes */}
        <div className="space-y-4">
          {filteredEpisodes.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No podcasts found matching your search.
            </div>
          ) : (
            filteredEpisodes.map((episode) => (
              <AudioPlayer
                key={episode.id}
                episode={episode}
                isPlaying={playingId === episode.id}
                onPlayPause={() => handlePlayPause(episode.id)}
                onTimeUpdate={handleTimeUpdate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
