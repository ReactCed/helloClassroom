import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import supabase from '../../config/config';
import Swal from 'sweetalert2';

//interface here
interface profHeaderState {
    open: boolean;
}

const initialState : profHeaderState = {
    open: false,
}

const profHeaderSlice = createSlice({
    name: 'profHeader',
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

export const {setOpen} = profHeaderSlice.actions;

export default profHeaderSlice.reducer;