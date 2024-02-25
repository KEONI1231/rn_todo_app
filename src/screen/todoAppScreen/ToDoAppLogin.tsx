import react, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../../App';
import {NavigationProp} from '@react-navigation/native';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

let encryptedEmail;
let encryptedPassword;
function ToDoLoginScreen({
  navigation,
}: {
  navigation: NavigationProp<RootStackParamList, 'ToDoSignUpScreen'>;
}) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  const emailRef = useRef<TextInput | null>(null);
  const pwRef = useRef<TextInput | null>(null);
  const [autoLoginValue, setAutoLoginValue] = useState('false');
  //로그인 파트
  useEffect(() => {
    const tryAutoLogin = async () => {
      //await EncryptedStorage.setItem('autoLogin', 'false');
      const userLogin = await EncryptedStorage.getItem('autoLogin');
      console.log(userLogin);
      if (userLogin == 'true') {
        //await EncryptedStorage.setItem('autoLogin', 'true');
        encryptedEmail = await EncryptedStorage.getItem('userEmail');
        encryptedPassword = await EncryptedStorage.getItem('userPassword');
        // await Promise.all([
        //   setEmail(encryptedEmail!.toString()),
        //   setPw(encryptedPassword!.toString()),
        // ]);
        //console.log(email);
        //console.log(pw);

        onSubmit(encryptedEmail!.toString(), encryptedPassword!.toString());
      } else if (userLogin == null || userLogin == 'false') {
        await EncryptedStorage.setItem('autoLogin', 'false');
      }
    };
    tryAutoLogin();
  }, []);
  const onChangeAutoLoginTrue = useCallback(async () => {
    setAutoLoginValue('true');
    console.log('true');
    await EncryptedStorage.setItem('autoLogin', 'true');
  }, []);
  const onChangeAutoLoginFalse = useCallback(async () => {
    setAutoLoginValue('false');
    console.log('false');
    await EncryptedStorage.setItem('autoLogin', 'false');
  }, []);
  const onSubmit = useCallback(
    async (email: string, pw: string) => {
      console.log("로그인 시도 : " , email);
      console.log("로그인 시도 : " ,pw);
      try {
        console.log(email);
        console.log(pw);
        const response = await axios.post(
          'https://keoni-spring-study.duckdns.org:8080/api/v1/todo-app/log-in',
          {
            email: email,
            password : pw,
          },
        );
        //console.log(response.data.error);
        if(response.data.error == null) {
          console.log(response.data.data.accessToken);
          await EncryptedStorage.setItem('accessToken', response.data.data.accessToken);
          await EncryptedStorage.setItem('refreshToken', response.data.data.refreshToken);
          Alert.alert('알림', '로그인 완료되었습니다.');
          //console.log(response.data);
          navigation.navigate('ToDoAppMain');
        }
        else {
          Alert.alert("알림", response.data.error.message)
        }
      } catch (e) {
        //Alert.alert("알림", e.toString());
        console.log(e);
      } finally {

      }
    },
    [email, pw],
  );
  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);
  const onChangePw = useCallback((text: string) => {
    setPw(text.trim());
  }, []);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaStyle}>
        <ScrollView>
          <View>
            <Text style={styles.loginTextStyle}>Log In</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="login / email"
              placeholderTextColor={'gray'}
              autoComplete="email"
              textContentType="emailAddress"
              value={email}
              ref={emailRef}
              onSubmitEditing={() => {
                pwRef.current?.focus();
              }}
              onChangeText={onChangeEmail}
              returnKeyType="send"></TextInput>
            <TextInput
              style={styles.textInputStyle}
              placeholder="password"
              placeholderTextColor={'gray'}
              autoComplete="email"
              onSubmitEditing={() => onSubmit(email, pw)}
              onChangeText={onChangePw}
              value={pw}
              ref={pwRef}
              textContentType="emailAddress"
              secureTextEntry
              returnKeyType="send"></TextInput>
            <View style={styles.rememberMeStyle}>
              <BouncyCheckbox
                style={{alignSelf: 'flex-end', paddingRight: 8}}
                size={20}
                fillColor="indigo"
                unfillColor="#FFFFFF"
                hitSlop={{top: 5, bottom: 5, left: 0, right: 0}}
                iconStyle={{borderColor: 'red'}}
                onPress={async (isChecked: boolean) => {
                  if (isChecked == false) {
                    onChangeAutoLoginFalse();
                  } else {
                    onChangeAutoLoginTrue();
                  }
                }}></BouncyCheckbox>
              <Text style={{textAlign: 'center'}}>Remember me</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomViewArea}>
          <Pressable
            style={styles.loginBtnStyle}
            onPress={() => onSubmit(email, pw)}>
            <Text style={styles.loginBtnTextStyle}>Log In</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('ToDoSignUpScreen')}
            style={styles.signupBtnStyle}>
            <Text style={styles.loginBtnTextStyle}>Sign Up</Text>
          </Pressable>
          <Pressable style={styles.forgotPassBtnStyle}>
            <Text style={styles.forgotPassTextStyle}>
              Forgot your password?
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  bottomViewArea: {
    //backgroundColor: '#fff6db',
    flex: 1,
    backgroundColor: '#879dd9',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  safeAreaStyle: {
    //backgroundColor: '#fff6db',
    backgroundColor: '#879dd9',
    flex: 1,
    alignItems: 'center',
  },
  loginTextStyle: {
    marginTop: 88,
    fontSize: 48,
    fontWeight: 'bold',
    //color : '#5a4590',
    color: 'white',
    textAlign: 'left',
    marginBottom: 48,
  },
  textInputStyle: {
    borderWidth: 1,
    borderRadius: 20,
    width: Dimensions.get('window').width * 0.9,
    borderColor: 'white',
    height: 56,
    paddingLeft: 16,
    fontSize: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  signUpTextStyle: {
    textAlign: 'right',
    marginRight: 8,
  },
  appTitleTextStyle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  linearGradient: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,

    paddingLeft: 15,
    paddingRight: 15,
    width: Dimensions.get('window').width * 0.8,
    height: 48,
    borderRadius: 30,
  },
  signupBtnStyle: {
    //position: 'absolute',
    alignSelf: 'center',
    //bottom: 48,
    fontSize: 24,
    fontWeight: 'bold',
    width: Dimensions.get('window').width * 0.8,
    textAlign: 'center',
    marginBottom: 8,
    justifyContent: 'center',
    height: 48,
    borderColor: 'white',
    borderWidth: 1.5,
    borderRadius: Dimensions.get('window').width * 0.4,
  },
  loginBtnStyle: {
    //position: 'absolute',
    alignSelf: 'center',
    //bottom: 96,
    fontSize: 24,
    fontWeight: 'bold',
    width: Dimensions.get('window').width * 0.8,
    textAlign: 'center',
    marginBottom: 24,
    justifyContent: 'center',
    height: 48,
    borderColor: 'white',
    borderWidth: 1.5,
    borderRadius: Dimensions.get('window').width * 0.4,
  },
  forgotPassBtnStyle: {
    //position: 'absolute',
    alignSelf: 'center',
    //bottom: 0,
    fontSize: 24,
    fontWeight: 'bold',
    justifyContent: 'center',
    height: 48,
  },
  loginBtnTextStyle: {
    fontSize: 24,
    textAlign: 'center',

    color: 'white',
    fontWeight: 'bold',
  },
  forgotPassTextStyle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  rememberMeStyle: {
    color: '#5a4590',
    marginRight: 8,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
});

export default ToDoLoginScreen;
