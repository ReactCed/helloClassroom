import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import supabase from '../../config/config';
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs';

//interface here

interface authState {
    email: string;
    isLogin: boolean;
    pass: string;
    name: string;
    address: string;
    conPass: string;
    role: string;
    captchaValue: string;
}

const initialState : authState = {
    email: '',
    isLogin: true,
    pass: '',
    name: '',
    address: '',
    conPass: '',
    role: '',
    captchaValue: '',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },

        setIsLogin: (state, action: PayloadAction<boolean>) => {
            state.isLogin = action.payload;
        },

        setPass: (state, action: PayloadAction<string>) => {
            state.pass = action.payload;
        },

        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        }, 

        setAddress: (state, action: PayloadAction<string>) => {
            state.address = action.payload;
        }, 

        setConPass: (state, action: PayloadAction<string>) => {
            state.conPass = action.payload;
        },

        setRole: (state, action: PayloadAction<string>) => {
            state.role = action.payload;
        },

        setCaptchaValue: (state, action: PayloadAction<string>) => {
            state.captchaValue = action.payload;
        }
    }
});

export const submitLoginSlice = async (email: string, pass: string, dispatch: any) => {
    const {data, error} = await supabase.from('class_users').select('*').eq('class_users_email', email);

    if (error || data.length === 0) {
        Swal.fire({
            title:'Email Not Registered',
            text:'Your email is not registered please try again',
            icon:'error'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href='/Auth';
            }
        })
    }

    else {
        const isMatch = await bcrypt.compare(pass, data[0].class_users_pass);

        if (isMatch) {
            if (data[0].class_users_role === "student") {
                localStorage.setItem('classUsersID',data[0].class_users_id);
                localStorage.setItem('classUsersName',data[0].class_users_name);
                localStorage.setItem('classUsersEmail',data[0].class_users_email);
                localStorage.setItem('classUsersAddress', data[0].class_users_address);
                localStorage.setItem('classUsersRole',data[0].class_users_role);
                localStorage.setItem('classUsersImage', data[0].class_users_image);

                window.location.href='/StudHome';
            } else if (data[0].class_users_role === "professor") {
                localStorage.setItem('classUsersID',data[0].class_users_id);
                localStorage.setItem('classUsersName',data[0].class_users_name);
                localStorage.setItem('classUsersEmail',data[0].class_users_email);
                localStorage.setItem('classUsersAddress', data[0].class_users_address);
                localStorage.setItem('classUsersRole',data[0].class_users_role);
                localStorage.setItem('classUsersImage', data[0].class_users_image);

                window.location.href='/ProfHome';
            }
        }

        else {
            Swal.fire({
                title:'Invalid Password',
                text:'Your password is incorrect please try again',
                icon:'error'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href='/Auth';
                }
            })
        }
    }
}

export const submitSignupSlice = async (name: string, address: string, email: string, pass: string, conPass: string, role: string, captchaValue: string, dispatch: any) => {
    if (captchaValue) {
        if (pass === conPass) {
            const {data, error} = await supabase.from('class_users').select('*').eq('class_users_email',email);

            if (error || data.length === 0) {
                const hashPass = await bcrypt.hash(pass, 10);
                const img = "https://mzfkbefjhanpuolxdwtd.supabase.co/storage/v1/object/public/uploads//default_image.png";

                const {error: error2} = await supabase.from('class_users').insert({class_users_name: name, class_users_email: email, class_users_pass: hashPass, class_users_address: address, class_users_role: role, class_users_image: img});

                if (error2) {
                    Swal.fire({
                        title:'Error Signing Up',
                        text:'There has been error in siging up',
                        icon:'error'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href='/Auth';
                        }
                    })
                }

                else {
                    Swal.fire({
                        title:'Account Registered',
                        text:'Your account has been registered succcessfully',
                        icon:'success'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href='/Auth';
                        }
                    })
                }
            }

            else {
                Swal.fire({
                    title:'Email Existed',
                    text:'The email is already registered',
                    icon:'error'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href='/Auth';
                    }
                })
            }
        }

        else {
            Swal.fire({
                title:'Password Not Match',
                text:'Please match your password and confirm password.',
                icon:'error'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href='/Auth';
                }
            })
        }
    }

    else {
        Swal.fire({
            title:'Error ReCAPTCHA',
            text:'Please complete the ReCAPTCHA',
            icon:'error'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href='/Auth';
            }
        })
    }
}


export const {setEmail, setIsLogin, setPass, setName, setAddress, setConPass, setRole, setCaptchaValue} = authSlice.actions;

export default authSlice.reducer;