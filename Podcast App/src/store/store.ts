import { favoriteShowSlice } from './favoriteShowSlice';
import { tokenSlice } from './tokenSlice';
import { IdSlice } from './IdSlice';
import {userSlice} from './userSlice'
import { userDataSlice } from './userDataSlice';
import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web


// Create the Redux store
export const store = configureStore({
    reducer: {
      favoriteShow: favoriteShowSlice.reducer,
      token: tokenSlice.reducer,
      id: IdSlice.reducer,
      users: userSlice.reducer,
      userData: userDataSlice.reducer,
      
    },
  });




  // Define the types for dispatch and selector hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

