import {createSlice} from '@reduxjs/toolkit';
import {AuthState, ChatState} from '../../states';
import {uniqBy} from 'lodash';

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
      state.allMessages = uniqBy([payload, ...state.allMessages], 'id');
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
      state.allMessages = uniqBy(payload, 'id');
    },
    clearChat: (state, {payload}) => {
      state.allMessages = [];
    },
  },
});

export const {addMessage, addAllMessage, clearChat, updateMessage} =
  chatSlice.actions;

export default chatSlice.reducer;
