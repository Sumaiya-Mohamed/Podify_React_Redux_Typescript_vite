import { favoritesSlice } from './favoritesSlice'
import { authSlice } from '../store/authSlice';
import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


// Create the Redux store
export const store = configureStore({
    reducer: {
      favorites: favoritesSlice.reducer,
      auth: authSlice.reducer,
    },
  });




  // Define the types for dispatch and selector hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();