import {createSlice} from '@reduxjs/toolkit';
import {InboxState} from '../../states';

const initialState: InboxState = {
  messages: [],
  loading: false,
  error: '',
  visibleData: [],
};

export const inboxSlice = createSlice({
  name: 'inboxSlice',
  initialState: initialState,
  reducers: {
    setVisibleData: (state, action) => {
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
      state.visibleData = [childSnapshot, ...previousChat];
    },
    setSingleChatForNameandImage: (state, action) => {
      const childSnapshot = action.payload;
      const previousChat = [...state.visibleData];
      const index = previousChat?.findIndex(
        (item: any) => childSnapshot?.id == item?.id,
      );
      state.visibleData[index].name = childSnapshot.name;
      state.visibleData[index].image = childSnapshot.image;
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
} = inboxSlice.actions;

export default inboxSlice.reducer;
