import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  password: string;
  email: string;
};

type AuthState = {
  user: User | null; 
};

// Initial state
export const initialState: AuthState = {
  user: {
     password: '',
     email: '',
  }, // Set the initial value to null since it represents an empty user.
};

// Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set the user data when the user logs in
    setUser: (state: AuthState, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    // Action to clear the user data when the user logs out
    clearUser: (state: AuthState) => {
      state.user = null; // Clear the user data by setting it back to null.
    },
  },
});

// Export the action creators
export const { setUser, clearUser } = authSlice.actions;

// Export the auth reducer
export default authSlice.reducer;