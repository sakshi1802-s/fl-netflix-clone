import { create } from "zustand";
import axios from "axios";
import { User } from "@/types/user.types";
import { IMovie } from "@/types/movie.type";

type IState = {
  user: User | null;
  favourites: IMovie[];
};

type IActions = {
  updateUser: () => void;
  updateFavourites: () => void;
};

type IUserStoreState = IState & IActions;

const useUserStore = create<IUserStoreState>((set) => ({
  user: null,
  favourites: [],

  updateUser: async () => {
    const { data } = await axios.get("/api/me");
    const { currentUser } = data;

    set({ user: currentUser });
  },

  updateFavourites: async () => {
    const { data } = await axios.get("/api/favourites");

    set({ favourites: data.favourites });
  },
}));

export default useUserStore;