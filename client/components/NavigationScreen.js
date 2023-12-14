//aggiungiamo il concetto di authentication; vediamo se abbiamo il token di autenticazione
import React, {useContext} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './signUp';
import SignIn from './signIn';
import { AuthContext } from '../context/auth';
import AuthenticatedScreens from './AuthenticatedScreens';

const Stack = createNativeStackNavigator ();

const NavigationScreen = () => {

    const [state, setState] = useContext(AuthContext);
    const isAuthenticated = state && state.token !== "" && state.user !==null;

    return(
        <Stack.Navigator>
            {isAuthenticated ? 
            (
                <Stack.Screen name='AuthenticatedScreens' component={AuthenticatedScreens} />
            ):(
                <>
                    <Stack.Screen name="SignIn" component={SignIn} />
                    <Stack.Screen name="SignUp" component={SignUp} />
            </>
            )}
        </Stack.Navigator>
      )
}

export default NavigationScreen