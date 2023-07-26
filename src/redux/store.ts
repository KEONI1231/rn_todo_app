// src/redux/store.ts

import {configureStore} from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import getFriendsSlice from './Friend/getFriendsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    friends: getFriendsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
