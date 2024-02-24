import axios from 'axios';
import {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {RootState} from '../../redux/store';
import {resetStatus} from '../../../src/redux/Friend/getFriendsSlice';

import {useDispatch} from 'react-redux';

const PrimaryColor = '#fff6db';

function SmallChatMore() {
  const dispatch = useDispatch();
  interface SearchFriend {
    f_email: string;
    f_name: string;
  }
  const [searchEmail, setSearchEmail] = useState('');
  const [searchFriendData, setSearchFriendData] = useState<SearchFriend[]>();
  const onChangeSearchEmail = useCallback((text: string) => {
    setSearchEmail(text.trim());
  }, []);
  const [responseData, setResponseData] = useState(0); //0이면 검색전, 1이면 검색 후(0), 2면 없음())

  const onAddBtn = useCallback(async () => {
    //const refreshFriendsListStatus = (state: RootState) => state.friends.status;
    const userEmail = await EncryptedStorage.getItem('chatUserEmail');
    try {
      const response = await axios.post(
        'http://43.201.116.97:3000/chat/small-chat/add-friend',
        {
          userEmail,
          searchEmail,
        },
      );
      if (response.data == 'success') {
        Alert.alert('알림', '친구추가 완료');
        dispatch(resetStatus());

        console.log('성공');
      }
    } catch (e) {
      console.log(e);
    }
  }, [searchEmail]);
  const onSearch = useCallback(async () => {
    const userEmail = await EncryptedStorage.getItem('chatUserEmail');
    console.log('일단 테스트', searchEmail);
    if (userEmail === searchEmail) {
      return Alert.alert('알림', '본인 계정을 친구로 추가할 수 없습니다.');
    }
    const response = await axios.get(
      'http://43.201.116.97:3000/chat/smallchat/search-friends',
      {
        params: {
          searchEmail: searchEmail,
          userEmail: userEmail,
        },
      },
    );

    if (response.data == '에러발생') {
      Alert.alert('알림', '성공');
    } else if (response.data == '검색 실패') {
      setResponseData(2);
    } else if (response.data == '이미 친구 추가가 완료되었습니다.') {
      Alert.alert('알림', '이미 추가 완료된 계정입니다.');
    } else {
      console.log(response.data);
      let data = response.data;
      let dataArray: SearchFriend[] = Object.values(data);
      setSearchFriendData(dataArray);
      console.log(response.data);
      setResponseData(1);
    }
  }, [searchEmail]);
  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      <View style={styles.topSearchPartStyle}>
        <TextInput
          style={styles.TextInputStyle}
          value={searchEmail}
          onChangeText={onChangeSearchEmail}
          placeholder="이메일 검색"
          placeholderTextColor={'gray'}
          onSubmitEditing={onSearch}
        />

        <Pressable onPress={onSearch} style={styles.searchBtnStyle}>
          <Text style={styles.searchBtnTextStyle}>검색</Text>
        </Pressable>
      </View>

      <View style={styles.listViewStyle}>
        {responseData == 0 ? (
          <Text
            style={{
              textAlign: 'center',
            }}>
            친구의 이메일을 검색해주세요.
          </Text>
        ) : responseData == 1 ? (
          <View style={styles.successViewStyle}>
            <View>
              <Text style={styles.nameTextStyle}>
                {searchFriendData![0].f_name}
              </Text>
              <Text style={{color: 'gray', fontWeight: 'bold'}}>
                {searchFriendData![0].f_email}
              </Text>
            </View>
            <View
              style={{
                shadowColor: '#000',
                shadowOffset: {
                  width: 2,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3,
                borderWidth: 1,
                borderRadius: 20,
                borderColor: '#20478a',
                backgroundColor: '#4176d1',
                padding: 8,
              }}>
              <Pressable onPress={onAddBtn}>
                <Icon
                  name="person-add-outline"
                  size={18}
                  style={{color: 'white'}}></Icon>
              </Pressable>
            </View>
          </View>
        ) : (
          <Text style={{textAlign: 'center'}}>
            {' '}
            해당 이메일의 유저가 없습니다.{' '}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeAreaStyle: {
    backgroundColor: PrimaryColor,
    flex: 1,
    alignItems: 'center',
  },
  topSearchPartStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 32,
  },
  TextInputStyle: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: Dimensions.get('window').width * 0.6,
    marginRight: 24,
  },
  searchBtnStyle: {
    backgroundColor: PrimaryColor,
    //marginHorizontal: 24,

    borderWidth: 1,
    borderRadius: 12,
    borderColor: 'black',
    paddingHorizontal: 16,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').width * 0.1,
  },
  searchBtnTextStyle: {
    color: 'black',
  },
  listTextStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 16,
  },
  listViewStyle: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 12,
    width: Dimensions.get('window').width * 0.9,
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  successViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameTextStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
});
export default SmallChatMore;
