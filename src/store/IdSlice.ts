import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../Client';

type idData = {
  id: string[]
}

const initialIdState: idData = {
  id: []
}

export const IdSlice = createSlice({
  name: 'id',
  initialState: initialIdState,
  reducers: {
    addId: (state, action: PayloadAction<string>) => {
      state.id.push(action.payload)
    },
    resetId: (state) => {
      return {
        ...state,
        id:  [],
      };
    },
  },
});

export const { addId, resetId } = IdSlice.actions;
export default IdSlice.reducer;