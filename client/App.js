import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from './context/auth';
import NavigationScreen from './components/NavigationScreen';

export default function App({}) {

  
  return (
    <NavigationContainer>
      <AuthProvider>
        <NavigationScreen />
      </AuthProvider>
    </NavigationContainer>
);

}
