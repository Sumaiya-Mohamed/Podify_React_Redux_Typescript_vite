import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


type FavoriteShowData = Array<FavoriteShow>;

type FavoriteEpisodeData = Array<Episodes>;

type Episodes = {
  title: string,
  description: string,
  episode: number,
  file: string,
  addedAt: string; 
  id: string,
};

type FavoriteShow = {
    id: string;
    title: string;
    description: string;
    image: string;
    seasons: Array<{
      season: number;
      title: string;
      image: string;
      episodes: Array<{
        title: string;
        description: string;
        episode: number;
        file: string;
      }>;
    }>;
    genres: Array<string>;
    updated: Date;
  };


// Define the initial state for favorites
const initialFavoritesState: FavoriteShowData = [];
                          

export const favoriteShowSlice = createSlice({
    name: 'favoriteShow',
    initialState: initialFavoritesState,
    reducers: {
      addToShowFavorites(state, action: PayloadAction<FavoriteShow>) {
        const episodeToAdd = { ...action.payload, addedAt: new Date().toLocaleDateString('en-US', { dateStyle: 'long' }) };
        return [...state, episodeToAdd];
      },
      removeFromShowFavorites(state, action: PayloadAction<string>) {
        return state.filter((show) => show.id !== action.payload);
      },
      clearShowFavorites(state) {
        return [];
      },
    },
  });

export const { addToShowFavorites, removeFromShowFavorites, clearShowFavorites } = favoriteShowSlice.actions;
export default favoriteShowSlice.reducer;

