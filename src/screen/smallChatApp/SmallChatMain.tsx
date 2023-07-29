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
import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import ProfileModal from '../../modal/MyProfileDetailModal';
import FriendProfileModal from '../../modal/FriendProfileDetailModal';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import {fetchFriends} from '../../redux/Friend/getFriendsSlice';

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
          {
            // 내 프로필 카드
          }
          <ProfileCard></ProfileCard>
        </View>
        <Text style={styles.titleTextStyle}>친구 목록</Text>

        {
          //친구 프로필 카드
        }
        <FriendProfileCard></FriendProfileCard>
      </View>
    </SafeAreaView>
  );
}

function FriendProfileCard() {
  const dispatch: AppDispatch = useDispatch();
  const friendsList = useSelector(
    (state: RootState) => state.friends.friendsList,
  );
  const friendsStatus = useSelector((state: RootState) => state.friends.status);
  useEffect(() => {
    if (friendsStatus === 'idle') {
      dispatch(fetchFriends());
    }
  }, [friendsStatus, dispatch]);
  //console.log(friendsStatus);

  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const [currentItem, setCurrentItem] = useState({
    f_email: '',
    f_name: '',
    f_statusMessage: '',
  });
  return friendsStatus === 'succeeded' ? (
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
            email={currentItem.f_email}
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
  const user = useSelector((state: RootState) => state.user);

  console.log('리덕스 데이터', user);
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
            {user.name}
          </Text>
          <Text
            style={{fontSize: 16, color: 'gray'}}
            numberOfLines={1}
            ellipsizeMode="tail">
            {user.statusMessage}
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
