import {createSlice} from '@reduxjs/toolkit';
import {handleLogin} from './action/login';
import {SignUp} from './action/signup';
import {forgetPassword} from './action/forgot-password';
import {AuthState} from '../../states';

const initialState: AuthState = {
  isAuth: false,
  uid: '',
  email: '',
  loading: false,
  error: '',
  name: '',
  surname: '',
  gender: '',
};

export const authSlice = createSlice({
  name: 'authSlice',
  initialState: initialState,
  reducers: {
    Logout: (state, action) => {
      state.isAuth = false;
      state.uid = '';
      state.email = '';
    },
    updateName(state, action) {
      state.name = action.payload;
    },

    // setVisibleData: (state, action) => {
    //   state.visibleData = action.payload;
    // },
    // setSingleChat: (state, action) => {
    //   const childSnapshot = action.payload;
    //   const previousChat = [...state.visibleData];
    //   const index = previousChat?.findIndex(
    //     (item: any) => childSnapshot?.id == item?.id,
    //   );

    //   if (index > -1) {
    //     previousChat.splice(index, 1);
    //   }
    //   state.visibleData = [childSnapshot, ...previousChat];
    // },
    // clearInbox: state => {
    //   state.visibleData = [];
    // },
  },
  /////Login//////
  extraReducers: builder => {
    builder.addCase(handleLogin.pending, state => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(handleLogin.rejected, state => {
      state.loading = false;
    });
    builder.addCase(handleLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuth = true;

      state.uid = action.payload?.uid;
      state.email = action.payload?.userCredential.user.email ?? '';
      state.name = action.payload.name;
    });
    /////Sign Up//////
    builder.addCase(SignUp.pending, state => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(SignUp.rejected, state => {
      state.loading = false;
    });
    builder.addCase(SignUp.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuth = false;

      state.uid = action.payload?.user?.uid;
      state.email = action.payload?.user?.email ?? '';
      state.name = `${action.meta.arg.name} ${action.meta.arg.surname}`;
      state.gender = action.meta.arg.gender;
    });
    ////Forget Password///
    builder.addCase(forgetPassword.pending, state => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(forgetPassword.rejected, state => {
      state.loading = false;
    });
    builder.addCase(forgetPassword.fulfilled, state => {
      state.loading = false;
    });
  },
});
export const {Logout, updateName} = authSlice.actions;

export default authSlice.reducer;
