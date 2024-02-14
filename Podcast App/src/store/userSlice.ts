import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../Client';


// Define an async thunk for logging in
/*export const loginUserAsync = createAsyncThunk(
  'user/loginUserAsync',
  async (credentials: { email: string, password: string }, { dispatch }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw error;
      }

      // Dispatch the setUsers action with the retrieved user data
      dispatch(setUsers(data));

      return data;
    } catch (error) {
      throw error;
    }
  }
);*/

type Users = {
  user?: {
    id?: string;
    user_metadata?: {
      full_name?: string;
    };
  };
};

const initialUsersState: Users = {
  user: {
    id: '',
    user_metadata: {
      full_name: '',
    },
  },
};

export const userSlice = createSlice({
  name: 'Users',
  initialState: initialUsersState,
  reducers: {
    setUsers: (state, action: PayloadAction<Users>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetUsers: (state) => {
      return initialUsersState;
    },
  },
});

export const { setUsers, resetUsers } = userSlice.actions;
export default userSlice.reducer;