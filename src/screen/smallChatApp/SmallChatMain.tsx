import {NavigationProp} from '@react-navigation/native';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RootStackParamList} from '../../../App';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Modall from '../../modal/MyProfileDetailModal';
import Modal from 'react-native-modal/dist/modal';
import ProfileModal from '../../modal/MyProfileDetailModal';
import FriendProfileModal from '../../modal/FriendProfileDetailModal';
import EncryptedStorage from 'react-native-encrypted-storage';

const BrightColor = '#fff6db';

function SmallChatMain() {
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

        <FriendProfileCard></FriendProfileCard>
      </View>
    </SafeAreaView>
  );
}

function FriendProfileCard() {
  interface Friend {
    f_name: string;
    f_email: string;
    f_statusMessage: string;
  }
  const [getFriendList, setGetFriendList] = useState(0);
  const [friendsList, setFriendsList] = useState<Friend[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const userEmail = await EncryptedStorage.getItem('chatUserEmail');
      try {
        const response = await axios.get(
          'http://43.201.116.97:3000/small-chat/get-friends',
          {
            params: {
              userEmail,
            },
          },
        );
        if (response.data == '에러발생') {
          console.log(response.data);
          setGetFriendList(1);
        }
        let data = response.data;
        let dataArray: Friend[] = Object.values(data);
        setFriendsList(dataArray);
        console.log(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const [currentItem, setCurrentItem] = useState({
    f_email: '',
    f_name: '',
    f_statusMessage: '',
  });
  return getFriendList != 1 ? (
    <FlatList
      contentContainerStyle={{paddingBottom: 200}}
      data={friendsList}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <View
          style={{
            marginBottom: 16,
            ...styles.profileCardStyle,
          }}>
          <Pressable
            onPress={() => {
              toggleModal();
              setCurrentItem({
                f_email: item.f_email,
                f_name: item.f_name,
                f_statusMessage: item.f_statusMessage,
              });
            }}
            style={{flex: 1, justifyContent: 'center'}}>
            <View style={{marginLeft: 16, justifyContent: 'center'}}>
              <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 4}}>
                {item.f_name}
              </Text>
              <Text
                style={{fontSize: 16, color: 'gray'}}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.f_statusMessage}
              </Text>
            </View>
          </Pressable>
          <FriendProfileModal
            isModalVisible={modalVisible}
            toggleModal={toggleModal}
            name={currentItem.f_name}
            statusMessage={currentItem.f_statusMessage}></FriendProfileModal>
        </View>
      )}></FlatList>
  ) : (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        ...styles.profileCardStyle,
      }}>
      <Text style={{fontSize: 20, marginBottom: 4}}>
        아직은 친구가 없습니다.
      </Text>
    </View>
  );
}
function ProfileCard() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={{flex: 1}}>
      <Pressable
        style={{flex: 1, justifyContent: 'center'}}
        onPress={toggleModal}>
        <View style={{marginLeft: 16, justifyContent: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 4}}>
            김건휘
          </Text>
          <Text
            style={{fontSize: 16, color: 'gray'}}
            numberOfLines={1}
            ellipsizeMode="tail">
            소켓 통신 라이브러리 사용 및 적용을 위한 앱 대충 만들어보기
          </Text>
        </View>
      </Pressable>
      <ProfileModal isModalVisible={isModalVisible} toggleModal={toggleModal} />
    </View>
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
    borderRadius: 24, // 둥근 모양을 위한 값, 값은 조절 가능
    width: Dimensions.get('window').width * 0.15, // 이미지 너비, 값은 조절 가능
    height: Dimensions.get('window').width * 0.15, // 이미지 높이, 값은 조절 가능
    resizeMode: 'cover', // 이미지가 너비와 높이에 맞게 조절되도록
    overflow: 'hidden', // 이미지가 부모 컨테이너를 벗어나지 않도록
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default SmallChatMain;
