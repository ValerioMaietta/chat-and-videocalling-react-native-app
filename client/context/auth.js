//scopo di questo file è quello di introdurre le "context API", che possono essere usate per avere uno stato globale
//in cui si tenga traccia se l'utente è loggato oppure no. Questo approccio è utile se voglio condividere i dati
//in molte parti dell'applicazione (nel nostro caso, ci servono per i vari componenti che compongono l'applicazione)

import React, {useState, useEffect, createContext} from "react";
import AsyncStorage  from "@react-native-async-storage/async-storage";

const AuthContext = createContext();  //contesto di autenticazione

const AuthProvider = ({children}) => { //children rappresenta un componente che verra avvolto dall'AuthProvider

    const [state, setState] = useState({

        user:null,
        token:"",
        userId: null,
    });


    useEffect(()=>{

        const loadFromAsyncStorage =async () => {

            let data = await AsyncStorage.getItem("auth-rn"); //recupero i dati di autenticazione sotto la chiave "auth-rn"
            if(data){
                const parsed = JSON.parse(data); //converto l'oggetto JSON in formato javascript
                setState({...state, user:parsed.user, token: parsed.token, userId: parsed.userId});
            }

        };
        loadFromAsyncStorage();
    }, []);

    return(

        //passo lo stato corrente ai componenti figli, quindi tutti quelli avvolti, in App.js, dall'auth-provider

        <AuthContext.Provider value={[state,setState]}>
            {children}
        </AuthContext.Provider>
    );
};


export {AuthContext, AuthProvider};

