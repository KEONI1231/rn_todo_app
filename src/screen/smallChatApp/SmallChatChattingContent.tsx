import {
  Alert,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  NativeModules,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {RootStackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import io, {Socket} from 'socket.io-client';
import {useCallback, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';

let socket: Socket;

interface MessageCardProps {
  userEmail: string;
  friendEmail: string;
  flatListRef: any;
}
interface ChatItem {
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
  const user = useSelector((state: RootState) => state.user);
  const [message, setMessage] = useState('');
  const onChangeMessage = useCallback((text: string) => {
    setMessage(text);
  }, []);
  const [sendMessageRender, setSendMessageRender] = useState('');
  const flatListRef = useRef<FlatList | null>(null);
  const onSubmit = useCallback(() => {
    //console.log(message);
    socket = io(ENDPOINT);
    const userName = user.name;
    setMessage('');
    socket.emit(
      'sendMessage',
      {friendEmail, userEmail, userName, message},
      () => {},
    );
  }, [message, sendMessageRender]);
  useEffect(() => {}, [sendMessageRender]);
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  return (
    <View style={{flex: 1, backgroundColor: PrimaryColor}}>
      <MessageCard
        userEmail={userEmail}
        friendEmail={friendEmail}
        flatListRef={flatListRef}></MessageCard>

      <KeyboardAvoidingView
        keyboardVerticalOffset={statusBarHeight + 70}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.sendMessageViewStyle}>
          <TextInput
            placeholder="메세지 입력"
            style={styles.textInputStyle}
            onSubmitEditing={onSubmit}
            value={message}
            onChangeText={onChangeMessage}
            placeholderTextColor={'gray'}></TextInput>
          <Pressable onPress={onSubmit}>
            <Text style={styles.sendBtnTextStyle}>전송</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
function MessageCard({userEmail, friendEmail, flatListRef}: MessageCardProps) {
  const [chatLists, setChatLists] = useState<ChatItem[]>([]);
  const [chatContents, setChatContents] = useState('');
  const [isContents, setIsContents] = useState('');
  const user = useSelector((state: RootState) => state.user);
  let isData = 'nodata';
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
        } else if (response.data == 'fail') {
          setIsContents('no data');
          //console.log(response.data);
        } else {
          let data = response!.data;
          let dataArray = Object.values(data) as ChatItem[];
          setChatLists(dataArray);
          setIsContents('');
          isData = '';
          //console.log(chatLists);
        }
      };
      getChatDatas();
    } catch (e) {
      console.log('에러 : ', e);
    }
  }, []);
  const [rerender, setReRender] = useState('');
  useEffect(() => {
    console.log('Attempting to connect to server');
    // Connection
    socket = io(ENDPOINT);
    // Upon successful connection
    socket.emit('join', {userEmail, friendEmail}, () => {
      console.log('Connected to server');
    });
    return () => {
      socket.off();
    };
  }, [ENDPOINT]);
  let serverMessage = '';
  useEffect(() => {
    console.log('try to recieve server message');
    socket.on('message', serverMessage => {
      setChatLists(chatLists => [...chatLists, serverMessage]);
      setReRender(serverMessage.contents);

      setIsContents('');

      console.log('시간값', serverMessage.time);
      console.log(rerender);
      // 상태 업데이트는 비동기적이므로, 이 시점에서의 console.log는 업데이트 되지 않은 rerender 값을 보여줍니다.
    });
    return () => {
      socket.off();
    };
  }, [chatLists]); // rerender를 의존성 배열에서 제거합니다.

  let lastFormattedDate = '';

  return isContents == '' ? (
    <FlatList
      keyExtractor={(item, index) => index.toString()}
      data={chatLists}
      ref={flatListRef}
      onContentSizeChange={() => flatListRef.current.scrollToEnd()}
      renderItem={({item}) => {
        let time = item.time;
        let date = new Date(time);

        // 9시간을 빼서 한국 시간으로 변환
        date.setHours(date.getHours() - 9);

        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');

        let hours = date.getHours().toString().padStart(2, '0');
        let minutes = date.getMinutes().toString().padStart(2, '0');
        let formattedDate = `${year}년 ${month}월 ${day}일`;

        let formattedTime = `${hours}:${minutes}`;
        //console.log('시간,', formattedTime);
        let dateText = <View></View>;
        if (lastFormattedDate != formattedDate) {
          dateText = (
            <View style={styles.dateTextViewStyle}>
              <Text style={styles.formattedTimeStyle}>{formattedDate}</Text>
            </View>
          );
          lastFormattedDate = formattedDate;
        }
        console.log(item);
        return (
          <View>
            {dateText}
            <View
              style={
                item.sender == userEmail
                  ? styles.isRightStyle
                  : styles.isLeftStyle
              }>
              <View style={styles.messageCardViewStyle}>
                {item.sender == userEmail ? (
                  <></>
                ) : (
                  <Text
                    style={
                      item.sender == userEmail
                        ? styles.rightNameTextStyle
                        : styles.leftNameTextStyle
                    }>
                    {item.a_name}
                  </Text>
                )}
                {userEmail != item.sender ? (
                  <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                    <Text style={styles.messageTextStyle}>{item.contents}</Text>

                    <Text
                      style={
                        item.sender == userEmail
                          ? styles.rightTimeTextStyle
                          : styles.leftTimeTextStyle
                      }>
                      {formattedTime}
                    </Text>
                  </View>
                ) : (
                  <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                    <Text
                      style={
                        item.sender == userEmail
                          ? styles.rightTimeTextStyle
                          : styles.leftTimeTextStyle
                      }>
                      {formattedTime}
                    </Text>
                    <Text style={styles.messageTextStyle}>{item.contents}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        );
      }}></FlatList>
  ) : (
    <View style={{flex: 1}}>
      <Text></Text>
    </View>
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
    flexShrink: 1,
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
  rightNameTextStyle: {
    textAlign: 'right',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  leftNameTextStyle: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  leftTimeTextStyle: {
    textAlign: 'left',
    paddingHorizontal: 8,
    marginTop: 8,
    color: 'gray',
  },
  rightTimeTextStyle: {
    textAlign: 'right',
    paddingHorizontal: 8,
    marginTop: 8,
    color: 'gray',
  },
  formattedTimeStyle: {
    alignItems: 'center',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dateTextViewStyle: {
    width: Dimensions.get('window').width * 0.4,
    alignSelf: 'center',
    paddingVertical: 4,
    backgroundColor: 'gray',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    opacity: 0.4,
    marginVertical: 16,
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
