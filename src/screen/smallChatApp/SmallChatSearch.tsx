import {useCallback, useState} from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const PrimaryColor = '#fff6db';

function SmallChatMore() {
  const [searchEmail, setSearchEmail] = useState('');
  const onChangeSearchEmail = useCallback((text: string) => {
    setSearchEmail(text.trim());
  }, []);
  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      <View style={styles.topSearchPartStyle}>
        <TextInput
          style={styles.TextInputStyle}
          value={searchEmail}
          onChangeText={onChangeSearchEmail}
          placeholder="이메일 검색"
          placeholderTextColor={'gray'}></TextInput>
      </View>
      <Text>asdg</Text>
      <Pressable>
        <Text>스택 테스트</Text>
      </Pressable>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeAreaStyle: {
    backgroundColor: PrimaryColor,
    flex: 1,
    alignItems: 'center',
  },
  topSearchPartStyle: {
    flexDirection: 'row',
  },
  TextInputStyle: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: Dimensions.get('window').width * 0.7,
  },
});
export default SmallChatMore;
