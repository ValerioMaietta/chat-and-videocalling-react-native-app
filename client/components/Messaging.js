import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, TextInput, Text, FlatList, Pressable, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSocket} from '../context/SocketProvider';
import MessageComponent from './MessageComponent';
import {styles} from '../utils/styles';

const Messaging = ({route, navigation}) => {
  const context = useSocket();
  const {socket, processCall, otherUserId, userId, callerId} = context;

  const [chatMessages, setChatMessages] = useState([]); //chat completa
  const [message, setMessage] = useState(''); //singolo messaggio
  const [user, setUser] = useState('');

  //prende i parametri i e name
  const {name, id} = route.params;


  
  const getUsername = async () => {
    try {
      const value = await AsyncStorage.getItem('auth-rn');
      if (value !== null) {
        setUser(value);
        const parsed = JSON.parse(value);
      }
    } catch (e) {
      console.error('Error while loading username:', e);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({title: name});
    getUsername();
    socket.emit('findRoom', id);

    const onRoomFound = roomChats => {
      setChatMessages(roomChats);
    };

    socket.on('foundRoom', onRoomFound);

    // Funzione di pulizia
    return () => {
      socket.off('foundRoom', onRoomFound);
    };
  }, []);

  useEffect(() => {
    const onRoomFound = roomChats => {
      setChatMessages(roomChats);
      try {
        const myUserId = callerId; // Assicurati che 'user' sia un JSON valido

        roomChats.forEach(chat => {
          try {
            const userDetails = JSON.parse(chat.user);
            if (userDetails.userId && userDetails.userId !== myUserId) {
              // setOtherUserId(userDetails.userId); // Imposta questo ID nello stato se necessario
              otherUserId.current = userDetails.userId;
            }
          } catch (e) {
            console.error('Errore nel parsing dei dettagli utente:', e);
          }
        });
      } catch (e) {
        console.error('Errore nel parsing del mio utente:', e);
      }
    };

    socket.on('foundRoom', onRoomFound);

    
    return () => {
      socket.off('foundRoom', onRoomFound);
    };
  }, [socket, user]);

  /* 
      Calcola l'orario in cui vedere l'ora ed i minuti
     */
  const handleNewMessage = () => {
    const hour =
      new Date().getHours() < 10
        ? `0${new Date().getHours()}`
        : `${new Date().getHours()}`;

    const mins =
      new Date().getMinutes() < 10
        ? `0${new Date().getMinutes()}`
        : `${new Date().getMinutes()}`;

    socket.emit('newMessage', {
      message,
      room_id: id,
      user,
      timestamp: {hour, mins},
    });
  
  };

  return (
    <View style={styles.messagingscreen}>
      <View
        style={[
          styles.messagingscreen,
          {paddingVertical: 15, paddingHorizontal: 10},
        ]}>
        {chatMessages[0] ? (
          <FlatList //componente di react
            data={chatMessages}
            renderItem={({item}) => (
              <MessageComponent item={item} user={user} />
            )}
            keyExtractor={item => item.id}
          />
        ) : null}
      </View>

      <View style={styles.messaginginputContainer}>
        <Pressable
          style={styles.videochatButtonContainer}
          onPress={() => {
            navigation.navigate('OutgoingCallScreen');
            processCall();
          }}>
          <Image source={require('../images/videocamera.png')} size={30} />
        </Pressable>
        <TextInput
          placeholder="Write your message here!"
          style={styles.messaginginput}
          onChangeText={value => setMessage(value)}
        />
        <Pressable
          style={styles.messagingbuttonContainer}
          onPress={handleNewMessage}>
          <View>
            <Text style={{color: '#f2f0f1', fontSize: 20}}>SEND</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default Messaging;
