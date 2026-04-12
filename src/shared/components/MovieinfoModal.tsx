"use client";

import { useMemo, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/ui/Dialog";
import Image from "next/image";
import { Dot } from "lucide-react";
import useUser from "@/stores/user.store";
import axios from "axios";

interface MovieData {
  _id?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
  genre?: string;
  mood?: string;
}

interface MovieInfoModalProps {
  showInfoModal: boolean;
  setShowInfoModal: (show: boolean) => void;
  movieData: MovieData;
}

const MovieInfoModal = ({
  showInfoModal,
  setShowInfoModal,
  movieData,
}: MovieInfoModalProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { updateUser, updateFavourites, user, favourites } = useUser();

  
  const isFavourite = useMemo(() => {
    return favourites?.some(
      (fav) => fav._id === movieData?._id
    );
  }, [favourites, movieData]);

  const handlePlayButtonClick = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  };

  
  const toggleFavourite = async () => {
    try {
      if (isFavourite) {
        await axios.delete("/api/favourite", {
          data: { movieId: movieData?._id },
        });
      } else {
        await axios.post("/api/favourite", {
          movieId: movieData?._id,
        });
      }

      updateUser();
      updateFavourites();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
      <DialogTitle className="sr-only">
        {movieData?.title || "Movie Information"}
      </DialogTitle>

      <DialogContent className="bg-[#181818] border-none min-w-[700px] p-0 max-w-[700px]">
        <div className="flex flex-col gap-4 w-full">

          {/* VIDEO */}
          <div className="relative">
            <video
              ref={videoRef}
              src={movieData?.videoUrl}
              poster={movieData?.thumbnailUrl}
              className="w-full h-[350px] object-cover"
              autoPlay
              loop
              muted
              playsInline
            />

            {/* TITLE + BUTTONS */}
            <div className="absolute bottom-4 left-6 flex flex-col gap-5 items-start">
              <h1 className="text-4xl text-white font-bold">
                {movieData?.title}
              </h1>

              <div className="flex gap-3">

                {/* PLAY */}
                <button
                  className="flex gap-2 bg-white p-2 px-3.5 rounded-sm items-center cursor-pointer font-bold"
                  onClick={handlePlayButtonClick}
                >
                  <Image
                    src="/assets/play.svg"
                    width={20}
                    height={20}
                    alt="Play"
                  />
                  Play
                </button>

                {/* FAVOURITE */}
                <button
                  className="bg-transparent border-2 rounded-full p-2 border-white cursor-pointer"
                  onClick={toggleFavourite}
                >
                  <Image
                    src={`/assets/${isFavourite ? "white-tick" : "plus"}.svg`}  // ✅ FIXED
                    width={20}
                    height={20}
                    alt="Add"
                  />
                </button>

              </div>
            </div>
          </div>

          {/* INFO */}
          <div className="flex flex-col gap-6 p-10">

            <div className="flex gap-2 items-center">
              <span className="px-2 uppercase text-sm text-[#bcbcbc] font-medium border border-[#fff6]">
                U/A 13+
              </span>

              <span className="text-[#bcbcbc] text-base">
                {movieData?.duration}
              </span>

              <span className="text-[#bcbcbc] border border-[#fff6] rounded-[3px] text-xs px-1.5">
                HD
              </span>
            </div>

            <p className="text-base leading-[26px] text-white">
              {movieData?.description}
            </p>

            <div className="flex gap-2 items-center text-base text-white">
              <span>{movieData?.genre}</span>
              <Dot className="text-[#646464]" />
              <p className="textShadow text-base text-white">
                {movieData?.mood}
              </p>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieInfoModal;