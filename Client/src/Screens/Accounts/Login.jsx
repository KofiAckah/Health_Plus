import React from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { Logo, CompanyName } from "../../Components/Default";

const Login = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white">
      <View className="flex w-full justify-center items-center my-7">
        <Image source={Logo} className="w-32 h-28" />
        <Text className="text-3xl mt-5 font-semibold">{CompanyName}</Text>
      </View>
      <View className="flex-1 justify-center items-center bg-secondary-500 w-full rounded-tl-[110px]">
        <View className="w-full px-5">
          <Text className="text-2xl font-semibold text-primary-500 mb-5 text-center">
            Login
          </Text>
          <View className="flex flex-row items-center bg-white rounded-lg mb-4 px-3 py-2">
            <FontAwesomeIcon icon={faUser} size={20} color="#f26a8d" />
            <TextInput
              placeholder="Username"
              className="flex-1 ml-3 text-base text-gray-700"
            />
          </View>
          <View className="flex flex-row items-center bg-white rounded-lg mb-4 px-3 py-2">
            <FontAwesomeIcon icon={faLock} size={20} color="#f26a8d" />
            <TextInput
              placeholder="Password"
              secureTextEntry={true}
              className="flex-1 ml-3 text-base text-gray-700"
            />
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            className="bg-primary-500 rounded-lg py-3 mb-4"
          >
            <Text className="text-center text-white text-lg font-semibold">
              Login
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex flex-row justify-center items-center mt-5">
          <Text className="text-white text-base">Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            className="ml-2"
          >
            <Text className="text-primary-500 text-base font-semibold">
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <StatusBar barStyle="light-content" backgroundColor={"#f26a8d"} /> */}
    </View>
  );
};

export default Login;
