import { TouchableOpacity } from "react-native";
import React,{useContext, View} from "react";
import { AuthContext } from "../../context/auth";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HeaderTabs = () => {

    const [state,setState] = useContext(AuthContext);

    const signOut = async () => {

        setState({token: "", user: null});  //setto il contesto alle impostazioni di default
        await AsyncStorage.removeItem("auth-rn");
    }

    return(

        <View>
            <TouchableOpacity onPress={signOut}>
                <FontAwesome5 name="sign-out-alt" size = {25} color = "darkmagenta" />
            </TouchableOpacity>
        </View>

    );

}

export default HeaderTabs