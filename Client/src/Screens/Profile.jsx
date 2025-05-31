import { View, Text, TouchableOpacity } from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackendLink } from "../Components/Default";

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

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.get(`${BackendLink}/account/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error logging out from backend:", error);
    }
    await AsyncStorage.removeItem("token");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View>
      <Text>Profile</Text>
      {userData ? (
        <View>
          <Text>Name: {userData.name}</Text>
          <Text>Email: {userData.email}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("EditProfile", { userData })}
          >
            <Text>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              marginTop: 20,
              backgroundColor: "#F06A37",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default Profile;
