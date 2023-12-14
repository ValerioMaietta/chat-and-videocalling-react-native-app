import {View, Text, TextInput, Pressable} from 'react-native';
import React, {useState} from 'react';
import {styles} from '../utils/styles';


const Modal = ({setVisible,socket}) => {
  const closeModal = () => setVisible(false);
  const [groupName, setGroupName] = useState('');

  const handleCreateRoom = () => {
    //invia un messaggio con il nome del gruppo al server
    socket.emit('createRoom', groupName);
    closeModal();
  };

  //è la parte in basso dove bisogna inserire il nome del gruppo che si vuole creare
  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalsubheading}>Enter your Group name</Text>

      <TextInput
        style={styles.modalinput}
        placeholder="Group name"
        onChangeText={value => setGroupName(value)}
      />

      <View style={styles.modalbuttonContainer}>
        {/*i bottoni che triggerano la funzione*/}
        <Pressable style={styles.modalbutton} onPress={handleCreateRoom}>
          <Text style={styles.modaltext}>CREATE</Text>
        </Pressable>

        <Pressable
          style={[styles.modalbutton, {backgroundColor: '#E14D2A'}]}
          onPress={closeModal}>
          <Text style={styles.modaltext}>CANCEL</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Modal;
