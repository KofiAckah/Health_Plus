import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const navigation = useNavigation(); // Hook to access navigation

  return (
    <View>
      <Text>Profile</Text>
      <TouchableOpacity
        className="bg-red-500 p-2 rounded-full mt-5 mx-5"
        onPress={() => navigation.navigate("Login")}
      >
        <Text className="text-white text-center">Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
