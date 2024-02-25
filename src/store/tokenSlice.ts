import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';



type TokenState = {
  session?: {
    access_token: string;
  };
  
}

const initialTokenState: TokenState = {
  session: {
    access_token: '',
  },
};


export const tokenSlice = createSlice({
    name: 'token',
    initialState: initialTokenState,
    reducers: {
      setToken: (state, action: PayloadAction<string>) => {
        state.session = {
          access_token: action.payload,
        };
      },
      resetToken: (state) => {
        state.session = {
          access_token: '',
        };
      },
    },
  });

export const { setToken, resetToken} = tokenSlice.actions;
export default tokenSlice.reducer;