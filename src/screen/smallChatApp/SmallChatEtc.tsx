import {NavigationProp} from '@react-navigation/native';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../../App';
import {useCallback} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';

const PrimaryColor = '#fff6db';

function SmallChatEtc({navigation}: {navigation: any}) {
  const logout = useCallback(async () => {
    await EncryptedStorage.setItem('tryChatAutoLogin', 'false');
    for (let i = 0; i < 2; i++) {
      navigation.goBack();
    }
  }, []);
  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      <View style={styles.defaultViewStyle}>
        <Pressable onPress={logout}>
          <Text style={styles.defaultTextStyle}>로그아웃</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeAreaStyle: {
    backgroundColor: PrimaryColor,
    flex: 1,
  },
  defaultViewStyle: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginHorizontal: 18,
    shadowColor: '#000',
    backgroundColor: PrimaryColor,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.5,
    elevation: 2.5,
  },
  defaultTextStyle: {
    color: 'black',
    fontWeight: 'bold',
  },
});
export default SmallChatEtc;
