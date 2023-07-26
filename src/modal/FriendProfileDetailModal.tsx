import React, {useState} from 'react';
import {
  Alert,
  Text,
  Pressable,
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal/dist/modal';
import Icon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../../App';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

interface ProfileModalProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  email: string;
  name: string;
  statusMessage: string;
}

const BrightColor = '#fff6db';

const FriendProfileModal: React.FC<ProfileModalProps> = ({
  isModalVisible,
  toggleModal,
  email,
  name,
  statusMessage,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Modal
      isVisible={isModalVisible}
      style={{margin: 0}}
      backdropOpacity={0.5}
      onBackdropPress={toggleModal}>
      <View style={styles.defaultViewStyle}>
        <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 16}}>
          프로필
        </Text>
        <View
          style={{
            flex: 1, // This allows the view to take up all available space after the image
            width: '100%', // Ensures the View takes up the full width of the parent View
          }}>
          <Text
            style={{
              fontSize: 24,
              ...styles.statusMessageStyle,
            }}>
            {name}
          </Text>

          <View
            style={{
              flex: 1,
              backgroundColor: BrightColor,
            }}>
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  ...styles.statusMessageStyle,
                }}>
                {statusMessage}
              </Text>
            </ScrollView>
          </View>
        </View>
        <Pressable
          onPress={async () => {
            const userEmail = await EncryptedStorage.getItem('chatUserEmail');
            const friendEmail = email;
            const response = await axios.post(
              'http://43.201.116.97:3000/small-chat/startchatting',
              {
                userEmail,
                friendEmail,
              },
            );
            console.log(response.data);

            toggleModal();
            navigation.navigate('ChattingScreen');
          }}>
          <Text style={styles.chatBtnStyle}>채팅하기</Text>
        </Pressable>

        <View style={styles.bottomViewStyle}>
          <Pressable style={{marginTop: 15}} onPress={toggleModal}>
            <Icon
              name="close-circle-outline"
              size={40}
              style={{margin: 32, justifyContent: 'center'}}></Icon>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  defaultViewStyle: {
    width: '80%',
    height: '70%',
    backgroundColor: BrightColor,
    padding: 20,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 2,
  },

  imageStyle: {
    borderRadius: 24, // 둥근 모양을 위한 값, 값은 조절 가능
    width: Dimensions.get('window').width * 0.4, // 이미지 너비, 값은 조절 가능
    height: Dimensions.get('window').width * 0.4, // 이미지 높이, 값은 조절 가능
    resizeMode: 'cover', // 이미지가 너비와 높이에 맞게 조절되도록
    overflow: 'hidden', // 이미지가 부모 컨테이너를 벗어나지 않도록
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomViewStyle: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  closeBtnStyle: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: 'black',
    paddingHorizontal: 24,
    paddingVertical: 12,
    textAlign: 'center',
    color: 'black',
  },
  chatBtnStyle: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: 'black',
    paddingHorizontal: 24,
    paddingVertical: 12,
    textAlign: 'center',
    color: 'black',
  },
  statusMessageStyle: {
    textAlign: 'center',
    marginTop: 24,
    //fontSize: 18,
    fontWeight: 'bold',
  },
});
export default FriendProfileModal;
