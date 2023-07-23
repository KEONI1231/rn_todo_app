import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SmallChatMain from '../screen/smallChatApp/SmallChatMain';
import SmallChatChatting from '../screen/smallChatApp/SmallChatChatting';
import Icon from 'react-native-vector-icons/Ionicons';
import SmallChatMore from '../screen/smallChatApp/SmallChatSearch';
import SmallChatEtc from '../screen/smallChatApp/SmallChatEtc';
import ChattingScreen from '../screen/smallChatApp/SmallChatChatting';

const Tab = createBottomTabNavigator();
const BrightColor = '#fff6db';

function SmallChatTabNavi() {
  return (
    <Tab.Navigator
      initialRouteName="SmallChatMain"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: BrightColor,
        },
      }}>
      <Tab.Screen
        name="SmallChatMain"
        component={SmallChatMain}
        options={{
          headerShown: false,
          title: '친구',
          tabBarIcon: ({color, size}) => (
            <Icon name="home-outline" color={'black'} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="ChattingScreen"
        component={ChattingScreen}
        options={{
          title: '채팅',
          headerShown: false,
          headerStyle: {
            backgroundColor: BrightColor,
          },
          tabBarIcon: ({color, size}) => (
            <Icon name="chatbubbles-outline" color={'black'} size={20}></Icon>
          ),
        }}
      />
      <Tab.Screen
        name="SearchFriend"
        component={SmallChatMore}
        options={{
          headerShown: false,
          title: '추가',

          tabBarIcon: ({color, size}) => (
            <Icon name="search" color={'black'} size={20}></Icon>
          ),
        }}
      />
      <Tab.Screen
        name="Etc"
        component={SmallChatEtc}
        options={{
          title: '채팅',
          tabBarIcon: ({color, size}) => (
            <Icon name="chatbubbles-outline" color={'black'} size={20}></Icon>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default SmallChatTabNavi;

/*
<Tab.Navigator
  initialRouteName="SmallChatMain"
  screenOptions={{
    tabBarActiveTintColor: 'blue',  // 선택된 탭의 아이콘과 텍스트 색상
    tabBarInactiveTintColor: 'gray',  // 선택되지 않은 탭의 아이콘과 텍스트 색상
    tabBarStyle: {backgroundColor: 'yellow'},  // 탭 바의 배경색
  }}
>
</Tab.Navigator>
*/

/*
<Tab.Navigator
  initialRouteName="SmallChatMain"
  screenOptions={{
    tabBarLabelStyle: {fontSize: 20},  // 탭 바의 레이블 폰트 크기
    // 다른 옵션들...
  }}
>
  
</Tab.Navigator>


*/

/*
<Tab.Navigator
  initialRouteName="SmallChatMain"
  screenOptions={{
    tabBarStyle: {height: 80},  // 탭 바의 높이
    // 다른 옵션들...
  }}
>
 
</Tab.Navigator>
*/
