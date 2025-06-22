import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackendLink } from "../Components/Default";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGear, faUser } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${BackendLink}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#11D6CD" />
      </SafeAreaView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {userData ? (
        <View>
          <View className="flex justify-between items-center bg-secondary-100 relative h-36 mb-20">
            <View className="flex-row items-center justify-between p-5 w-full">
              <Text className="text-xl font-semibold text-white">Profile</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <FontAwesomeIcon icon={faGear} size={24} color="#f5f5f5" />
              </TouchableOpacity>
            </View>
            <View className="absolute top-20 rounded-full border-2 border-white overflow-hidden mx-auto w-32 h-32 bg-secondary-100">
              {userData.profilePicture ? (
                <Image
                  source={{ uri: userData.profilePicture }}
                  className="w-32 h-32"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUser}
                  size={85}
                  color="#f5f5f5"
                  style={{ marginHorizontal: "auto", marginVertical: 10 }}
                />
              )}
            </View>
          </View>
          <View className="flex px-10">
            <View className="flex items-center justify-center">
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                Hi, {userData.name}!
              </Text>
              <Text style={{ marginTop: 10 }}>Email: {userData.email}</Text>
              <Text style={{ marginTop: 10 }}>
                Phone: {userData.phone ? userData.phone : "No Number Provided"}
              </Text>
              <Text style={{ marginTop: 10 }}>
                Bio: {userData.bio ? userData.bio : "No bio provided"}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScrollView>
  );
};

export default Profile;
