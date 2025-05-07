import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { Logo, CompanyName } from "../../Components/Default";

const Login = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center items-center bg-primary-800 p-5">
      <StatusBar barStyle="light-content" backgroundColor={"#f26a8d"} />
    </View>
  );
};

export default Login;
