import { favoriteEpisodeSlice } from './favoriteEpisodesSlice'
import { favoriteShowSlice } from './favoriteShowSlice';
import { authSlice } from '../store/authSlice';
import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


// Create the Redux store
export const store = configureStore({
    reducer: {
      favoriteEpisode: favoriteEpisodeSlice.reducer,
      favoriteShow: favoriteShowSlice.reducer,
      auth: authSlice.reducer,
    },
  });




  // Define the types for dispatch and selector hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();