"use client";

import { IMovie } from "@/types/movie.type";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import MovieInfoModal from "./MovieinfoModal";

const Billboard = () => {
  const [randomMovie, setRandomMovie] = useState<IMovie | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const fetchMovies = async () => {
    try {
      const { data } = await axios.get("/api/movies");
      console.log("Movies data:", data);
      if (data && data.length > 0) {
        const randomNum = Math.floor(Math.random() * data.length);
        setRandomMovie(data[randomNum]);
        console.log("Selected movie:", data[randomNum]);
        console.log("Video URL:", data[randomNum]?.videoUrl);
        
        // Test if video loads
        if (data[randomNum]?.videoUrl) {
          const video = document.createElement('video');
          video.src = data[randomNum].videoUrl;
          video.onloadedmetadata = () => {
            console.log("Video loaded successfully, duration:", video.duration);
          };
          video.onerror = (e) => {
            console.log("Video failed to load:", e);
            console.log("Video URL that failed:", data[randomNum].videoUrl);
            
            // Fallback to placeholder video if original fails
            const fallbackVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
            setRandomMovie(prev => prev ? { ...prev, videoUrl: fallbackVideoUrl } : null);
          };
          video.load();
        }
      }
    } catch (error) {
      console.log("Error fetching movies:", error);
    }
  };

  const handlePlayButtonClick = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleOpenInfoModal = () => {
    setShowInfoModal(true);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="h-screen relative">
      <video
      key={randomMovie?.videoUrl}
        src={randomMovie?.videoUrl}
        poster={randomMovie?.thumbnailUrl}
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="absolute top-1/2 left-10 -translate-y-1/2 transform flex flex-col gap-4 z-10">
        <h1 className="text-5xl text-white font-bold">
          {randomMovie?.title}
        </h1>

        <p className="text-white">{randomMovie?.description}</p>

        <div className="flex gap-2">
          <button
            className="text-lg font-semibold bg-white py-2 px-5 text-black rounded-sm cursor-pointer flex gap-4 hover:bg-[#ffffffbf]"
            onClick={handlePlayButtonClick}
          >
            <Image
              src="/assets/play.svg"
              width={24}
              height={24}
              alt="Play video"
            />
            Play
          </button>

          <button
            className="text-lg font-semibold bg-[#6d6d6eb3] py-2 px-5 text-white rounded-sm cursor-pointer flex gap-4 hover:bg-[#6d6d6e]"
            onClick={handleOpenInfoModal}
          >
            <Image
              src="/assets/info.svg"
              width={24}
              height={24}
              alt="More info"
            />
            More Info
          </button>
        </div>
      </div>

      {showInfoModal ? (
        <MovieInfoModal
          showInfoModal = {showInfoModal}
          setShowInfoModal={setShowInfoModal}
          movieData={randomMovie}
          />
      ) : null}
  
    </div>
  );
};

export default Billboard;