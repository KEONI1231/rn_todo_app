import {NavigationProp} from '@react-navigation/native';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../../App';
import {useEffect} from 'react';
import axios from 'axios';

const BrightColor = '#fff6db';

const testColor = '#edabb7';

function SmallChatMain({
  navigation,
}: {
  navigation: NavigationProp<RootStackParamList>;
}) {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://43.201.116.97:3000/small-chat/get-friends',
        );
        console.log(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  });

  return (
    <SafeAreaView style={styles.safeAreaStyle}>
      <View>
        <Text style={styles.titleTextStyle}>내 프로필</Text>
        <View style={styles.profileCardStyle}>
          <Image
            style={styles.imageStyle}
            source={require('../../images/myprofileimg.jpg')}
          />
          <ProfileCard></ProfileCard>
        </View>
        <Text style={styles.titleTextStyle}>친구 목록</Text>
        <View>
          <Text></Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function ProfileCard() {
  return (
    <Pressable style={{flex: 1, justifyContent: 'center'}}>
      <View style={{marginLeft: 16, justifyContent: 'center'}}>
        <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 4}}>
          김건휘
        </Text>
        <Text
          style={{fontSize: 16, color: 'gray'}}
          numberOfLines={1}
          ellipsizeMode="tail">
          소켓 통신 라이브러리 사용 및 적용을 위한 앱 sdfsdf
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    backgroundColor: BrightColor,
    //alignItems: 'center',
  },
  titleTextStyle: {
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    //textAlign: 'center',
  },
  profileCardStyle: {
    flexDirection: 'row',
    marginHorizontal: 16,

    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 12,
    paddingVertical: 16,
  },
  imageStyle: {
    marginLeft: 12,
    borderRadius: Dimensions.get('window').width * 0.15, // 둥근 모양을 위한 값, 값은 조절 가능
    width: Dimensions.get('window').width * 0.15, // 이미지 너비, 값은 조절 가능
    height: Dimensions.get('window').width * 0.15, // 이미지 높이, 값은 조절 가능
    resizeMode: 'cover', // 이미지가 너비와 높이에 맞게 조절되도록
    overflow: 'hidden', // 이미지가 부모 컨테이너를 벗어나지 않도록
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default SmallChatMain;
