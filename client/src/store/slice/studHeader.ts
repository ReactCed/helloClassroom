import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import supabase from '../../config/config';
import Swal from 'sweetalert2';

//interface here
interface studHeaderState {
    open: boolean;
}

const initialState : studHeaderState = {
    open: false,
}

const studHeaderSlice = createSlice({
    name: 'studHeader',
    initialState,
    reducers: {
        setOpen: (state, action: PayloadAction<boolean>) => {
            state.open = action.payload;
        }
    }
});

export const logoutSlice = async (dispatch: any) => {
    localStorage.clear();

    window.location.href='/Auth';
}

export const {setOpen} = studHeaderSlice.actions;

export default studHeaderSlice.reducer;