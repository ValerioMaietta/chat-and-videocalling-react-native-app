import CallAnswer from '../asset/CallAnswer';
import {
  Button,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSocket } from '../context/SocketProvider';


const IncomingCallScreen = ({navigation}) => {

  const context = useSocket();
  const {otherUserId,processAccept} = context;

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-around',
          backgroundColor: '#050A0E',
        }}>
        <View
          style={{
            padding: 35,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 14,
          }}>
          <Text
            style={{
              fontSize: 36,
              marginTop: 12,
              color: '#ffff',
            }}>
            {otherUserId.current} is calling..
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              processAccept();
              navigation.navigate('WebrtcRoomScreen');
            }}
            style={{
              backgroundColor: 'green',
              borderRadius: 30,
              height: 60,
              aspectRatio: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CallAnswer height={28} fill={'#fff'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

export default IncomingCallScreen