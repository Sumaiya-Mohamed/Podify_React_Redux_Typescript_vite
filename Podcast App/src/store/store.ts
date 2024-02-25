import { favoriteShowSlice } from './favoriteShowSlice';
import { IdSlice } from './IdSlice';
import { userDataSlice } from './userDataSlice';
import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';



// Create the Redux store
export const store = configureStore({
    reducer: {
      favoriteShow: favoriteShowSlice.reducer,
      id: IdSlice.reducer,
      userData: userDataSlice.reducer,
      
    },
  });




  // Define the types for dispatch and selector hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

