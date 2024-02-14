import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../Client';

type FavoriteShowData = Array<FavoriteShow>;

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


// Defined the initial state for the users.
type user = {
  name: string;
  id: string;
  favorites: FavoriteShowData;
};

const initialState = {
  name: '',
  id: '',
  favorites: []
}

// Create a slice to manage user data state
export const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers:  {
    setUsersData(state, action: PayloadAction<user>){
      return {
        ...state,
        ...action.payload,
      };
    },
    resetUsersData: (state) => {
      return initialState;
    }
  },
});

export const { setUsersData, resetUsersData} = userDataSlice.actions;
export default userDataSlice.reducer;
