import {View, Text, Image} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {styles} from '../utils/styles';

export default function MessageComponent({item, user}) {
  const status = item.user !== user;

  return (
    <View>
      <View
        style={
          status
            ? styles.mmessageWrapper //se il messaggio l'ho inviato io, me lo mette a destra
            : [styles.mmessageWrapper, {alignItems: 'flex-end'}] //altrimenti a sinistra insieme ai messaggi inviati dagli altri utenti
        }>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('../images/user.png')}
            size={30}
            style={styles.cavatar}
          />
          <View
            style={
              status
                ? styles.mmessage //i messaggi hanno un colore diverso in base a se li invio io o gli altri utenti
                : [styles.mmessage, {backgroundColor: 'rgb(171,	205, 239)'}]
            }>
            <Text>{item.text}</Text>
          </View>
        </View>
        <Text style={{marginLeft: 40}}>{item.time}</Text>
      </View>
    </View>
  );
}
