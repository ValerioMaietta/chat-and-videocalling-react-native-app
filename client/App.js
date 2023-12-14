import React, {useEffect, useState, useRef, useContext} from 'react';
//import AsyncStorage from '@react-native-community/async-storage';


import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider,AuthContext } from './context/auth';
import NavigationScreen from './components/NavigationScreen';

const Stack = createNativeStackNavigator();

export default function App({}) {

  
  return (
    <NavigationContainer>
      <AuthProvider>
        <NavigationScreen />
      </AuthProvider>
    </NavigationContainer>
);

}
