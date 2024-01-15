import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';


// Defined the initial state for the token.
type tokenObject= {
    user: {} | null;
    session: {} | null;
  };

const initialTokenState: tokenObject | null = null;


export const tokenSlice = createSlice({
    name: 'Token',
    initialState: initialTokenState,
    reducers: {
      setToken(state, action: PayloadAction<tokenObject>){
        return {
          ...state,
          ...action.payload,
        };
      }
    },
  });

export const { setToken} = tokenSlice.actions;
export default tokenSlice.reducer;