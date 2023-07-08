import {StackScreenProps} from '@react-navigation/stack';
import {useCallback, useRef, useState} from 'react';
import {
  Dimensions,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {RootStackParamList} from '../../../App';

export type AddPlanScreenProps = StackScreenProps<
  RootStackParamList,
  'UpdatePlan'
>;

const PrimaryColor = '#879dd9';
function UpdatePlan({navigation, route}: any) {
  const selectDate = route.params.selectDate;
  const id = route.params.id;
  const description = route.params.description;
  const oldStartTime = route.params.startTime;
  const oldEndTime = route.params.endTime;

  console.log(selectDate);
  console.log(description);
  console.log(id);
  console.log(oldStartTime);
  console.log(oldEndTime);

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [content, setContent] = useState('');

  const endTimeRef = useRef<TextInput | null>(null);
  const contentRef = useRef<TextInput | null>(null);

  const onChangeStartTime = useCallback((text: string) => {
    setStartTime(text ? parseInt(text) : 0);
  }, []);
  const onChangeEndTime = useCallback((text: string) => {
    setEndTime(text ? parseInt(text) : 0);
  }, []);
  const onChangeContent = useCallback((text: string) => {
    setContent(text);
  }, []);
  const onSubmit = useCallback(() => {
    console.log(id);
  }, [startTime, endTime, content]);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.safeAreaStyle}>
        <Text style={styles.dateTextStyle}>날짜 : {selectDate}</Text>
        <Text style={styles.dateTextStyle}>기존 내용 : </Text>
        <View style={styles.setTimeRowStyle}>
          <View style={styles.setTimeStyle}>
            <Text style={styles.defaultTextStyle}>시작 시간</Text>
            <TextInput
              style={styles.timeTextInputStyle}
              onChangeText={onChangeStartTime}
              keyboardType="number-pad"
              value={startTime.toString()}
              clearButtonMode="while-editing"
              onSubmitEditing={() => {
                endTimeRef.current?.focus();
              }}></TextInput>
          </View>

          <View style={styles.setTimeStyle}>
            <Text style={styles.defaultTextStyle}>끝 시간</Text>
            <TextInput
              style={styles.timeTextInputStyle}
              onChangeText={onChangeEndTime}
              value={endTime.toString()}
              clearButtonMode="while-editing"
              onSubmitEditing={() => {
                contentRef.current?.focus();
              }}
              keyboardType="number-pad"></TextInput>
          </View>
        </View>
        <View>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.defaultTextStyle}>일정</Text>
            <TextInput
              style={styles.contentTextInputStyle}
              placeholder="일정을 입력하세요"
              placeholderTextColor={PrimaryColor}
              onChangeText={onChangeContent}
              clearButtonMode="while-editing"
              multiline={true} // 여러 줄 입력 허용
              scrollEnabled={true} // 스크롤 활성화
              onSubmitEditing={onSubmit}
              value={content}></TextInput>
          </View>
        </View>
        <View>
          <Pressable style={styles.addBtnStyle} onPress={onSubmit}>
            <Text style={styles.addBtnTextStyle}>저장</Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeAreaStyle: {
    backgroundColor: PrimaryColor,
    flex: 1,

    //marginBottom: 16,
  },
  dateTextStyle: {
    borderWidth: 1.2,
    borderColor: 'white',
    padding: 32,
    margin: 8,
    marginBottom: 32,
    marginTop: 32,
    borderRadius: 8,
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  setTimeRowStyle: {
    marginBottom: 24,
    flexDirection: 'row',
  },
  defaultTextStyle: {
    marginLeft: 10,
    color: 'white',
    fontSize: 18,
    marginHorizontal: 8,
    textAlign: 'left',
    marginBottom: 8,
  },
  setTimeStyle: {
    flexDirection: 'column',
  },
  timeTextInputStyle: {
    marginHorizontal: 8,

    fontSize: 18,
    backgroundColor: 'white',
    width: Dimensions.get('window').width * 0.3,
    borderRadius: 12,
    padding: 8,
  },
  contentTextInputStyle: {
    height: Dimensions.get('window').height * 0.3,
    width: Dimensions.get('window').width - 16,
    borderColor: 'white',
    borderWidth: 1.2,
    borderRadius: 8,
    marginHorizontal: 8,
    fontSize: 20,
    padding: 8,
    color: 'white',
  },

  addBtnStyle: {
    alignItems: 'center',
    //backgroundColor: 'purple',
  },
  addBtnTextStyle: {
    marginTop: 12,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 12,
    //margin: 12,
    padding: 12,
    fontWeight: 'bold',
    //marginBottom: 32,
  },
});
export default UpdatePlan;
