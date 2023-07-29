import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {RootStackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import io from 'socket.io-client';
import {useEffect, useState} from 'react';
import axios from 'axios';
let socket;

interface ChattingInfo {
  userEmail: string;
  friendEmail: string;
}
interface MessageCardProps {
  userEmail: string;
  friendEmail: string;
}
interface ChatItem {
  id: number;
  a_email: string;
  b_email: string;
  a_name: string;
  b_name: string;
  sender: string;

  contents: string;
  time: string;
}
const PrimaryColor = '#fff6db';

const ENDPOINT = 'http://43.201.116.97:3000';

function ChattingContent({route}: any) {
  const userEmail = route.params.myEmail;
  const friendEmail = route.params.yourEmail;
  console.log('채팅 컨텐츠 화면 이메일 : ', userEmail);
  console.log('채팅 컨텐츠 화면 이메일 : ', friendEmail);
  return (
    <View style={styles.safeAreaStyle}>
      <View style={{flex: 1}}>
        <MessageCard
          userEmail={userEmail}
          friendEmail={friendEmail}></MessageCard>
      </View>
      <View style={styles.sendMessageViewStyle}>
        <TextInput
          placeholder="메세지 입력"
          style={styles.textInputStyle}
          placeholderTextColor={'gray'}></TextInput>
        <Pressable>
          <Text style={styles.sendBtnTextStyle}>전송</Text>
        </Pressable>
      </View>
    </View>
  );
}
function MessageCard({userEmail, friendEmail}: MessageCardProps) {
  let data;
  let dataArray;
  let chattingsLists;
  const [chatLists, setChatLists] = useState<ChatItem[]>([]);
  const [time, setTime] = useState('');
  useEffect(() => {
    try {
      const getChatDatas = async () => {
        const response = await axios(ENDPOINT + '/get-chat-contents', {
          params: {
            userEmail,
            friendEmail,
          },
        });
        if (response.data == 'faild') {
          Alert.alert('알림', '실패');
        } else {
          let data = response!.data;
          let dataArray = Object.values(data) as ChatItem[];

          setChatLists(dataArray);
          console.log(chatLists);
          Alert.alert('알림', '상공 ');
        }
      };
      getChatDatas();
    } catch (e) {
      console.log('에러 : ', e);
    }
  }, []);
  //여기에 FlatList 추가
  return (
    <FlatList
      keyExtractor={(item, index) => index.toString()}
      data={chatLists}
      renderItem={({item}) => {
        let time = item.time;
        let date = new Date(time);

        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        let hours = date.getHours().toString().padStart(2, '0');
        let minutes = date.getMinutes().toString().padStart(2, '0');

        let formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`;
        return (
          <View style={styles.isLeftStyle}>
            <View style={styles.messageCardViewStyle}>
              <Text style={styles.messageTextStyle}>
                {item.b_name} {'\n\n'}
                {item.contents}
              </Text>
              <Text>{formattedTime}</Text>
            </View>
          </View>
        );
      }}></FlatList>

    // <ScrollView>
    //   <View style={styles.isLeftStyle}>
    //     <View style={styles.messageCardViewStyle}>
    //       <Text style={styles.messageTextStyle}>
    //         메세지1, 메세지2, Message3, message4
    //       </Text>
    //     </View>
    //   </View>

    //   <View style={styles.isRightStyle}>
    //     <View style={styles.messageCardViewStyle}>
    //       <Text style={styles.messageTextStyle}>
    //         메세지1, 메세지2, Message3, message4
    //       </Text>
    //     </View>
    //   </View>

    //   <View style={styles.isRightStyle}>
    //     <View style={styles.messageCardViewStyle}>
    //       <Text style={styles.messageTextStyle}>
    //         메세지1, 메세지2, Message3, message4
    //       </Text>
    //     </View>
    //   </View>

    //   <View style={styles.isLeftStyle}>
    //     <View style={styles.messageCardViewStyle}>
    //       <Text style={styles.messageTextStyle}>
    //         메세지1, 메세지2, Message3, message4
    //       </Text>
    //     </View>
    //   </View>
    //   <View style={styles.isLeftStyle}>
    //     <View style={styles.messageCardViewStyle}>
    //       <Text style={styles.messageTextStyle}>
    //         메세지1, 메세지2, Message3, message4
    //       </Text>
    //     </View>
    //   </View>
    //   <View style={styles.isLeftStyle}>
    //     <View style={styles.messageCardViewStyle}>
    //       <Text style={styles.messageTextStyle}>
    //         메세지1, 메세지2, Message3, message4
    //       </Text>
    //     </View>
    //   </View>
    //   <View style={styles.isLeftStyle}>
    //     <View style={styles.messageCardViewStyle}>
    //       <Text style={styles.messageTextStyle}>
    //         메세지1, 메세지2, Message3, message4
    //       </Text>
    //     </View>
    //   </View>
    //   <View style={styles.isRightStyle}>
    //     <View style={styles.messageCardViewStyle}>
    //       <Text style={styles.messageTextStyle}>
    //         메세지1, 메세지2, Message3, message4
    //       </Text>
    //     </View>
    //   </View>
    //   <View style={styles.isLeftStyle}>
    //     <View style={styles.messageCardViewStyle}>
    //       <Text style={styles.messageTextStyle}>
    //         메세지1, 메세지2, Message3, message4
    //       </Text>
    //     </View>
    //   </View>

    //   <View style={styles.isLeftStyle}>
    //     <View style={styles.messageCardViewStyle}>
    //       <Text style={styles.messageTextStyle}>
    //         메세지1, 메세지2, Message3, message4
    //       </Text>
    //     </View>
    //   </View>
    // </ScrollView>
  );
}
const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    backgroundColor: PrimaryColor,
  },

  sendMessageViewStyle: {
    flexDirection: 'row',
    alignItems: 'flex-end',

    justifyContent: 'space-around',
    //marginHorizontal: 32,
    marginTop: 12,
    marginBottom: 32,
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 12,
    width: Dimensions.get('window').width * 0.7,
    paddingVertical: 12,
    paddingHorizontal: 16,
    //marginHorizontal: 12,
  },
  messageCardViewStyle: {
    marginHorizontal: 12,
    marginTop: 16,
    maxWidth: '70%',
  },

  messageTextStyle: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'black',
  },
  sendBtnTextStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  isLeftStyle: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  isRightStyle: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});

// const styles = StyleSheet.create({
//   safeAreaStyle: {
//     flex: 1,
//     backgroundColor: PrimaryColor,
//   },

//   sendMessageViewStyle: {
//     flexDirection: 'row',
//   },

//   messageCardViewStyle: {
//     marginHorizontal: 8,
//     marginTop: 16,
//     flexWrap: 'wrap',
//     alignItems: 'flex-start',
//     width: '50%',
//     //justifyContent: 'flex-end',
//   },
//   messageTextStyle: {
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: 'black',
//     flexShrink: 1,
//   },
//   isLeftStyle: {
//     alignItems: 'flex-start',
//   },
//   isRightStyle: {
//     alignItems: 'flex-end',
//   },
// });

export default ChattingContent;
