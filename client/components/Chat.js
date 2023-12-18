import React, {
  useState,
  useLayoutEffect,
  useEffect,
  useContext,
  useRef,
} from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import ChatComponent from './ChatComponent';
import {styles} from '../utils/styles';
import Modal from './Modal';
import {AuthContext} from '../context/auth';
import {useSocket} from '../context/SocketProvider';

const Chat = ({navigation}) => {
  const context = useSocket();

  const {callerId, processCall, otherUserId, socket} = context;
  const [state, setState] = useContext(AuthContext);

  const signOut = async () => {
    setState({token: '', user: null}); //setto il contesto alle impostazioni di default
    await AsyncStorage.removeItem('auth-rn');
    navigation.navigate('SignIn');
  };

  const [visible, setVisible] = useState(false); //per rendere visibile o meno il Modal
  const [rooms, setRooms] = useState([]); //ci sono le parentesi quadre perchè è un array

  useLayoutEffect(() => {
    function fetchGroups() {
      fetch('http://<put_your_IP_address_here>:3500/apiChat')
        .then(res => res.json())
        .then(data => setRooms(data))
        .catch(err => console.error(err));
    }
    fetchGroups();
  }, []);

  //restituisce le chat
  useEffect(() => {
    socket.on('roomsList', chatRooms => {
      setRooms(chatRooms);
    });

    return () => {
      socket.off('roomsList');
    };
  }, [socket]);

  //schermata dove ci sono tutte le chat
  return (
    <SafeAreaView style={styles.chatscreen}>
      <View style={styles.chattopContainer}>
        <View style={styles.chatheader}>
          <Text style={styles.chatheading}>Chats</Text>

          {/* mostra il componente modal quando cliccato (simbolo in alto a destra) */}
          <TouchableOpacity onPress={signOut}>
            <Image
              source={require('../images/logout.png')}
              size={30}
              style={styles.cavatar}
            />
          </TouchableOpacity>
          <View>
            <Pressable onPress={() => setVisible(true)}>
              <Image
                source={require('../images/write.png')}
                size={30}
                style={styles.cavatar}
              />
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.chatlistContainer}>
        {rooms.length > 0 ? (
          <FlatList
            data={rooms}
            renderItem={({item}) => <ChatComponent item={item} />}
            keyExtractor={item => item.id}
          />
        ) : (
          <View style={styles.chatemptyContainer}>
            <Text style={styles.chatemptyText}>No rooms created!</Text>
            <Text>Click the icon above to create a Chat room</Text>
          </View>
        )}
      </View>
      {visible ? <Modal setVisible={setVisible} socket={socket} /> : null}
    </SafeAreaView>
  );
};

export default Chat;
