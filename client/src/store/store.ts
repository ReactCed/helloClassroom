import {configureStore} from '@reduxjs/toolkit';
import authSlice from './slice/authSlice';
import profHeader from './slice/profHeader';
import studHeader from './slice/studHeader';
import profManageAccSlice from './slice/profManageAccSlice';
import studManageAccSlice from './slice/studManageAccSlice';
import profHomeSlice from './slice/profHomeSlice';
import studHomeSlice from './slice/studHomeSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        profHeader: profHeader,
        studHeader: studHeader,
        profManageAcc: profManageAccSlice,
        studManageAcc: studManageAccSlice,
        profHome: profHomeSlice,
        studHome: studHomeSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 