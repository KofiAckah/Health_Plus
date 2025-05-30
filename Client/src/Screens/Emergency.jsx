import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { BackendLink } from "../Components/Default";

const Emergency = () => {
  const navigation = useNavigation();

  const [emergencyData, setEmergencyData] = useState(null);
  useEffect(() => {
    const fetchEmergencyData = async () => {
      try {
        const response = await axios.get(`${BackendLink}/issue/`);
        setEmergencyData(response.data);
      } catch (error) {
        console.error("Error fetching emergency data:", error);
      }
    };

    fetchEmergencyData();
  }, []);

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
      <TouchableOpacity
        className="bg-red-500 p-2 rounded-full mt-5 mx-5"
        onPress={() => navigation.navigate("Signup")}
      >
        <Text className="text-white text-center">Signup</Text>
      </TouchableOpacity>
      {emergencyData &&
        emergencyData.map((issue) => (
          <View key={issue._id} className="p-4 border-b border-gray-200">
            <Text className="text-lg font-bold">{issue.title}</Text>
            <Text className="text-gray-600">{issue.description}</Text>
          </View>
        ))}
    </View>
  );
};

export default Emergency;

const styles = StyleSheet.create({});
