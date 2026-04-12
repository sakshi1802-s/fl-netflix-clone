"use client";

import useUserStore from "@/stores/user.store";
import { IMovie } from "@/types/movie.type";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

const MoviePopup = ({
  movie,
  handleOpenInfoModal,
}: {
  movie: IMovie;
  handleOpenInfoModal: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const { user, updateUser, updateFavourites } = useUserStore();

const isFavourite = useMemo (() => {
    return user?.favourites.includes(movie._id);
}, [user, movie]);

  //  PLAY BUTTON
  const handlePlayButtonClick = () => {
    if (videoRef.current) {
      setIsVideoPlaying(true);
      videoRef.current.play();
      videoRef.current.requestFullscreen();
    }
  };

  //  ADD / REMOVE FAVOURITES
  const toggleFavourites = async (movieId: string) => {
    try {
        if( isFavourite)
        {
            await axios.delete("/api/favourite", { data: { movieId }});
        }
        else{
      await axios.post("/api/favourite", { movieId });
        }
        updateUser();
        updateFavourites();
    } catch (error) {
      console.log(error);
    }
  };

  // 🎥 FULLSCREEN EXIT HANDLER
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsVideoPlaying(false);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <div
      className="absolute -left-8 w-80 z-10 -top-16 rounded-md text-base 
      transform scale-75 hover:scale-100 hover:-translate-y-6 
      transition duration-300 ease-in-out"
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        src={movie.videoUrl}
        poster={movie.thumbnailUrl}
        className={clsx({ hidden: !isVideoPlaying })}
      />

      {/* IMAGE */}
      <div className="relative w-80 h-[140px]">
        <Image
          className="object-cover"
          src={movie.thumbnailUrl}
          alt={movie.title}
          fill
        />
      </div>

      {/* CONTENT */}
      <div className="bg-[#181818] p-4">
        <div className="flex justify-between mb-2 items-center">
          <div className="flex gap-2 items-center">
            {/* PLAY */}
            <button
              className="bg-white border-2 rounded-full p-2 
              border-[#ffffff80] cursor-pointer"
              onClick={handlePlayButtonClick}
            >
              <Image
                src="/assets/play.svg"
                width={20}
                height={20}
                alt="Play"
              />
            </button>

            {/* ADD */}
            <button
              className="bg-[#2a2a2a99] border-2 rounded-full p-2 
              border-[#ffffff80] cursor-pointer"
              onClick={() => toggleFavourites(movie._id)}
            >
              <Image
                src={isFavourite ? "/assets/white-tick.svg" : "/assets/plus.svg"}
                width={20}
                height={20}
                alt="Add"
              />
            </button>
          </div>

          {/* INFO */}
          <button
            className="cursor-pointer bg-[#2a2a2a99] border-2 
            border-[#ffffff80] p-2 rounded-full 
            hover:bg-[#ffffff1a]"
            onClick={handleOpenInfoModal}
          >
            <Image
              src="/assets/down-arrow.svg"
              width={24}
              height={24}
              alt="More"
            />
          </button>
        </div>

        {/* DETAILS */}
        <div className="flex gap-2 items-center mt-4">
          <span
            className="px-2 uppercase whitespace-nowrap 
            text-[#bcbcbc] text-sm font-medium 
            border border-[#fff6]"
          >
            U/A 13+
          </span>

          <span className="text-[#bcbcbc] text-base">
            {movie.duration}
          </span>

          <span
            className="text-[#bcbcbc] border border-[#fff6] 
            rounded-[3px] text-xs px-1.5"
          >
            HD
          </span>
        </div>

        <p className="text-sm text-[#bcbcbc] mt-2">
          {movie.genre}
        </p>
      </div>
    </div>
  );
};

export default MoviePopup;