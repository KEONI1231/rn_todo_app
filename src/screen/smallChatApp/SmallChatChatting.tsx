import {NavigationProp} from '@react-navigation/native';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../../App';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {getChatList} from '../../redux/Friend/getChattingSlice';
import {AppDispatch} from '../../redux/store';
function ChattingScreen({
  navigation,
}: {
  navigation: NavigationProp<RootStackParamList>;
}) {
  interface Friend {
    userEmail: string;
    b_email: string;
    id: number;
    name: string;
  }

  const BrightColor = '#fff6db';

  const dispatch: AppDispatch = useDispatch();

  const friendsChatLists = useSelector(
    (state: RootState) => state.chattingsLists.friendChatList,
  );
  const friendChatListsStatus = useSelector(
    (state: RootState) => state.chattingsLists.status,
  );
  useEffect(() => {
    if (friendChatListsStatus === 'idle') {
      dispatch(getChatList());
    }
  }, [friendChatListsStatus, dispatch]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: BrightColor}}>
      <Text style={styles.topTextStyle}>채팅목록</Text>
      <FlatList
        contentContainerStyle={{paddingBottom: 200, marginTop: 8}}
        data={friendsChatLists}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View
            style={{
              marginBottom: 16,
              ...styles.profileCardStyle,
            }}>
            <Pressable
              onPress={async () => {
                const myname = await EncryptedStorage.getItem('chatUserName');
                const yourName = item.b_email;
                navigation.navigate('ChattingContent', {
                  myEmail: myname!,
                  yourEmaail: yourName,
                });
              }}
              style={{flex: 1, justifyContent: 'center'}}>
              <View style={{marginLeft: 16, justifyContent: 'center'}}>
                <Text
                  style={{fontSize: 20, fontWeight: 'bold', marginBottom: 4}}>
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: 'gray',
                    justifyContent: 'center',
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {item.b_email}
                </Text>
              </View>
            </Pressable>
          </View>
        )}></FlatList>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  profileCardStyle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 12,
    paddingVertical: 16,
  },
  topTextStyle: {
    //marginTop: 32,
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 16,
    fontWeight: 'bold',
  },
});
export default ChattingScreen;

//채팅 내용 저장은 로컬에다가 하는 편?
//그리고 소켓은 그저 메세지를 전송하고 보내는 용도만.
//즉 데이터 베이스에 필요한 것은 그냥 누가 누구랑 채팅을 하고 있는가?
