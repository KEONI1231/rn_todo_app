/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
//intro 스크린
import React from 'react';
import type {PropsWithChildren} from 'react';
//import myprofileimg from './assets/images/myprofileimg.JPG';
import Icon from 'react-native-vector-icons/Ionicons';
import {NavigationContainer, NavigationProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  Image,
} from 'react-native';
import DetailScreen from './src/screen/todoAppScreen/ToDoApp';
import ToDoLoginScreen from './src/screen/todoAppScreen/ToDoApp';
import ToDoSignUpScreen from './src/screen/todoAppScreen/ToDoSignUp';
import PlannerView from './src/screen/todoAppScreen/ToDoAppMain';
import AddPlanScreen from './src/screen/todoAppScreen/TodoAppAddPlan';
//import DetailScreen from './src/screen/ToDoApp';

//아래는 스택을 등록하는 부분. 그냥 외워야 할듯.
const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  HomeScreen: undefined;
  ToDoLoginScreen: undefined;
  ToDoSignUpScreen: undefined;
  ToDoAppMain: undefined;
  AddPlanScreen: {selectDate: string};
};
//여기까지
function HomeScreen({
  navigation,
}: {
  navigation: NavigationProp<RootStackParamList, 'HomeScreen'>;
}) {
  const gitIcon = <Icon name="logo-github"></Icon>;
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
        <Icon name="logo-github" size={40} style={{margin: 32}}>
          {' '}
        </Icon>
        <Pressable onPress={() => navigation.navigate('ToDoLoginScreen')}>
          <Text style={styles.PressableTextStyle}>First todo list app</Text>
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

              backgroundColor: '#879dd9',
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
              backgroundColor: '#879dd9',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="ToDoAppMain"
          component={PlannerView}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AddPlanScreen"
          component={AddPlanScreen}
          options={{
            headerShown: true,
            headerTitle: '일정 추가',
            headerBackTitle: 'back',
            headerStyle: {
              backgroundColor: '#879dd9',
            },
            headerTintColor: 'white',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  safeAreaStyle: {
    backgroundColor: '#fff6db',
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
    flex: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
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
