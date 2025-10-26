import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import supabase from '../../config/config';
import Swal from 'sweetalert2';

//interface here
interface Record {
    class_classstud_id: number;
    class_classstud_code: number;
    class_classstud_title: string;
    class_classstud_section: string;
    class_classstud_profid: string;
    class_classstud_studid: string;
}

interface studHomeState {
    record: Record[];
}

const initialState: studHomeState = {
    record: [],
}

const studHomeSlice = createSlice({
    name: 'studHome',
    initialState,
    reducers: {
        setRecord: (state, action: PayloadAction<Record[]>) => {
            state.record = action.payload;
        }
    }
})

export const getRecordSlice = async (dispatch: any) => {
    const {data, error} = await supabase.from('class_classstud').select('*');

    if (error || data.length === 0) {
        Swal.fire({
            title:'Error Getting Record',
            text:'There has been an error in getting record',
            icon:'error',
            timer:1500,
            showConfirmButton: false,
            willClose: () => {
                window.location.reload();
            }
        })
    }

    else {
        dispatch(setRecord(data));
    }
}

export const getProfImageSlice = async (id: string) => {
    const {data, error} = await supabase.from('class_users').select('*').eq('class_users_id',id);

    if (error) {
        Swal.fire({
            title:'Error Getting Professor Image',
            text:'There has been an error in getting professor image',
            icon:'error',
            timer:1500,
            showConfirmButton: false,
            willClose: () => {
                window.location.reload();
            }
        })
    }

    else {
        return data[0].class_users_image;
    }
}

export const getProfNameSlice = async (id: string) => {
    const {data, error} = await supabase.from('class_users').select('*').eq('class_users_id',id);

    if (error) {
        Swal.fire({
            title:'Error Getting Professor Name',
            text:'There has been an error in getting professor name',
            icon:'error',
            timer:1500,
            showConfirmButton: false,
            willClose: () => {
                window.location.reload();
            }
        })
    }

    else {
        return data[0].class_users_name;
    }
}

export const unenrollSlice = async (code: number, dispatch: any) => {
    const {error} = await supabase.from('class_classstud').delete().eq('class_classstud_code',code);

    if (error) {
        Swal.fire({
            title:'Error Unenrolling',
            text:'There has been an error in unenrolling from this class',
            icon:'error',
            timer:1500,
            showConfirmButton:false,
            willClose: () => {
                window.location.reload();
            }
        })
    }

    else {
        Swal.fire({
            title:'Class Unenrolled',
            text:'The class has been unenrolled successfully',
            icon:'success',
            timer:1500,
            showConfirmButton: false,
            willClose: () => {
                window.location.reload();
            }
        })
    }
}

export const {setRecord} = studHomeSlice.actions;

export default studHomeSlice.reducer;