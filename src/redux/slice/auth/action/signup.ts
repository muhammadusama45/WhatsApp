import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {navigate} from '../../../../../root-navigation';
import {SignupPayload} from '../../../../types/payload-types';
import database from '@react-native-firebase/database';

export const SignUp = createAsyncThunk<
  FirebaseAuthTypes.UserCredential,
  SignupPayload
>('signup', async (payload, {rejectWithValue}) => {
  try {
    const response = await auth().createUserWithEmailAndPassword(
      payload?.email,
      payload?.password,
    );
    console.log('response=====>', JSON.stringify(response, null, 2));

    if (response?.user?.uid) {
      const obj = {
        name: `${payload?.name} ${payload?.surname}`,
        email: payload.email,
        uid: response?.user?.uid,
      };

      const userRef = database().ref(`users/${response?.user?.uid}`);
      userRef.set(obj).then(() => navigate('Login'));
      console.log('userRef====>', JSON.stringify(userRef, null, 2));
    }

    return response;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }

    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }
    console.error(error);
    return rejectWithValue(error.message);
  }
});
