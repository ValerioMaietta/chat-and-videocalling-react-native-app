import React, {useEffect, useState, useRef, useContext} from 'react';
//import AsyncStorage from '@react-native-community/async-storage';
import styles from '../style';
import {
  Alert,
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
  Pressable,
} from 'react-native';
import axios from 'axios';
import {AuthContext} from '../context/auth';

const SignUp = ({navigation}) => {
  const [state, setState] = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (username.trim() && email.trim() && password.trim()) {
      const resp = await axios.post(
        'http://<insert_here_your_ip_address>:3500/api/signup',
        {
          username,
          email,
          password,
        },
      );
      console.log(resp.data);
      Alert.alert('Sign Up successful');
      navigation.navigate('SignIn');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <Text style={styles.logoText}>Register</Text>
            <TextInput
              placeholder="Username"
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
              onChangeText={username => setUsername(username)}
            />
            <TextInput
              placeholder="Email"
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
              onChangeText={email => setEmail(email)}
            />
            <TextInput
              placeholder="Password"
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
              onChangeText={password => setPassword(password)}
              secureTextEntry={true}
            />
            <Pressable style={styles.loginButton1} onPress={handleRegister}>
              <Text style={{color: '#f2f0f1', fontSize: 20, marginTop: 8}}>
                SignUp
              </Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
