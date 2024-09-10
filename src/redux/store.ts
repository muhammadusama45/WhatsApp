import {combineReducers, configureStore} from '@reduxjs/toolkit';
import counterSlice from './slice/main/counter-slice/counter-slice';
import storage from 'redux-persist/lib/storage';
import {persistReducer, persistStore} from 'redux-persist';
import authReducer from './slice/auth/auth-slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import chatSlice from './slice/auth/chat-slice';
import inboxSlice from './slice/auth/inbox-slice';
// import chatSlice from './slice/main/chat-slice/chat-slice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['counter'],
};

const rootReducer = combineReducers({
  counter: counterSlice,
  auth: authReducer,
  chat: chatSlice,
  inbox: inboxSlice,
  // chat: chatSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

//configureStore used for setting up a store it automatically creates the redux store
export const store = configureStore({
  //reducers are pure functions that specify how the state of an application should change in response to actions.
  //This is where we will pass the root reducer or an object containing slice reducers
  //slice (A slice reducer is a single reducer that handles the state and actions for a specific part of your Redux state tree.)
  reducer: persistedReducer,

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
//RootState represnets the entire shape of the redux store
//ReturnType<Type>: This is a TypeScript utility type that takes a function type and produces its return type.
//store.getState returns the  current state of entire Store
//ReturnType<typeof store.getState> it automatically refelcts any changes you make to the store configuration
export type RootState = ReturnType<typeof store.getState>;

//typeof store.dispatch: This extracts the exact type of the dispatch method from the store.
//Using AppDispatch ensures that any action you attempt to dispatch is correctly typed, helping you catch errors at compile time.
//dispacth function used to send action to the redux Store when action is dispatched it triggers the store to  update the state on the basis of current state
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
