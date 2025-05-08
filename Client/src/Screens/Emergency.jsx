import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Emergency = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Emergency</Text>
      <Text>Another line</Text>
      <TouchableOpacity
        className="bg-red-500 p-2 rounded-full mt-5 mx-5"
        onPress={() => navigation.navigate("Login")}
      >
        <Text className="text-white text-center">Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Emergency;

const styles = StyleSheet.create({});
