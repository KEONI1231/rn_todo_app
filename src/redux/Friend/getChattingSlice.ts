import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {useEffect, useState} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

interface FriendChattingList {
  userEmail: string;
  b_email: string;
  id: number;
  name: string;
}

interface FriendChattingListState {
  friendChatList: FriendChattingList[];
  status: 'idle' | 'loading' | 'succeded' | 'failed';
}
const initialState: FriendChattingListState = {
  friendChatList: [],
  status: 'idle',
};

export const getChatList = createAsyncThunk(
  'friends/fetchChatList',
  async () => {
    const userEmail = await EncryptedStorage.getItem('chatUserEmail');
    const response = await axios.post(
      'http://43.201.116.97:3000/chat/small-chat/getChatList',
      {userEmail},
    );
    return response.data;
  },
);
const getFriendChatListSlice = createSlice({
  name: 'getChattingsList',
  initialState,
  reducers: {
    resetChatListStatus: state => {
      state.status = 'idle';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getChatList.pending, state => {
        state.status = 'loading';
      })
      .addCase(getChatList.fulfilled, (state, action) => {
        state.status = 'succeded';
        let data = action.payload;
        let dataArray: FriendChattingList[] = Object.values(data);

        state.friendChatList = dataArray;
      })
      .addCase(getChatList.rejected, state => {
        state.status = 'failed';
      });
  },
});

export const {resetChatListStatus} = getFriendChatListSlice.actions;
export default getFriendChatListSlice.reducer;
