"use client";

import useUser from "@/stores/user.store";
import { useEffect } from "react";
import Movies from "./Movies";

const FavouriteList = () => {
  const { favourites, updateFavourites } = useUser();

  useEffect(() => {
    updateFavourites();
  }, [updateFavourites]);

  return (
    <div className="pb-16">
      <Movies movies={favourites} label="My List" />
    </div>
  );
}
export default FavouriteList;
