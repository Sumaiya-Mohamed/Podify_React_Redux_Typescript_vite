import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';


// Defined the initial state to keep track if a new user signs in through an id.

const initialIdState = {
    id: '',
}


export const IdSlice = createSlice({
    name: 'id',
    initialState: initialIdState,
    reducers: {
      setId: (state, action: PayloadAction<string>) => {
        state.id = action.payload;
      },
      resetId: (state) => {
       state.id = '';
      }
    },
  });

export const { setId, resetId} = IdSlice.actions;
export default IdSlice.reducer;