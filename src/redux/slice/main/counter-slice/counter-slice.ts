import {createSlice} from '@reduxjs/toolkit';
const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    seconds: 0,
    isRunning: false,
  },
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    start: state => {
      state.isRunning = true;
    },
    stop: state => {
      state.isRunning = false;
    },
    reset: state => {
      state.seconds = 0;
      state.isRunning = false;
    },
    ticking: state => {
      if (state.isRunning) {
        state.seconds += 1;
      }
    },
  },
});
//exports these action creators so they can be used elsewhere in your application.
export const {increment, decrement, start, stop, reset, ticking} =
  counterSlice.actions;
//createSlice not only creates action creators but also generates a reducer function that handles these actions.
//The reducer is responsible for specifying how the state should change in response to the dispatched actions.
export default counterSlice.reducer;
