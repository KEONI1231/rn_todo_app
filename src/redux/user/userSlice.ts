// src/redux/user/userSlice.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UserState {
  email: string;
  pw: string;
  name: string;
  statusMessage: string;
}

const initialState: UserState = {
  email: '',
  pw: '',
  name: '',
  statusMessage: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      state.email = action.payload.email;
      state.pw = action.payload.pw;
      state.name = action.payload.name;
      state.statusMessage = action.payload.statusMessage;
    },
  },
});

export const {login} = userSlice.actions;

export default userSlice.reducer;
