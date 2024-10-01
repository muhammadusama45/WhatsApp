import {createSlice} from '@reduxjs/toolkit';
import {InboxState} from '../../states';
import {toArray} from 'lodash';

const initialState: InboxState = {
  messages: [],
  loading: false,
  error: '',
  visibleData: [],
  unreadCount: {},
  totalUnreadCount: 0,
};

export const inboxSlice = createSlice({
  name: 'inboxSlice',
  initialState: initialState,
  reducers: {
    setVisibleData: (state, action) => {
      const totalUnreadCount = action.payload.reduce(
        (acc: any, chat: any) => acc + chat.unreadCount,
        0,
      );
      state.totalUnreadCount = totalUnreadCount;
      state.visibleData = action.payload;
    },
    setSingleChat: (state, action) => {
      const childSnapshot = action.payload;

      const previousChat = [...state.visibleData];
      const index = previousChat?.findIndex(
        (item: any) => childSnapshot?.id == item?.id,
      );

      if (index > -1) {
        previousChat.splice(index, 1);
      }
      const totalUnreadCount = [childSnapshot, ...previousChat].reduce(
        (acc: any, chat: any) => acc + chat.unreadCount,
        0,
      );
      state.totalUnreadCount = totalUnreadCount;
      state.visibleData = [childSnapshot, ...previousChat];
    },
    setRemovedChat: (state, action) => {
      const childSnapshot = action.payload;
      const previousChat = [...state.visibleData];

      const index = previousChat?.findIndex(
        (item: any) => childSnapshot?.id == item?.id,
      );

      if (index > -1) {
        previousChat.splice(index, 1);
      }

      state.visibleData = previousChat;
    },

    setSingleChatForNameandImage: (state, action) => {
      const childSnapshot = action.payload;

      const previousChat = [...state.visibleData];
      const index = previousChat?.findIndex(
        (item: any) => childSnapshot?.id == item?.id,
      );

      if (state?.visibleData[index]) {
        state.visibleData[index].name = childSnapshot?.name ?? '';
        state.visibleData[index].image = childSnapshot?.image ?? '';
      }
    },
    clearInbox: state => {
      state.visibleData = [];
    },
  },
});
export const {
  setVisibleData,
  setSingleChat,
  setSingleChatForNameandImage,
  clearInbox,
  setRemovedChat,
} = inboxSlice.actions;

export default inboxSlice.reducer;
