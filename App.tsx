/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
//intro 스크린
import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
//import myprofileimg from './assets/images/myprofileimg.JPG';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationContainer, NavigationProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {store} from './src/redux/store';
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
} from 'react-native';
import ToDoLoginScreen from './src/screen/todoAppScreen/ToDoAppLogin';
import ToDoSignUpScreen from './src/screen/todoAppScreen/ToDoSignUp';
import PlannerView from './src/screen/todoAppScreen/ToDoAppMain';
import AddPlanScreen from './src/screen/todoAppScreen/TodoAppAddPlan';
import UpdatePlan from './src/screen/todoAppScreen/TodoAppUpdatePlan';
import SmallChatAppHome from './src/screen/smallChatApp/SmallChatLogin';
import SmallChatTabNavi from './src/Navigator/BottomTabNavigator';
import ChattingContent from './src/screen/smallChatApp/SmallChatChattingContent';
import SmallChatSignUp from './src/screen/smallChatApp/SmallChatSignUp';
import {Provider} from 'react-redux';

//import DetailScreen from './src/screen/ToDoApp';
Ionicons.loadFont();

//아래는 스택을 등록하는 부분. 그냥 외워야 할듯.
const Stack = createNativeStackNavigator();
//console.log(a);
export type RootStackParamList = {
  HomeScreen: undefined;
  ToDoLoginScreen: undefined;
  ToDoSignUpScreen: undefined;
  ToDoAppMain: undefined;
  AddPlanScreen: {selectDate: string};
  UpdatePlan: {
    selectDate: string;
    id: string;
    description: string;
    startTime: number;
    endTime: number;
  };
  SmallChatAppHome: undefined;
  SmallChatMain: undefined;
  SmallChatTabNavi: undefined;
  SmallChatSignUp: undefined;
  ChattingContent: {myEmail: string; yourEmail: string};
  ChattingScreen: undefined;
  //ChattingScreen: undefined;
};
const BrightColor = '#fff6db';
const PrimaryBlue = '#879dd9';
//여기까지

import firestore from '@react-native-firebase/firestore';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

function HomeScreen({
  navigation,
}: {
  navigation: NavigationProp<RootStackParamList, 'HomeScreen'>;
}) {
  const [addName, setAddName] = useState('test data');
  const [addAge, setAddAge] = useState('test data age');
  const addCollection = firestore().collection('users');

  const addText = async () => {
    console.log('asdf');
    try {
      await addCollection.add({
        name: addName,
        age: addAge,
      });
      setAddName('');
      setAddAge('');
      console.log('Create Complete!');
    } catch (error) {
      console.log(error);
    }
  };
  //addText();

  const PushNotification = async () => {
    let fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('토큰 : ', fcmToken);
    }
  };

  useEffect(() => {
    requestUserPermission();
    PushNotification();
    console.log('asdf');
    // Register background handlerz`
    messaging().setBackgroundMessageHandler(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('Message handled in the background!', remoteMessage);
      },
    );

    // Register foreground handler
    const unsubscribe = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('Message handled in the foreground!', remoteMessage);
      },
    );

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      <View style={styles.middlePartViewStyle}>
        <Image
          style={styles.imageStyle}
          source={require('./src/images/myprofileimg.jpg')}
        />
        <Text style={{margin: 16, fontSize: 18, fontWeight: 'bold'}}>
          @keonhwi_991231
        </Text>
        <Text style={{fontSize: 14}}>☆ Hi, I'm KeonHwi ☆</Text>
        <Pressable onPress={addText}>
          <Ionicons
            name="logo-github"
            size={40}
            style={{margin: 32, justifyContent: 'center'}}></Ionicons>
        </Pressable>
      </View>
      <View>
        <Pressable onPress={() => navigation.navigate('ToDoLoginScreen')}>
          <Text style={styles.PressableTextStyle}>First todo list app</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('SmallChatAppHome')}>
          <Text style={styles.PressableTextStyle}>Small ChatApp</Text>
        </Pressable>
        <Pressable>
          <Text style={styles.PressableTextStyle}>My Github Repository</Text>
        </Pressable>
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.bottomTextStyle}>RnStudy</Text>
      </View>
    </SafeAreaView>
  );
}

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HOME">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ToDoLoginScreen"
            component={ToDoLoginScreen}
            options={{
              headerShown: true,
              headerTitle: 'To Do List App',
              headerStyle: {
                //shadowOpacity: 0,
                ...Platform.select({
                  android: {elevation: 0},
                  ios: {shadowOpacity: 0},
                }),
                backgroundColor: PrimaryBlue,
              },
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="ToDoSignUpScreen"
            component={ToDoSignUpScreen}
            options={{
              headerShown: true,
              headerTitle: '회원가입',
              headerBackTitle: '로그인',
              headerStyle: {
                backgroundColor: PrimaryBlue,
              },
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="ToDoAppMain"
            component={PlannerView}
            options={{
              gestureEnabled: false,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="UpdatePlan"
            component={UpdatePlan}
            options={{
              headerShown: true,
              headerTitle: '일정 추가',
              headerBackTitle: 'back',
              headerStyle: {
                backgroundColor: PrimaryBlue,
              },
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="AddPlanScreen"
            component={AddPlanScreen}
            options={{
              headerShown: true,
              headerTitle: '일정 추가',
              headerBackTitle: 'Back',
              headerStyle: {
                backgroundColor: PrimaryBlue,
              },
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="SmallChatAppHome"
            component={SmallChatAppHome}
            options={{
              headerShown: true,
              headerTitle: '채팅 앱',
              headerBackTitle: 'Back',
              headerStyle: {
                backgroundColor: BrightColor,
              },
              headerTintColor: 'black',
            }}
          />
          {/* <Stack.Screen
          name="SmallChatMain"
          component={SmallChatMain}
          options={{
            headerShown: true,
            headerTitle: 'Light Chat',
            headerBackTitle: 'Back',
            headerStyle: {
              backgroundColor: BrightColor,
            },
            headerTintColor: 'black',
          }}
        /> */}
          <Stack.Screen
            name="ChattingContent"
            component={ChattingContent}
            options={{
              headerShown: true,
              headerTitle: '채팅',
              headerBackTitle: 'Back',
              headerStyle: {
                backgroundColor: BrightColor,
              },
              headerTintColor: 'black',
            }}
          />
          <Stack.Screen
            name="SmallChatTabNavi"
            component={SmallChatTabNavi}
            options={{
              gestureEnabled: false,
              headerShown: false, // 필요하다면 이를 통해 헤더를 숨길 수 있습니다.
            }}
          />
          <Stack.Screen
            name="SmallChatSignUp"
            component={SmallChatSignUp}
            options={{
              headerShown: false, // 필요하다면 이를 통해 헤더를 숨길 수 있습니다.
            }}
          />
          {/* <Stack.Screen
          name="ChattingScreen"
          component={ChattingScreen}
          options={{
            headerShown: false, // 필요하다면 이를 통해 헤더를 숨길 수 있습니다.
          }}
        /> */}
          {/* <Stack.Screen
          name="MainTabNavigator"
          component={MainTabNavigator}
          options={{
            headerShown: false,
          }}
        /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
const styles = StyleSheet.create({
  safeAreaStyle: {
    backgroundColor: BrightColor,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    borderRadius: Dimensions.get('window').width * 0.15, // 둥근 모양을 위한 값, 값은 조절 가능
    width: Dimensions.get('window').width * 0.3, // 이미지 너비, 값은 조절 가능
    height: Dimensions.get('window').width * 0.3, // 이미지 높이, 값은 조절 가능
    resizeMode: 'cover', // 이미지가 너비와 높이에 맞게 조절되도록
    overflow: 'hidden', // 이미지가 부모 컨테이너를 벗어나지 않도록
    alignItems: 'center',
    justifyContent: 'center',
  },
  middlePartViewStyle: {
    marginTop: 64,
    //flex: 2.5,
    alignItems: 'center',
    //justifyContent: 'center',
  },
  PressableTextStyle: {
    width: (Dimensions.get('window').width * 8) / 9,
    padding: 16,
    margin: 8,
    borderWidth: 1.5,
    borderColor: 'gray',
    borderRadius: 24,
    textAlign: 'center',
    // fontWeight : 'bold'
  },
  bottomTextStyle: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 0,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;
