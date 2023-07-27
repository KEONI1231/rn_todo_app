// src/redux/store.ts

import {configureStore} from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import getFriendsSlice from './Friend/getFriendsSlice';
import getChattingReducer from './Friend/getChattingSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    friends: getFriendsSlice,
    chattingsLists: getChattingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
