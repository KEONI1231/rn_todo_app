import {NavigationProp} from '@react-navigation/native';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../../App';

function ChattingScreen({
  navigation,
}: {
  navigation: NavigationProp<RootStackParamList>;
}) {
  interface Friend {
    a: string;
    b: string;
    id: number;
  }

  const BrightColor = '#fff6db';
  const [friendsList, setFriendsList] = useState<Friend[]>([]);
  useEffect(() => {
    // const fetchData = async () => {
    //   const myName = await EncryptedStorage.getItem('chatUserName');
    //   const response = await axios.post(
    //     'http://43.201.116.97:3000/small-chat/getChatList',
    //     {myName},
    //   );
    //   let data = response.data;
    //   let dataArray: Friend[] = Object.values(data);
    //   setFriendsList(dataArray);
    // };
    // fetchData();
  }, [friendsList]);
  return (
    <View style={{flex: 1, backgroundColor: BrightColor}}>
      <FlatList
        contentContainerStyle={{paddingBottom: 200, marginTop: 8}}
        data={friendsList}
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
                const yourName = item.b;
                navigation.navigate('ChattingContent', {
                  myName: myname!,
                  yourName: yourName,
                });
              }}
              style={{flex: 1, justifyContent: 'center'}}>
              <View style={{marginLeft: 16, justifyContent: 'center'}}>
                <Text
                  style={{fontSize: 20, fontWeight: 'bold', marginBottom: 4}}>
                  {item.id}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: 'gray',
                    justifyContent: 'center',
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {item.b}
                </Text>
              </View>
            </Pressable>
          </View>
        )}></FlatList>
    </View>
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
});
export default ChattingScreen;

//채팅 내용 저장은 로컬에다가 하는 편?
//그리고 소켓은 그저 메세지를 전송하고 보내는 용도만.
//즉 데이터 베이스에 필요한 것은 그냥 누가 누구랑 채팅을 하고 있는가?
