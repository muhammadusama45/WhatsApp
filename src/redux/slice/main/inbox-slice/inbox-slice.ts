import {createSlice} from '@reduxjs/toolkit';
import {InboxState} from '../../../states';

const initialstate: InboxState = {
  messages: [],
  loading: false,
  error: '',
  unreadCounts: {},
  visibleData: undefined,
};

export const InboxSlice = createSlice({
  name: 'Inbox',
  initialState: initialstate,
  reducers: {},
});
