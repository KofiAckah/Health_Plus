import { Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { BackendLink, Logo, CompanyName } from "../Components/Default";
import { LinearGradient } from "expo-linear-gradient";
import { HotlinesData } from "../Components/HotLines";

const Emergency = () => {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 flex-row items-center justify-start m-4 ">
        <Image source={Logo} className="w-12 h-12" />
        <Text className="ml-4 text-xl font-bold">{CompanyName}</Text>
      </View>

      <View className="flex-1 items-center justify-center bg-white p-4">
        {/* <TouchableOpacity
          onPress={() => console.log("Call 911")}
          className="w-full rounded-3xl h-20 overflow-hidden"
        >
          <LinearGradient
            colors={["#ff0000", "#000"]}
            className="w-full h-20 rounded-lg relative "
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View className="flex-1 justify-center ml-8">
              <Text className="text-lg text-white">Call Fire Service</Text>
              <Text className="text-lg font-bold text-white">911</Text>
            </View>
            <Image
              source={require("../../assets/FireLogo.jpg")}
              className="w-24 h-24 mb-2 absolute top-0 right-0 bottom-0 m-auto opacity-40"
            />
          </LinearGradient>
        </TouchableOpacity> */}

        {HotlinesData.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            className="w-full rounded-3xl h-20 overflow-hidden mb-4"
          >
            <LinearGradient
              colors={[item.color, "#000"]}
              className="w-full h-20 rounded-lg relative"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View className="flex-1 justify-center ml-8">
                <Text className="text-lg text-white">Call {item.name}</Text>
                <Text className="text-lg font-bold text-white">
                  {item.cell}
                </Text>
              </View>
              <Image
                source={item.image}
                className="w-24 h-24 mb-2 absolute top-0 right-0 bottom-0 m-auto opacity-40"
              />
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default Emergency;
