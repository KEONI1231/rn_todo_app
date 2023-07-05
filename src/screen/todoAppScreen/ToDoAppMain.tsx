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
import Icon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../../../App';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const PrimaryColor = '#879dd9';
function PlanCard(props: any) {
  const {selectDate, setSelectDate, planData, setPlanData} = props;

  if (planData != null) console.log(planData[1]);
  return planData != 'no plan data' ? (
    <FlatList
      data={planData}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <View style={styles.planCardStyle}>
          <View style={styles.cardPositionStyle}>
            <View style={styles.checkboxAndTextContainer}>
              <BouncyCheckbox
                style={
                  {
                    //alignSelf: 'flex-end'
                  }
                }
                size={20}
                fillColor="indigo"
                unfillColor="#FFFFFF"
                hitSlop={{top: 5, bottom: 5, left: 0, right: 0}}
                iconStyle={{borderColor: 'red'}}
                onPress={(isChecked: boolean) => {}}></BouncyCheckbox>
              <Text style={styles.planCardContentTextStyle}>
                {item.description}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Pressable>
                <Icon name="close-circle-outline" color="white" size={22}>
                  {' '}
                </Icon>
              </Pressable>
            </View>
          </View>
        </View>
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
      const userEmail = await EncryptedStorage.getItem('userEmail');
      const response = await axios.get(
        'http://43.201.116.97:3000/todoApp/getPlanDate',
        {
          params: {
            userEmail: userEmail,
          },
        },
      );
      let data = Object.values(response.data) as {selectDate: string}[]; // response.data는 서버에서 받은 데이터입니다.

      // markedDates 객체를 생성합니다.
      let newMarkedDates: {[date: string]: {marked: boolean}} = {};
      data.forEach(item => {
        console.log(data);
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

        const planDataResponse = await axios.get(
          'http://43.201.116.97:3000/todoApp/getPlan',
          {
            params: {
              selectDate: day.dateString,
              userEmail,
            },
          },
        );
        let data = planDataResponse.data; // response.data는 서버에서 받은 데이터입니다.
        let dataArray = Object.values(data);
        if (data === 'no plan data') {
          setPlanData('no plan data');
        } else {
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
    console.log(selectDate);
    if (selectDate != '0000-00-00') {
      navigation.navigate('AddPlanScreen', {selectDate: selectDate});
    } else {
      Alert.alert('알림', '추가할 날짜를 먼저 선택해주세요!');
    }
  }, [selectDate]);
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
              />

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
  },

  iconContainer: {
    justifyContent: 'center',
  },
});
export default PlannerView;
