import {createAsyncThunk} from '@reduxjs/toolkit';
import {Alert} from 'react-native';
import {forgetPayload} from '../../../../types/payload-types';
import auth from '@react-native-firebase/auth';

export const forgetPassword = createAsyncThunk<string, forgetPayload>(
  'forget',
  async (payload, {rejectWithValue}) => {
    try {
      await auth().sendPasswordResetEmail(payload?.email).then();
      Alert.alert(
        'Success',
        'Password reset email sent. Please check your email.',
      );
      return 'Password reset email sent. Please check your email.';
    } catch (error: any) {
      console.error('Error sending password reset email:', error);
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'The email address is not valid.');
      } else if (error.code === 'auth/user-not-found') {
        Alert.alert('Error', 'No user found with this email address.');
      } else {
        Alert.alert('Error', 'Failed to send password reset email.');
      }
      return rejectWithValue(error.message);
    }
  },
);
