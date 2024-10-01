export type AuthState = {
  isAuth: boolean;
  uid: string;
  name: string;
  surname: string;
  email: string;
  loading: boolean;
  error: string;
  gender: string;
};

export type InboxState = {
  unreadCount: any;
  totalUnreadCount: any;
  messages: [];
  loading: boolean;
  error: string;
  visibleData: any;
};
export type ChatState = {
  allMessages: any;
  loading: boolean;
  error: string;
};
