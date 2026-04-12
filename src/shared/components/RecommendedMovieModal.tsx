"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog";
import { useRef, useState, useMemo } from "react";
import { Play, Sparkles } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface IMovie {
  _id: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
}

interface IRecommendedMovie {
  recommendation: { _id: string }[];
  reason: string;
}

interface IRecommendedMovieModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  recommendedMovie: IRecommendedMovie | null;
  movies: IMovie[];
}

const RecommendedMovieModal = ({
  isOpen,
  setIsOpen,
  recommendedMovie,
  movies,
}: IRecommendedMovieModalProps) => {
  const [isMoviePlaying, setIsMoviePlaying] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const recommendedIds = useMemo(
    () =>
      new Set(
        (recommendedMovie?.recommendation ?? []).map((r) => String(r._id))
      ),
    [recommendedMovie]
  );

  const filterRecommendedMovie = useMemo(
    () => movies.filter((movie) => recommendedIds.has(movie._id)),
    [movies, recommendedIds]
  );

  const handlePlayMovie = async (movie: IMovie) => {
    if (!videoRef.current) return;
    videoRef.current.src = movie.videoUrl;
    videoRef.current.poster = movie.thumbnailUrl;
    try {
      await videoRef.current.play();
      setIsMoviePlaying(true);
      await videoRef.current.requestFullscreen?.();
    } catch {
      setIsMoviePlaying(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden border border-white/10 bg-gradient-to-b from-[#181818] to-[#0d0d0d] p-0 text-white shadow-2xl lg:max-w-3xl">
        <div className="shrink-0 border-b border-white/10 bg-gradient-to-r from-[#e50914]/15 to-transparent px-6 py-5">
          <DialogHeader className="gap-3 text-left">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white sm:text-2xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e50914]/25">
                <Sparkles className="h-5 w-5 text-[#e50914]" />
              </span>
              Your picks
            </DialogTitle>
            {recommendedMovie?.reason ? (
              <DialogDescription asChild>
                <p className="rounded-lg border border-white/10 bg-black/40 p-3 text-sm leading-relaxed text-neutral-300">
                  {recommendedMovie.reason}
                </p>
              </DialogDescription>
            ) : null}
          </DialogHeader>
        </div>

        <div className="scrollbar-netflix flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-6 pb-6">
          <video
            ref={videoRef}
            controls
            className={cn(
              "w-full overflow-hidden rounded-lg border border-white/10 bg-black",
              isMoviePlaying ? "max-h-[50vh]" : "hidden h-0"
            )}
          />

          {filterRecommendedMovie.length === 0 ? (
            <div className="rounded-lg border border-dashed border-white/20 bg-white/5 px-4 py-8 text-center text-sm text-neutral-400">
              No catalog entries matched those IDs. Regenerate recommendations
              or check that your movie database is in sync.
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {filterRecommendedMovie.map((movie, index) => (
                <li key={movie._id}>
                  <button
                    type="button"
                    className={cn(
                      "group flex w-full gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-left transition-all",
                      "hover:border-[#e50914]/60 hover:bg-white/[0.06]",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e50914]"
                    )}
                    onMouseEnter={() => setHoveredId(movie._id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => handlePlayMovie(movie)}
                  >
                    <span className="flex w-6 shrink-0 items-start justify-center pt-1 font-mono text-sm text-neutral-500">
                      {index + 1}
                    </span>

                    <div className="relative h-[4.5rem] w-28 shrink-0 overflow-hidden rounded-md bg-neutral-900">
                      <Image
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        src={movie.thumbnailUrl}
                        width={112}
                        height={72}
                        alt={movie.title}
                      />
                      <span
                        className={cn(
                          "absolute inset-0 flex items-center justify-center bg-black/55 transition-opacity",
                          hoveredId === movie._id ? "opacity-100" : "opacity-0"
                        )}
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg">
                          <Play className="ml-0.5 h-4 w-4 fill-current" />
                        </span>
                      </span>
                    </div>

                    <div className="min-w-0 flex-1 py-0.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-semibold text-white">
                          {movie.title}
                        </span>
                        <span className="shrink-0 text-xs text-neutral-500">
                          {movie.duration}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-neutral-400">
                        {movie.description}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecommendedMovieModal;
