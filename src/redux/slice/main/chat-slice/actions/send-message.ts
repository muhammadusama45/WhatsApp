import {createAsyncThunk} from '@reduxjs/toolkit';
import database from '@react-native-firebase/database';

export const sendMessage = createAsyncThunk(
  'sendMessage',
  async (message, {rejectWithValue}) => {
    try {
      const newMessageRef = database().ref('/chats').push();
      await newMessageRef.set(message);
      return message;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
