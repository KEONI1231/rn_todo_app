import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

interface Friend {
  f_name: string;
  f_email: string;
  f_statusMessage: string;
} //

interface FriendsState {
  friendsList: Friend[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
} //친구를 받아오는 4가지 상태 정의

const initialState: FriendsState = {
  friendsList: [],
  status: 'idle',
};

// 비동기 thunk 생성
export const fetchFriends = createAsyncThunk(
  'friends/fetchFriends',
  async () => {
    const userEmail = await EncryptedStorage.getItem('chatUserEmail');
    const response = await axios.get(
      'http://43.201.116.97:3000/small-chat/get-friends', //가능하다면 토큰
      {
        params: {
          userEmail,
        },
      },
    );
    //console.log(response.data);
    return response.data; // payload로 반환됩니다.
  },
);

// slice 생성
const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    resetStatus: state => {
      state.status = 'idle'; //다시 통신하기 상태
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFriends.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // 서버로부터 반환된 데이터를 state에 추가
        let data = action.payload;
        let dataArray: Friend[] = Object.values(data);
        state.friendsList = dataArray;
      })
      .addCase(fetchFriends.rejected, state => {
        state.status = 'failed';
      });
  },
});
export const {resetStatus} = friendsSlice.actions;
export default friendsSlice.reducer;
