//ec2에서 rds 접속하는 커맨드
//mysql -h highconnect-db.c8vw3dkxojx3.ap-northeast-2.rds.amazonaws.com -P 3306 -u admin -p

import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useCallback, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {SafeAreaView} from 'react-native-safe-area-context';

function CalendarView() {
  return <Calendar style={styles.calendar} />;
}

function ToDoSignUpScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);
  const [loading, setLoading] = useState(false);

  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);
  const onChangePasseword = useCallback((text: string) => {
    setPw(text.trim());
  }, []);
  const onChangeName = useCallback((text: string) => {
    setName(text.trim());
  }, []);
  const onSubmit = useCallback(async () => {
    /*
      조건문 정리
      1. email, pw, name 텍스트가 비어있는가?
        - 비어있다면 버튼 비활성 시각화
        - 텍스트 입력해달라는 문구 띄우기 (알러트)
      2. 정규식을 충족하는가? (email, password)


      충족 후 할일
      1. 서버 접근 후 처리(axios)
        - 서버에서 받아오는 에러 처리
      2. 알러트 띄우기 (ex. 회원가입 중입니다. 등등)
    
      해볼 것
      1. 키보드가 올라가 있는 상태에서 포커싱 벗어나면 키보드 닷기
      2. email, pw 입력할 때 엔터 누르면 다음 텍스트 인풋으로 포커싱 이동.
    */
    setLoading(true);

    try {
      const response = await axios.post(
        'http://43.201.116.97:3000/todoApp/user/create',
        {
          email,
          pw,
          name,
        },
      );
      console.log(email);
      if (response.data == 'err 발생') {
        Alert.alert('알림', '에러 발생');
      } else if (response.data == '이메일이 중복되었습니다.') {
        Alert.alert('알림', '이메일이 중복되었습니다.');
      } else {
        navigation.goBack();
        Alert.alert('알림', '회원가입 완료');
      }

      console.log(response.data);
    } catch (e) {
      Alert.alert('알림', '에러발생');
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [email, pw, name]);
  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      <View>
        <Text style={styles.testTextStyle}>Night{'\n'}Planner</Text>
        <Text style={styles.defaultTextStyle}>이메일</Text>
        <TextInput
          style={styles.textInputStyle}
          placeholder="이메일"
          value={email}
          ref={emailRef}
          clearButtonMode="while-editing"
          onChangeText={onChangeEmail}
          onSubmitEditing={() => {
            passwordRef.current?.focus();
          }}
          placeholderTextColor={'gray'}></TextInput>
        <Text style={styles.defaultTextStyle}>비밀번호</Text>
        <TextInput
          style={styles.textInputStyle}
          placeholder="비밀번호"
          value={pw}
          clearButtonMode="while-editing"
          secureTextEntry
          ref={passwordRef}
          onChangeText={onChangePasseword}
          onSubmitEditing={() => {
            nameRef.current?.focus();
          }}
          placeholderTextColor={'gray'}></TextInput>
        <Text style={styles.defaultTextStyle}>이름</Text>
        <TextInput
          style={styles.textInputStyle}
          placeholder="이름"
          clearButtonMode="while-editing"
          onSubmitEditing={onSubmit}
          value={name}
          ref={nameRef}
          onChangeText={onChangeName}
          placeholderTextColor={'gray'}></TextInput>
        <Pressable style={styles.signBtnStyle} onPress={onSubmit}>
          {loading == false ? (
            <Text style={styles.signUpBtnText}>회원가입</Text>
          ) : (
            <ActivityIndicator style={styles.indicatorStyle} color={'white'} />
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaStyle: {
    alignItems: 'center',
    //justifyContent: 'center',
    //backgroundColor: '#88acbd', 이 색도 괜찮은거 같은데...
    backgroundColor: '#879dd9',
    flex: 1,
  },

  defaultTextStyle: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    width: 100,
    padding: 4,
  },
  textInputStyle: {
    width: Dimensions.get('window').width * 0.9,
    height: 40,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: 'white',
    paddingLeft: 16,
    margin: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  testTextStyle: {
    marginBottom: 96,
    margin: 16,
    //alignItems: 'center',
    //justifyContent: 'center',
    textAlign: 'center',
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    borderWidth: 1.5,
    borderColor: 'white',
    //paddingVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendar: {
    borderBottomWidth: 1,

    borderBottomColor: '#e0e0e0',
  },
  signBtnStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  signUpBtnText: {
    textAlign: 'center',
    padding: 12,
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: 'white',
    width: Dimensions.get('window').width * 0.4,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  indicatorStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 12,
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: 'white',
    width: Dimensions.get('window').width * 0.4,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
});

export default ToDoSignUpScreen;
