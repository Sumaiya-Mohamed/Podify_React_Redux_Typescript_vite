import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


type FavoriteEpisodeData = Array<Episodes>;

type Episodes = {
  title: string,
  description: string,
  episode: number,
  file: string,
  addedAt: string; 
  id: string,
};

// Define the initial state for favorites
const initialFavoritesState: FavoriteEpisodeData = [];
                          

export const favoriteEpisodeSlice = createSlice({
    name: 'favoriteEpisode',
    initialState: initialFavoritesState,
    reducers: {
      addToEpisodeFavorites(state, action: PayloadAction<Episodes>) {
        const episodeToAdd = { ...action.payload, addedAt: new Date().toLocaleDateString('en-US', { dateStyle: 'long' }) };
        return [...state, episodeToAdd];
      },
      removeFromEpisodeFavorites(state, action: PayloadAction<string>) {
        return state.filter((show) => show.title !== action.payload);
      },
      clearEpisodeFavorites(state) {
        return [];
      },
    },
  });

export const { addToEpisodeFavorites, removeFromEpisodeFavorites, clearEpisodeFavorites } = favoriteEpisodeSlice.actions;
export default favoriteEpisodeSlice.reducer;


