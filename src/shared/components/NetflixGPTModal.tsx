"use client";

import { Film, Loader2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/Dialog";
import { Slider } from "./ui/Slider";
import { Badge } from "./ui/Badge";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import RecommendedMovieModal from "./RecommendedMovieModal";

interface IMovie {
  _id: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  rating?: number;
  genre?: string;
}

interface IRecommendedMovie {
  recommendation: { _id: string }[];
  reason: string;
}

interface INetflixGPTModalProps {
  isNetflixGPTModalOpen: boolean;
  setIsNetflixGPTModalOpen: (isOpen: boolean) => void;
}

const MOODS = ["Exciting", "Romantic", "Funny", "Dark", "Emotional", "Chill"];
const GENRES = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller"];

function recommendationErrorMessage(err: unknown): string {
  const ax = err as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  let msg =
    ax?.response?.data?.message ||
    (typeof ax?.message === "string" ? ax.message : "");

  if (!msg) {
    return "Could not get recommendations. Check your connection and try again.";
  }

  const trimmed = msg.trim();
  if (trimmed.startsWith("{") && trimmed.includes('"error"')) {
    return "AI quota or service limit — wait a minute and try again, or verify your API key in Google AI Studio.";
  }
  if (trimmed.length > 220) {
    return `${trimmed.slice(0, 217)}…`;
  }
  return msg;
}

const NetflixGPTModal = ({
  isNetflixGPTModalOpen,
  setIsNetflixGPTModalOpen,
}: INetflixGPTModalProps) => {
  const [duration, setDuration] = useState<number[]>([90]);
  const [rating, setRating] = useState<number[]>([6]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [recommendedMovie, setRecommendedMovie] =
    useState<IRecommendedMovie | null>(null);

  const [isRecommendedMovieModalOpen, setIsRecommendedMovieModalOpen] =
    useState(false);

  const fetchMovies = async () => {
    try {
      const { data } = await axios.get<IMovie[]>("/api/movies");
      setMovies(data);
    } catch (error) {
      console.log(error);
      toast.error("Could not load movies for recommendations.");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const handleRecommendMovie = async () => {
    if (movies.length === 0) {
      toast.error("Movies are still loading. Wait a second and try again.");
      return;
    }

    setIsLoading(true);
    try {
      const preferences = {
        genre: selectedGenres,
        minDuration: duration[0],
        minRating: rating[0],
        mood: selectedMoods,
      };

      const catalog = movies.map((m) => ({
        _id: m._id,
        title: m.title,
        description: m.description,
        duration: m.duration,
        rating: m.rating,
        genre: m.genre,
      }));

      const { data } = await axios.post<IRecommendedMovie>(
        "/api/recommendations",
        {
          movies: catalog,
          preferences,
        }
      );

      if (!data.recommendation?.length) {
        toast.error("No titles available to show. Add movies to your database.");
        return;
      }

      setRecommendedMovie(data);
      setIsNetflixGPTModalOpen(false);
      setIsRecommendedMovieModalOpen(true);
    } catch (err: unknown) {
      toast.error(recommendationErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={isNetflixGPTModalOpen}
        onOpenChange={setIsNetflixGPTModalOpen}
      >
        <DialogContent className="flex max-h-[90vh] max-w-lg flex-col overflow-hidden border border-white/10 bg-gradient-to-b from-[#141414] to-[#0b0b0b] p-0 text-white shadow-2xl sm:max-w-lg">
          <div className="shrink-0 border-b border-white/10 bg-[#e50914]/10 px-6 py-5">
            <DialogHeader className="gap-2 text-left">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e50914]/20">
                  <Film className="h-5 w-5 text-[#e50914]" />
                </span>
                Netflix GPT
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-neutral-400">
                Tune mood, genres, and filters — we&apos;ll pick titles from
                your catalog that fit.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="scrollbar-netflix flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-6 py-5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <label className="font-semibold text-neutral-100">
                  Minimum runtime
                </label>
                <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-xs text-neutral-300">
                  {duration[0]} min
                </span>
              </div>
              <Slider
                max={240}
                min={45}
                step={5}
                minStepsBetweenThumbs={1}
                value={duration}
                onValueChange={setDuration}
                className="py-1"
              />
              <p className="text-xs text-neutral-500">
                Only movies at least this long (approximate).
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <label className="font-semibold text-neutral-100">
                  Minimum rating
                </label>
                <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-xs text-neutral-300">
                  {rating[0].toFixed(1)} / 10
                </span>
              </div>
              <Slider
                max={10}
                min={0}
                step={0.5}
                minStepsBetweenThumbs={1}
                value={rating}
                onValueChange={setRating}
                className="py-1"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-neutral-100">
                Mood
              </label>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((mood) => (
                  <Badge
                    key={mood}
                    className={`cursor-pointer border px-3 py-1.5 text-xs transition-colors ${
                      selectedMoods.includes(mood)
                        ? "border-[#e50914] bg-[#e50914] text-white hover:bg-[#e50914]"
                        : "border-white/20 bg-transparent text-neutral-300 hover:border-white/40 hover:bg-white/5"
                    }`}
                    variant="outline"
                    onClick={() => toggleMood(mood)}
                  >
                    {mood}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-neutral-100">
                Genres
              </label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <Badge
                    key={genre}
                    className={`cursor-pointer border px-3 py-1.5 text-xs transition-colors ${
                      selectedGenres.includes(genre)
                        ? "border-[#e50914] bg-[#e50914] text-white hover:bg-[#e50914]"
                        : "border-white/20 bg-transparent text-neutral-300 hover:border-white/40 hover:bg-white/5"
                    }`}
                    variant="outline"
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="shrink-0 flex flex-col gap-2 border-t border-white/10 bg-black/30 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="order-2 w-full rounded-md border border-white/15 bg-transparent px-4 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:bg-white/5 sm:order-1 sm:w-auto"
              onClick={() => setIsNetflixGPTModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </button>

            <button
              type="button"
              className="order-1 flex w-full items-center justify-center gap-2 rounded-md bg-[#e50914] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition-transform hover:bg-[#f40612] active:scale-[0.98] disabled:opacity-60 sm:order-2 sm:w-auto"
              onClick={handleRecommendMovie}
              disabled={isLoading || movies.length === 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Finding picks…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Give recommendations
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isRecommendedMovieModalOpen && recommendedMovie ? (
        <RecommendedMovieModal
          isOpen={isRecommendedMovieModalOpen}
          setIsOpen={setIsRecommendedMovieModalOpen}
          recommendedMovie={recommendedMovie}
          movies={movies}
        />
      ) : null}
    </>
  );
};

export default NetflixGPTModal;
