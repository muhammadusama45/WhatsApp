import {createSlice} from '@reduxjs/toolkit';
import {AuthState, ChatState} from '../../states';

const initialState: ChatState = {
  allMessages: [],
  loading: false,
  error: '',
};

export const chatSlice = createSlice({
  name: 'chatSlice',
  initialState: initialState,
  reducers: {
    addMessage: (state, {payload}) => {
      state.allMessages = [payload, ...state.allMessages];
    },
    updateMessage: (state, {payload}) => {
      const index = state.allMessages?.findIndex(
        (item: any) => payload?.id == item?.id,
      );
      if (index > -1) {
        state.allMessages.splice(index, 1, payload);
      }
    },
    addAllMessage: (state, {payload}) => {
      state.allMessages = payload;
    },
    clearChat: (state, {payload}) => {
      state.allMessages = [];
    },
  },
});
export const {addMessage, addAllMessage, clearChat, updateMessage} =
  chatSlice.actions;

export default chatSlice.reducer;
