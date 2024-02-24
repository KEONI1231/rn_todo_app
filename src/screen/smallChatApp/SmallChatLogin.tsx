import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import SmallChatSignUp from './SmallChatSignUp';
import {Provider, useDispatch, useSelector} from 'react-redux';
//import {RootState} from '../../redux/store';
import {login} from '../../redux/user/userSlice';
import {configureStore} from '@reduxjs/toolkit';

const PrimaryColor = '#fff6db';
function SmallChatAppHome({navigation}: {navigation: any}) {
  const [canGoNext, setCanGoNext] = useState(false);

  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);
  const onChangePassword = useCallback((text: string) => {
    setPw(text.trim());
  }, []);

  const emailRef = useRef<TextInput | null>(null);
  const pwRef = useRef<TextInput | null>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const tryAutoLogin = async () => {
      //await EncryptedStorage.setItem('tryChatAutoLogin', 'false');
      const userLogin = await EncryptedStorage.getItem('tryChatAutoLogin');
      //console.log(userLogin);
      if (userLogin == 'true') {
        console.log(userLogin);
        const encryptedEmail = await EncryptedStorage.getItem('chatUserEmail');
        const encryptedPassword = await EncryptedStorage.getItem(
          'chatUserPassword',
        );

        onSubmit(encryptedEmail!.toString(), encryptedPassword!.toString());
      } else if (userLogin == null || userLogin == 'false') {
        await EncryptedStorage.setItem('tryChatAutoLogin', 'false');
      }
    };
    tryAutoLogin();
  }, []);
  const onSubmit = useCallback(
    async (email: string, pw: string) => {
      //const user = useSelector ((state : RootState) => state.user)
      try {
        console.log(email);
        console.log(pw);
        const response = await axios.post(
          'http://43.201.116.97:3000/user/smallchat/user/login',
          {
            email,
            pw,
          },
        );
        if (response.data == 'no user info') {
          Alert.alert('알림', '가입된 유저가 없습니다.');
        } else {
          //네비게이션
          dispatch(
            login({
              email: response.data.email,
              pw: response.data.pw,
              name: response.data.name,
              statusMessage: response.data.statusMessage,
              deviceFcmToken: response.data.deviceFcmToken,
            }),
          );
          console.log(response.data);
          await EncryptedStorage.setItem('chatUserEmail', response.data.email);
          await EncryptedStorage.setItem('chatUserPassword', response.data.pw);
          await EncryptedStorage.setItem('chatUserName', response.data.name);

          //const testdata = await EncryptedStorage.getItem('userEmail');
          //console.log(response.data.email);
          //console.log(testdata);
          Alert.alert('알림', '로그인 완료되었습니다.');
          navigation.navigate('SmallChatTabNavi');
          //console.log(response.data);
        }
      } catch (e) {
        console.log(e);
        Alert.alert('알림', 'Connection to the Server has failed!!');
      }
    },
    [email, pw],
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeAreaStyle}>
        <View>
          <Text style={styles.loginTextStyle}>로그인</Text>
          <TextInput
            style={styles.loginTextInputStyle}
            placeholder="이메일"
            placeholderTextColor={'gray'}
            textContentType="emailAddress"
            value={email}
            onChangeText={onChangeEmail}
            ///onSubmitEditing={}
            ref={emailRef}
            onSubmitEditing={() => {
              pwRef.current?.focus();
            }}
            returnKeyType="send"></TextInput>
          <TextInput
            style={styles.loginTextInputStyle}
            placeholder="비밀번호"
            placeholderTextColor={'gray'}
            textContentType="password"
            returnKeyType="send"
            value={pw}
            ref={pwRef}
            onSubmitEditing={() => onSubmit(email, pw)}
            onChangeText={onChangePassword}
            secureTextEntry></TextInput>
          <View style={styles.RememberMeViewStyle}>
            <BouncyCheckbox
              size={20}
              fillColor="black"
              unfillColor="#FFFFFF"
              isChecked={false}
              onPress={async (isChecked: boolean) => {
                //console.log(isChecked);
                if (isChecked == false) {
                  await EncryptedStorage.setItem('tryChatAutoLogin', 'false');
                } else {
                  await EncryptedStorage.setItem('tryChatAutoLogin', 'true');
                }
              }}></BouncyCheckbox>
            <Text>Remember Me</Text>
          </View>

          <View style={styles.bottomBtnViewStyle}>
            <Pressable
              onPress={() => {
                //setLoading(1);
                onSubmit(email, pw);
              }}>
              <Text style={styles.bottomBtnStyle}>로그인</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.navigate(SmallChatSignUp);
              }}>
              <Text style={styles.bottomBtnStyle}>회원가입</Text>
            </Pressable>
            <Pressable>
              <Text>Forgot your password?</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeAreaStyle: {
    backgroundColor: PrimaryColor,
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
  },
  loginTextStyle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 72,
    marginBottom: 20,
  },
  loginTextInputStyle: {
    //width: Dimensions.get('window')
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 12,
    width: Dimensions.get('window').width * 0.9,
    padding: 12,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: PrimaryColor,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.5,
    elevation: 2.5,
  },
  RememberMeViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  RememberMeTextColor: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomBtnViewStyle: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 48,
    alignItems: 'center',
  },
  bottomBtnStyle: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    padding: 12,
    width: Dimensions.get('window').width * 0.9,
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 16,
  },
});

export default SmallChatAppHome;
