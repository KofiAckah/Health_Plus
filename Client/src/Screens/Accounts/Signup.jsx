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
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { Logo, CompanyName } from "../../Components/Default";

const Signup = () => {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-secondary-600">
      <View className="bg-white rounded-b-[70px] pt-7 pb-20">
        <View className="flex flex-row w-full justify-center items-center mb-14">
          <Image source={Logo} className="w-20 h-20" />
          <Text className="text-3xl ml-5 font-semibold">{CompanyName}</Text>
        </View>
        <View className="mx-5">
          <Text className="text-2xl font-bold uppercase mb-4">Sign Up</Text>
          <View className="mt-2">
            <Text className="text-gray-600 text-lg font-semibold">Name</Text>
            <View className="flex flex-row items-center border-b border-secondary-600 py-2">
              <FontAwesomeIcon icon={faUser} size={20} color="#F06A37" />
              <TextInput
                placeholder="Enter your name"
                className="flex-1 ml-2"
              />
            </View>
          </View>
          <View className="mt-5">
            <Text className="text-gray-600 text-lg font-semibold">Email</Text>
            <View className="flex flex-row items-center border-b border-secondary-600 py-2">
              <FontAwesomeIcon icon={faEnvelope} size={20} color="#F06A37" />
              <TextInput
                placeholder="Enter your email"
                keyboardType="email-address"
                className="flex-1 ml-2"
              />
            </View>
          </View>
          <View className="mt-5">
            <Text className="text-gray-600 text-lg font-semibold">
              Password
            </Text>
            <View className="flex flex-row items-center border-b border-secondary-600 py-2">
              <FontAwesomeIcon icon={faLock} size={20} color="#F06A37" />
              <TextInput
                placeholder="Enter your password"
                secureTextEntry
                className="flex-1 ml-2"
              />
            </View>
          </View>
          <View className="mt-5">
            <Text className="text-gray-600 text-lg font-semibold">
              Confirm Password
            </Text>
            <View className="flex flex-row items-center border-b border-secondary-600 py-2">
              <FontAwesomeIcon icon={faLock} size={20} color="#F06A37" />
              <TextInput
                placeholder="Confirm your password"
                secureTextEntry
                className="flex-1 ml-2"
              />
            </View>
          </View>
        </View>
      </View>
      <View className="flex justify-center items-center mb-10">
        <TouchableOpacity
          className="bg-white p-3 rounded-xl mt-14 mb-7 mx-auto w-[80%]"
          onPress={() => navigation.navigate("Home")}
        >
          <Text className="text-secondary-600 text-center text-lg font-semibold">
            Sign Up
          </Text>
        </TouchableOpacity>
        <Text className="text-primary-400">Already have an account? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="ml-1"
        >
          <Text className="text-white font-semibold">Login</Text>
        </TouchableOpacity>
      </View>
      <StatusBar barStyle="light-content" backgroundColor={"#F06A37"} />
    </ScrollView>
  );
};

export default Signup;
