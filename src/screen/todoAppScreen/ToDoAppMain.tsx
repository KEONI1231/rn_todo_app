import {NavigationProp, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  SafeAreaInsetsContext,
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../../../App';

const PrimaryColor = '#879dd9';
function PlanCard() {
  return (
    <View style={styles.planCardStyle}>
      <View style={styles.cardPositionStyle}>
        <View style={{flexDirection: 'row'}}>
          <Text>adsf</Text>
          <Text style={styles.planCardContentTextStyle}>밥먹기,똥싸기,</Text>
        </View>
        <Pressable
          onPress={() => {
            console.log('취소');
          }}>
          <Icon name="close-circle-outline" color="white" size={22} style={{}}>
            {' '}
          </Icon>
        </Pressable>
      </View>
    </View>
  );
}
function CalendarView(props: any) {
  const selectDate = props.selectDate;
  const setSelectDate = props.setSelectDate;
  const markedDates = {
    '2023-07-27': {marked: true},
    '2023-07-28': {marked: true},
    '2023-07-01': {marked: true},
  };

  useEffect(() => {
    console.log(selectDate);
  }, [selectDate]);
  return (
    <Calendar
      style={styles.calendar}
      markedDates={markedDates}
      onDayPress={day => {
        setSelectDate(day.dateString);
        const userEmail = EncryptedStorage.getItem('userEmail');

        //일정 조회
        axios.post('http://43.201.116.97:3000/todoApp/user/getPlan', {
          userEmail,
          selectDate,
        });

        //console.log(selectDate);
      }}
      theme={{
        selectedDayBackgroundColor: 'red',
        todayBackgroundColor: PrimaryColor,
        arrowColor: 'blue',
        dotColor: 'purple',
        todayTextColor: 'white',
      }}></Calendar>
  );
}
function PlannerView({
  navigation,
}: {
  navigation: NavigationProp<RootStackParamList, 'ToDoSignUpScreen'>;
}) {
  //const navigation = useNavigation();
  const [selectDate, setSelectDate] = useState('0000-00-00');
  //console.log(selectDate);
  const onAddPlan = useCallback(async () => {
    if (selectDate != '0000-00-00') {
      navigation.navigate('AddPlanScreen', {selectDate: selectDate});
    } else {
      Alert.alert('알림', '추가할 날짜를 먼저 선택해주세요!');
    }
  }, [selectDate]);
  return (
    <SafeAreaProvider>
      <SafeAreaInsetsContext.Consumer>
        {insets => (
          <View
            style={{
              paddingTop: insets?.top,
              paddingLeft: insets?.left,
              paddingRight: insets?.right,
              paddingBottom: 10, // 바텀에 대한 안전 영역 적용을 하지 않음
              ...styles.safeAreaStyle, // 기존의 SafeAreaView style도 적용
            }}>
            {/* 나머지 컴포넌트 */}
            <View>
              <CalendarView
                selectDate={selectDate}
                setSelectDate={setSelectDate}></CalendarView>
              <ScrollView>
                <PlanCard></PlanCard>
                <PlanCard></PlanCard>
                <PlanCard></PlanCard>
                <PlanCard></PlanCard>
                <PlanCard></PlanCard>
                <PlanCard></PlanCard>
              </ScrollView>
              <View style={styles.addBtnStyle}>
                <Pressable onPress={onAddPlan}>
                  <Text style={styles.addBtnTextStyle}>추가버튼</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </SafeAreaInsetsContext.Consumer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaStyle: {
    alignItems: 'center',
    backgroundColor: PrimaryColor,
    flex: 1,
  },
  cardPositionStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  defaultTextStyle: {
    color: '#e0e0e0',
    fontSize: 24,
    fontWeight: 'bold',
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    width: Dimensions.get('window').width,
    marginBottom: 16,
  },
  planCardStyle: {
    borderColor: 'white',
    borderWidth: 1.2,
    marginHorizontal: 8,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
  },
  planCardTitleTextStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    paddingVertical: 4,
  },
  planCardContentTextStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 4,
  },
  addBtnStyle: {
    alignItems: 'center',
    //backgroundColor: 'purple',
  },
  addBtnTextStyle: {
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 12,
    margin: 12,
    padding: 12,
    fontWeight: 'bold',
  },
});
export default PlannerView;
