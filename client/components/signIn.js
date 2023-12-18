import React, {useEffect, useState, useRef, useContext} from 'react';
//import AsyncStorage from '@react-native-community/async-storage';
import styles from '../style';
import {
  Alert,
  Button,
  ImageBackground,
  Platform,
  SafeAreaView,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../context/auth';
import SignUp from './signUp';

const SignIn = ({navigation}) => {
  const [state, setState] = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (username.trim() && password.trim()) {
      //verifico che username non contenga spazi vuoti.

      console.log(username);
      console.log(password);
      const resp = await axios.post(
        'http://<put_your_IP_address_here>:3500/api/signin',
        {
          username,
          password,
        },
      );
      console.log(resp.data);
      if (resp.data.error) {
        Alert.alert(resp.data.error);
      } else {
        setState(resp.data);
        await AsyncStorage.setItem('auth-rn', JSON.stringify(resp.data));
        console.log(resp.data);
        Alert.alert('Sign In successful');
        navigation.navigate('Chat');
      }
    } else {
      Alert.alert('Username and password required!');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <Text style={styles.logoText}>WEBRTC MOBILE APP</Text>
            <TextInput
              placeholder="Username"
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
              onChangeText={value => setUsername(value)}
            />
            <TextInput
              placeholder="Password"
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
              onChangeText={password => setPassword(password)}
              secureTextEntry={true}
            />
            <Pressable style={styles.loginButton1} onPress={handleSignIn}>
              <View>
                <Text style={{color: '#f2f0f1', fontSize: 20, marginTop: 8}}>
                  Login
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={styles.loginButton1}
              onPress={() => navigation.navigate('SignUp')}>
              <View>
                <Text style={{color: '#f2f0f1', fontSize: 20, marginTop: 8}}>
                  Register
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
