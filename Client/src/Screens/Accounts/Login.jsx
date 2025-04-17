import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { Logo, CompanyName } from "../../Components/Default";

const Login = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center items-center bg-gray-200 p-5">
      <Text className="text-2xl font-bold text-gray-800 mb-8">
        Welcome to HealthPlus
      </Text>

      {/* Email Input */}
      <View className="w-full h-12 bg-white rounded-lg px-4 mb-4 border border-gray-300 flex-row items-center">
        <FontAwesomeIcon icon={faUser} size={20} color="#aaa" />
        <TextInput
          className="flex-1 ml-2"
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View className="w-full h-12 bg-white rounded-lg px-4 mb-4 border border-gray-300 flex-row items-center">
        <FontAwesomeIcon icon={faLock} size={20} color="#aaa" />
        <TextInput
          className="flex-1 ml-2"
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity className="w-full h-12 bg-green-500 rounded-lg justify-center items-center mt-2">
        <Text className="text-white text-lg font-bold">Login</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => navigation.navigate("ForgetPassword")}>
        <Text className="text-green-500 text-sm font-bold mt-4">
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Signup Navigation */}
      <Text className="text-gray-600 mt-6">
        Don't have an account?{" "}
        <Text
          className="text-green-500 font-bold"
          onPress={() => navigation.navigate("Signup")}
        >
          Sign Up
        </Text>
      </Text>
    </View>
  );
};

export default Login;
