import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import supabase from '../../config/config';
import Swal from 'sweetalert2';

//interface here
interface profManageAccState {
    file: File | null;
    imageUrl: string;
    showUpdateNameModal: boolean;
    showUpdateEmailModal: boolean;
    showUpdateAddressModal: boolean;
    classUsersImage: string;
    classUsersName: string;
    classUsersEmail: string;
    classUsersAddress: string;
    classUsersRole: string;
}

const initialState : profManageAccState = {
    file: null,
    imageUrl: '',
    showUpdateNameModal: false,
    showUpdateEmailModal: false,
    showUpdateAddressModal: false,
    classUsersImage: '',
    classUsersName: '',
    classUsersEmail: '',
    classUsersAddress: '',
    classUsersRole: '',
}

const profManageAccSlice = createSlice({
    name: 'profManageAcc',
    initialState,
    reducers: {
        setFile: (state, action: PayloadAction<File | null>) => {
            state.file = action.payload;
        },

        setImageUrl: (state, action: PayloadAction<string>) => {
            state.imageUrl = action.payload;
        },

        setShowUpdateNameModal: (state, action: PayloadAction<boolean>) => {
            state.showUpdateNameModal = action.payload;
        },

        setShowUpdateEmailModal: (state, action: PayloadAction<boolean>) => {
            state.showUpdateEmailModal = action.payload;
        },

        setShowUpdateAddressModal: (state, action: PayloadAction<boolean>) => {
            state.showUpdateAddressModal = action.payload;
        },

        setClassUsersImage: (state, action: PayloadAction<string>) => {
            state.classUsersImage = action.payload;
        },

        setClassUsersName: (state, action: PayloadAction<string>) => {
            state.classUsersName = action.payload;
        },

        setClassUsersEmail: (state, action: PayloadAction<string>) => {
            state.classUsersEmail = action.payload;
        },

        setClassUsersAddress: (state, action: PayloadAction<string>) => {
            state.classUsersAddress = action.payload;
        },

        setClassUsersRole: (state, action: PayloadAction<string>) => {
            state.classUsersRole = action.payload;
        }
    }
});

export const getRecordSlice = async (classUsersID: string | null, dispatch: any) => {
    const {data, error} = await supabase.from('class_users').select('*').eq('class_users_id',classUsersID);

    if (error) {
        Swal.fire({
            title:'Error Getting Record',
            text:'There has been error in getting record',
            icon:'error'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        })
    }

    else {
        dispatch(setClassUsersImage(data[0].class_users_image));
        dispatch(setClassUsersName(data[0].class_users_name));
        dispatch(setClassUsersEmail(data[0].class_users_email));
        dispatch(setClassUsersAddress(data[0].class_users_address));
        dispatch(setClassUsersRole(data[0].class_users_role));
    }
}

export const uploadImageSlice = async (classUsersID: string | null, file: File | null, dispatch: any) => {    
    // File Upload Function Start
    if (!file) {
        Swal.fire('Error', 'No file selected.', 'error');
        return;
    }

    const fileName = `${Date.now()}_${file.name}`;

    const { error } = await supabase.storage.from('uploads').upload(fileName, file);

    if (error) {
        Swal.fire('Error', error.message, 'error');
        return;
    }

    const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);

    const publicUrl = data?.publicUrl || '';

    dispatch(setImageUrl(publicUrl));
    // File Upload Function End

    //Update image of the user in supabase
    const {error: error2} = await supabase.from('class_users').update({class_users_image: publicUrl}).eq('class_users_id',classUsersID);

    if (error2) {
        Swal.fire({
            title:'Error Updating Image',
            text:'There has been error in updating image',
            icon:'error'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        })
    }

    else {
        Swal.fire({
            title:'Image Updated',
            text:'Your image has been updated successfully',
            icon:'success'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        })
    }
}

export const {setFile, setImageUrl, setShowUpdateNameModal, setShowUpdateEmailModal, setShowUpdateAddressModal, setClassUsersImage, setClassUsersName, setClassUsersEmail, setClassUsersAddress, setClassUsersRole} = profManageAccSlice.actions;

export default profManageAccSlice.reducer;