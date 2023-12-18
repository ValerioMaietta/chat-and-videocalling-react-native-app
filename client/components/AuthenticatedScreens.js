import React, {useContext} from 'react';
import {SocketProvider} from '../context/SocketProvider';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Chat from './Chat';
import OutgoingCallScreen from './OutgoingCallScreen';
import IncomingCallScreen from './IncomingCallScreen';
import WebrtcRoomScreen from './WebrtcRoomScreen';
import {useNavigation} from '@react-navigation/native';
import Messaging from './Messaging';
import {AuthContext} from '../context/auth';

const Stack = createNativeStackNavigator();

const AuthenticatedScreens = () => {
  const [state] = useContext(AuthContext);
  const userId = state.userId;

  const navigation = useNavigation();

  const handleNewCall = () => {
    navigation.navigate('WebrtcRoomScreen');
  };

  const handleEndCall = () => {
    navigation.navigate('Chat');
  };

  const handleIncomingCall = () => {
    navigation.navigate('IncomingCallScreen');
  };

  return (
    <SocketProvider
      userId={userId}
      onNewCall={handleNewCall}
      onEndCall={handleEndCall}
      onIncomingCall={handleIncomingCall}>
      <Stack.Navigator 
      initialRouteName="Chat"
      screenOptions={{headerShown:false}}
      >
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Messaging" component={Messaging} />
        <Stack.Screen
          name="OutgoingCallScreen"
          component={OutgoingCallScreen}
        />
        <Stack.Screen
          name="IncomingCallScreen"
          component={IncomingCallScreen}
        />
        <Stack.Screen name="WebrtcRoomScreen" component={WebrtcRoomScreen} />
      </Stack.Navigator>
    </SocketProvider>
  );
};

export default AuthenticatedScreens;
