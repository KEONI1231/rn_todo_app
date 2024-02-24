import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useCallback, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {SafeAreaView} from 'react-native-safe-area-context';

const BrightColor = '#fff6db';
function SmallChatSignUp() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const pwRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);
  const statusMessageRef = useRef<TextInput | null>(null);

  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);
  const onChangeName = useCallback((text: string) => {
    setName(text.trim());
  }, []);
  const onChangePasseword = useCallback((text: string) => {
    setPw(text.trim());
  }, []);
  const onChangeStatusMessage = useCallback((text: string) => {
    setStatusMessage(text);
  }, []);

  const navigation = useNavigation();
  const onSubmit = useCallback(async () => {
    const device_fcm_token = await EncryptedStorage.getItem('fcmToken');
    
    console.log(device_fcm_token);
    try {
      const response = await axios.post(
        'http://43.201.116.97:3000/user/smallchat/user/create',
        {
          email,
          pw,
          name,
          statusMessage,
          device_fcm_token,
        },
      );
      if (response.data == 'err 발생') {
        Alert.alert('알림', '에러발생');
      } else if (response.data == '이메일이 중복되었습니다.') {
        Alert.alert('알림', '이메일이 중복되었습니다.');
      } else {
        navigation.goBack();
        Alert.alert('알림', '회원가입 완료');
      }
    } catch (e) {}
  }, [email, name, pw, statusMessage]);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <SafeAreaView style={styles.safeAreaStyle}>
        <ScrollView>
          <View style={styles.SmallChatViewStyle}>
            <Text style={styles.SmallChatTextStyle}>SmallChat</Text>
          </View>
          <View>
            <Text style={styles.defaultTextSize}>이메일</Text>
            <TextInput
              style={styles.TextInputStyle}
              placeholder="이메일"
              placeholderTextColor={'gray'}
              value={email}
              ref={emailRef}
              onSubmitEditing={() => {
                pwRef.current?.focus();
              }}
              onChangeText={onChangeEmail}></TextInput>
            <Text style={styles.defaultTextSize}>비밀번호</Text>
            <TextInput
              style={styles.TextInputStyle}
              placeholder="비밀번호"
              placeholderTextColor={'gray'}
              value={pw}
              ref={pwRef}
              secureTextEntry
              onSubmitEditing={() => {
                nameRef.current?.focus();
              }}
              onChangeText={onChangePasseword}></TextInput>
            <Text style={styles.defaultTextSize}>이름</Text>
            <TextInput
              style={styles.TextInputStyle}
              placeholder="이름"
              placeholderTextColor={'gray'}
              value={name}
              ref={nameRef}
              onSubmitEditing={() => {
                statusMessageRef.current?.focus();
              }}
              onChangeText={onChangeName}></TextInput>
            <Text style={styles.defaultTextSize}>상태메세지</Text>
            <TextInput
              style={styles.statusMessageInputStyle}
              placeholder="상태메세지"
              placeholderTextColor={'gray'}
              value={statusMessage}
              ref={statusMessageRef}
              onChangeText={onChangeStatusMessage}
              onSubmitEditing={onSubmit}
              multiline={true}
              scrollEnabled={true}></TextInput>
          </View>

          <Pressable style={styles.btnStyle} onPress={onSubmit}>
            <Text style={styles.btnTextStyle}>버튼</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: BrightColor,
    //justifyContent: 'center',
  },
  SmallChatViewStyle: {
    marginTop: 32,
    borderWidth: 2,
    borderColor: 'black',
    paddingHorizontal: 96,
    paddingVertical: 48,
    borderRadius: 8,
  },
  SmallChatTextStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  defaultTextSize: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
  },
  TextInputStyle: {
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.9,
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  statusMessageInputStyle: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').width * 0.5,
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: 120,
    paddingHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  btnStyle: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 12,
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: Dimensions.get('window').width * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  btnTextStyle: {
    textAlign: 'center',
  },
});
export default SmallChatSignUp;
