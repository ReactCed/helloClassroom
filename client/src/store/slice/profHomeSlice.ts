import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import supabase from '../../config/config';
import Swal from 'sweetalert2';

//interface here
interface Record {
    class_classprof_id: number;
    class_classprof_code: number;
    class_classprof_title: string;
    class_classprof_section: string;
    class_classprof_profid: string;
}

interface profHomeState {
    record: Record[];
    editID: number;
    editCode: number;
    editTitle: string;
    editSection: string;
}

const initialstate : profHomeState = {
    record: [],
    editID: 0,
    editCode: 0,
    editTitle: '',
    editSection: '',
}

const profHomeSlice = createSlice({
    name: 'profHome',
    initialState: initialstate,
    reducers: {
        setRecord: (state, action: PayloadAction<Record[]>) => {
            state.record = action.payload;
        },

        setEditID: (state, action: PayloadAction<number>) => {
            state.editID = action.payload;
        },

        setEditCode: (state, action: PayloadAction<number>) => {
            state.editCode = action.payload;
        },

        setEditTitle: (state, action: PayloadAction<string>) => {
            state.editTitle = action.payload;
        },

        setEditSection: (state, action: PayloadAction<string>) => {
            state.editSection = action.payload;
        }
    }
})

export const getRecordSlice = async (dispatch: any) => {
    const classUsersID = localStorage.getItem('classUsersID');

    const {data, error} = await supabase.from('class_classprof').select('*').eq('class_classprof_profid',classUsersID);

    if (error) {
        Swal.fire({
            title:'Error Getting Record',
            text:'There has been error in getting record',
            icon:'error',
            timer:1500,
            showConfirmButton:false,
            willClose: () => {
                window.location.reload();
            }
        })
    }

    else {
        dispatch(setRecord(data));
    }
}

export const getProfNameSlice = async (id: string) => {
    const {data, error} = await supabase.from('class_users').select('*').eq('class_users_id',id);

    if (error) {
        Swal.fire({
            title:'Error Getting User Name',
            text:'There has been error in getting user name',
            icon:'error',
            timer:1500,
            showConfirmButton:false,
            willClose: () => {
                window.location.reload();
            }
        })
    }

    else {
        return data[0].class_users_name;
    }
};

export const getProfImageSlice = async (id: string) => {
    const {data, error} = await supabase.from('class_users').select('*').eq('class_users_id',id);

    if (error) {
        Swal.fire({
            title:'Error Getting User Image',
            text:'There has been error in getting user image',
            icon:'error',
            timer:1500,
            showConfirmButton:false,
            willClose: () => {
                window.location.reload();
            }
        })
    }

    else {
        return data[0].class_users_image;
    }
}

export const delClassSlice = async (id: number, code: number, dispatch: any) => {
    const {error} = await supabase.from('class_classprof').delete().eq('class_classprof_id', id);

    if (error) {
        Swal.fire({
            title:'Error Deleting Class',
            text:'There has been error in deleting class',
            icon:'error',
            timer:1500,
            showConfirmButton:false,
            willClose: () => {
                window.location.reload();
            }
        })
    }

    else {
        const {error: error2} = await supabase.from('class_classstud').delete().eq('class_classstud_code',code);

        if (error2) {
            Swal.fire({
                title:'Error Deleting Class Students',
                text:'There has been error in deleting class students',
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
                title:'Class Deleted',
                text:'The class has been deleted successfully',
                icon:'success',
                timer: 1500,
                showConfirmButton:false,
                willClose: () => {
                    window.location.reload();
                }
            })
        }
    }
}

export const {setRecord, setEditID, setEditCode, setEditTitle, setEditSection} = profHomeSlice.actions;

export default profHomeSlice.reducer;