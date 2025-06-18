import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../../Components/Header";
import axios from "axios";
import { BackendLink } from "../../Components/Default";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfile = () => {
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

  const handleUpadteProfile = () => {
    if (!userData) return;

    const updateProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        await axios.put(`${BackendLink}/profile`, userData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Alert("Update made");
        navigation.goBack();
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    };

    updateProfile();
  };

  return (
    <View>
      <ScrollView>
        {/* Header */}
        <Header title={"Edit Profile"} />
      </ScrollView>
    </View>
  );
};

export default EditProfile;
