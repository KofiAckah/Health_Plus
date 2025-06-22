import {
  faUser,
  faTriangleExclamation,
  faLock,
  faRightFromBracket,
  faCircleQuestion,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackendLink } from "./Default";
import { Alert } from "react-native";

// Pass navigation to onPress if you want to navigate after logout
export const handleLogout = async (navigation) => {
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
  if (navigation) {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  }
};

export const SettingsData = [
  {
    name: "Account",
    icon: faUser,
    info: "Manage your account, edit profile, and more",
    onPress: (navigation) => {
      navigation.navigate("EditProfile");
    },
  },
  {
    name: "Notifications",
    icon: faTriangleExclamation,
    info: "Manage your notification preferences",
    // onPress: (navigation) => {
    //   navigation.navigate("Notification");
    // },
    onPress: () =>
      Alert.alert("Notifications", "This feature is under development."),
  },
  {
    name: "Security",
    icon: faLock,
    info: "Manage your security settings",
    onPress: () =>
      Alert.alert("Security", "This feature is under development."),
  },
  {
    name: "Help",
    icon: faCircleQuestion,
    info: "Help and support",
    onPress: (navigation) => {
      navigation.navigate("Help");
    },
  },
  {
    name: "About",
    icon: faUser,
    info: "Learn more about the app",
    onPress: () => console.log("Hello About"),
  },
  {
    name: "Terms and Conditions",
    icon: faListCheck,
    info: "Read our terms and conditions",
    onPress: () =>
      Alert.alert("Terms and Conditions", "This feature is under development."),
  },
  {
    name: "Logout",
    icon: faRightFromBracket,
    info: "Logout from your account",
    onPress: handleLogout, // Pass navigation when calling this in Settings screen
  },
];
