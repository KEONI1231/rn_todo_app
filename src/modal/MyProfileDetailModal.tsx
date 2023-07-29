import React, {useCallback, useState} from 'react';
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
import EncryptedStorage from 'react-native-encrypted-storage';
import Modal from 'react-native-modal/dist/modal';

interface ProfileModalProps {
  isModalVisible: boolean;
  toggleModal: () => void;
}

const BrightColor = '#fff6db';

const ProfileModal: React.FC<ProfileModalProps> = ({
  isModalVisible,
  toggleModal,
}) => {
  const [myName, setMyName] = useState('');
  const getName = useCallback(async () => {
    const name = await EncryptedStorage.getItem('chatUserName');
    setMyName(name!.toString());
  }, []);
  getName();
  console.log('내 프로필 모달 렌더링');
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
        <View>
          <Image
            style={styles.imageStyle}
            source={require('../images/myprofileimg.jpg')}
          />
        </View>
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
            {myName}
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
                소켓 통신 라이브러리 사용 및 적용을 위한 앱 대충 만들어보기
              </Text>
            </ScrollView>
          </View>
        </View>

        <View style={styles.bottomViewStyle}>
          <Pressable style={{marginTop: 15}} onPress={toggleModal}>
            <Text style={styles.closeBtnStyle}>닫기</Text>
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
  statusMessageStyle: {
    textAlign: 'center',
    marginTop: 24,
    //fontSize: 18,
    fontWeight: 'bold',
  },
});
export default ProfileModal;
