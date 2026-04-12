"use client";

import { IMovie } from "@/types/movie.type";
import Image from "next/image";
import { useState } from "react";
import MoviePopup from "./MoviePopup";
import MovieInfoModal from "./MovieinfoModal";

interface MoviesProps {
  movies: IMovie[];
  label: string;
}

const Movies = ({ movies, label }: MoviesProps) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [movieData, setMovieData] = useState<IMovie | null>(null);

  const handleOpenInfoModal = (movie: IMovie) => {
    setMovieData(movie);
    setShowInfoModal(true);
  };

  return (
    <div className="pb-16">
      <div className="px-4 md:px-12 mt-4 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-lg md:text-2xl font-semibold">
            {label}
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {movies.map((movie) => (
            <div
              key={movie._id}
              className="group relative cursor-pointer"
              onMouseEnter={(e) => {
                const popup = e.currentTarget.querySelector('.movie-popup');
                if (popup) {
                  (popup as HTMLElement).style.display = 'block';
                }
              }}
              onMouseLeave={(e) => {
                const popup = e.currentTarget.querySelector('.movie-popup');
                if (popup) {
                  (popup as HTMLElement).style.display = 'none';
                }
              }}
            >
              <div className="relative w-full h-[200px]">
                <Image
                  src={movie.thumbnailUrl}
                  alt={movie.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="movie-popup absolute left-0 top-0 hidden z-20">
                <MoviePopup
                  movie={movie}
                  handleOpenInfoModal={() => handleOpenInfoModal(movie)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {movieData && (
        <MovieInfoModal
          showInfoModal={showInfoModal}
          setShowInfoModal={setShowInfoModal}
          movieData={movieData}
        />
      )}
    </div>
  );
};

export default Movies;
