export type AuthState = {
  isAuth: boolean;
  uid: string;
  name: string;
  surname: string;
  email: string;
  loading: boolean;
  error: string;
};

export type InboxState = {
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
