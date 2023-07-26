import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


type FavoriteShowData = Array<SelectedShow>;

type SelectedShow = {
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
const initialFavoritesState: SelectedShow[] = [];

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: initialFavoritesState,
    reducers: {
      addToFavorites(state, action: PayloadAction<SelectedShow>) {
        return [...state, action.payload];
        // State cannot be modified directly so we return a new array containing the previous values and new values.
      },
      removeFromFavorites(state, action: PayloadAction<string>) {
        return state.filter((show) => show.id !== action.payload);
      },
      clearFavorites(state) {
        return [];
      },
    },
  });

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions;


// Create the Redux store
export const store = configureStore({
    reducer: {
      favorites: favoritesSlice.reducer, // Use favoritesSlice.reducer instead of favoritesReducer
    },
  });

// Define the types for dispatch and selector hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();