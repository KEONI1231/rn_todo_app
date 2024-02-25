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
} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../../App';

const PrimaryColor = '#879dd9';
function deletePlanAlert(id: any) {
  Alert.alert(
    // 말그대로 Alert를 띄운다
    '알림', // 첫번째 text: 타이틀 제목
    '일정을 삭제하시겠습니까?', // 두번째 text: 그 밑에 작은 제목
    [
      // 버튼 배열
      {
        text: '아니요', // 버튼 제목
        onPress: () => {}, //onPress 이벤트시 콘솔창에 로그를 찍는다
        style: 'cancel',
      },
      {
        text: '네',
        onPress: async () => {
          const accessToken = await EncryptedStorage.getItem('accessToken');
          console.log(accessToken)
          // console.log(userEmail);
          const response = await axios.delete(
            'https://keoni-spring-study.duckdns.org:8080/api/v1/todo-app/plans/detail',
            {
              headers : {
                Authorization : 'Bearer '+ accessToken
              }
            },
          );
          console.log(response.data);
          if (response.data == '삭제완료') {
            Alert.alert('알림', '삭제 완료');
          } else {
            Alert.alert('알림', '에러 발생');
          }
          //console.log(id);
        },
      }, //버튼 제목
      // 이벤트 발생시 로그를 찍는다
    ],
    {cancelable: false},
  );
}
function PlanCard(props: any) {
  const {selectDate, setSelectDate, planData, setPlanData, navigation} = props;

  if (planData != null) console.log(planData[1]);
  return planData != 'no plan data' ? (
    <FlatList
      data={planData?.sort((a: any, b: any) => a.startTime - b.startTime)}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <Pressable
          onPress={() => {
            //console.log(item.id);
          }}>
          <View style={styles.planCardStyle}>
            <View style={styles.cardPositionStyle}>
              <View style={styles.checkboxAndTextContainer}>
                <View style={{flex: 1}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.planCardTimeTextStyle}>
                      {item.startTime} 시 ~ {item.endTime}시
                    </Text>
                  </View>
                  <Text style={styles.planCardContentTextStyle}>
                    {item.description}
                  </Text>
                </View>
              </View>
              <View style={styles.iconContainer}></View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <Pressable onPress={() => deletePlanAlert(item.id)}>
                <Text
                  style={{
                    borderColor: 'white',
                    borderRadius: 8,
                    padding: 8,
                    borderWidth: 1,
                    //                alignContent: 'center',

                    textAlign: 'center',
                    color: 'white',
                    marginRight: 16,
                    //...styles.planCardTimeTextStyle,
                  }}>
                  삭제
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  const id = item.id;
                  const description = item.description;
                  const startTime = item.startTime;
                  const endTime = item.endTime;
                  // const selectDate = item.selectDate;
                  navigation.navigate('UpdatePlan', {
                    selectDate,
                    id,
                    description,
                    startTime,
                    endTime,
                  });
                }}>
                <Text
                  style={{
                    borderColor: 'white',
                    borderRadius: 8,
                    padding: 8,
                    borderWidth: 1,
                    //                alignContent: 'center',

                    textAlign: 'center',
                    color: 'white',

                    //...styles.planCardTimeTextStyle,
                  }}>
                  수정
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      )}></FlatList>
  ) : (
    <Text
      style={{
        flexShrink: 1,
        alignItems: 'center',
        textAlign: 'center',

        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        paddingVertical: 24,
        borderWidth: 1,
        borderColor: 'white',
        marginHorizontal: 16,
        borderRadius: 12,
        marginVertical: 16,
      }}>
      해당 날짜에 추가한 일정이 없습니다.
    </Text>
  );
}
function CalendarView(props: any) {
  const {selectDate, setSelectDate, setPlanData} = props;

  // const markedDates = {
  //   '2023-07-27': {marked: true},
  //   '2023-07-28': {marked: true},
  //   '2023-07-01': {marked: true},
  // };

  const [planMarkDate, setPlanMarkDate] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await EncryptedStorage.getItem("accessToken");
      console.log(accessToken);
      const response = await axios.get(
        'https://keoni-spring-study.duckdns.org:8080/api/v1/todo-app/plans',
        {
          headers: {
            Authorization : 'Bearer '+ accessToken
          }
        },
      );
      console.log(response.data);
      let data = Object.values(response.data.data) as {selectDate: string}[];

      // markedDates 객체를 생성합니다.
      let newMarkedDates: {[date: string]: {marked: boolean}} = {};
      data.forEach(item => {
        //console.log(data);
        newMarkedDates[item.selectDate] = {marked: true};
      });

      // markedDates 상태를 업데이트합니다.
      setMarkedDates(newMarkedDates);
    };
    fetchData();
  }, []);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});

  const [planedResDate, setPlanedResDate] = useState<string | null>(null);
  return (
    <Calendar
      style={styles.calendar}
      markedDates={markedDates}
      // 처음 상태 설정에서 {}가 아니라 초기값을 줍니다.
      onDayPress={async day => {
        const userEmail = await EncryptedStorage.getItem('userEmail');
        setSelectDate(day.dateString);
        //console.log(selectDate);
        // 이전에 선택된 날짜의 상태를 초기화하고 새로운 날짜를 강조합니다.
        setMarkedDates((prevState: Record<string, any>) => ({
          ...prevState,
          // 이전에 선택된 날짜가 있다면 초기 상태로 되돌립니다.
          ...(planedResDate && {
            [planedResDate]: {
              ...prevState[planedResDate],
              selected: false,
              selectedColor: undefined,
            },
          }),
          // 새로 선택된 날짜를 강조합니다.
          [day.dateString]: {
            ...prevState[day.dateString],
            selected: true,
            selectedColor: PrimaryColor,
          },
        }));
        // 새로 선택된 날짜를 저장합니다.
        setPlanedResDate(day.dateString);
        const accessToken = await EncryptedStorage.getItem("accessToken");
        const planDataResponse = await axios.get(
          'https://keoni-spring-study.duckdns.org:8080/api/v1/todo-app/plans/detail/',
          {
            headers:{
              Authorization : 'Bearer ' + accessToken
            },params:{
              selectDate : selectDate
            }
          },
        );
        let data = planDataResponse.data; // response.data는 서버에서 받은 데이터입니다.
        let dataArray = Object.values(data);
        if (data === 'no plan data') {
          setPlanData('no plan data');
        } else {
          //for (let i =0; i < dataArray.length; i++) {
          //console.log(dataArray);
          //}
          setPlanData(dataArray);
        }
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
    //console.log(selectDate);
    if (selectDate != '0000-00-00') {
      navigation.navigate('AddPlanScreen', {selectDate: selectDate});
    } else {
      Alert.alert('알림', '추가할 날짜를 먼저 선택해주세요!');
    }
  }, [selectDate]);
  const logOut = useCallback(async () => {
    await EncryptedStorage.setItem('autoLogin', 'false');
    Alert.alert('알림', '로그아웃이 완료되었습니다.');

    for (let i = 0; i < 2; i++) {
      navigation.goBack();
    }
  }, []);
  const [planData, setPlanData] = useState(null);
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
                setSelectDate={setSelectDate}
                planData={planData} // 오타를 수정했습니다.
                setPlanData={setPlanData}
              />
              <PlanCard
                selectDate={selectDate}
                setSelectDate={setSelectDate}
                planData={planData} // 오타를 수정했습니다.
                setPlanData={setPlanData}
                navigation={navigation}
              />

              <View style={styles.addBtnStyle}>
                <Pressable onPress={logOut}>
                  <Text style={styles.addBtnTextStyle}>로그아웃</Text>
                </Pressable>
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

  addBtnStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    //paddingHorizontal: 44,
    marginVertical: 10, //backgroundColor: 'purple',
  },
  addBtnTextStyle: {
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 12,

    padding: 12,
    fontWeight: 'bold',
  },
  cardPositionStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  checkboxAndTextContainer: {
    flexDirection: 'row',
    flex: 1,
  },

  planCardContentTextStyle: {
    flexShrink: 1,
    flexWrap: 'wrap',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 4,
    //marginBottom: 20,
  },
  planCardTimeTextStyle: {
    flexShrink: 1,
    flexWrap: 'wrap',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 4,
    marginBottom: 16,
  },
  iconContainer: {
    justifyContent: 'center',
  },
});
export default PlannerView;
