import {View, Text, Pressable, Image} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {styles} from '../utils/styles';

const ChatComponent = ({item}) => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState({}); //il messagio che si vede quando stai nella schermata chat

  //mostra l'ultimo messaggio di quella chat
  useLayoutEffect(() => {
    setMessages(item.messages[item.messages.length - 1]);
  }, []);

  const handleNavigation = () => {
    navigation.navigate('Messaging', {
      id: item.id,
      name: item.roomName, //name del gruppo
    });
  };

  return (
    <Pressable style={styles.cchat} onPress={handleNavigation}>
      <Image
        source={require('../images/user.png')}
        size={30}
        style={styles.cavatar}
      />

      <View style={styles.crightContainer}>
        <View>
          <Text style={styles.cusername}>{item.roomName}</Text>

          <Text style={styles.cmessage}>
            {messages?.text ? messages.text : 'Tap to start chatting'}
          </Text>
        </View>
        <View>
          <Text style={styles.ctime}>
            {messages?.time ? messages.time : 'now'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ChatComponent;
