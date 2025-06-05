import {
  faUser,
  faRightFromBracket,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackendLink } from "./Default";

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
      console.log("Account Edit");
    },
  },
  {
    name: "Notifications",
    icon: faUser,
    info: "Manage your notification preferences",
    onPress: () => console.log("Hello Notifications"),
  },
  {
    name: "Privacy",
    icon: faUser,
    info: "Manage your privacy settings",
    onPress: () => console.log("Hello Privacy"),
  },
  {
    name: "Security",
    icon: faLock,
    info: "Manage your security settings",
    onPress: () => console.log("Hello Security"),
  },
  {
    name: "Help",
    icon: faUser,
    info: "Help and support",
    onPress: () => console.log("Hello Help"),
  },
  {
    name: "About",
    icon: faUser,
    info: "Learn more about the app",
    onPress: () => console.log("Hello About"),
  },
  {
    name: "Terms and Conditions",
    icon: faUser,
    info: "Read our terms and conditions",
    onPress: () => console.log("Hello Terms"),
  },
  {
    name: "Privacy Policy",
    icon: faUser,
    info: "Read our privacy policy",
    onPress: () => console.log("Hello Privacy"),
  },
  {
    name: "Logout",
    icon: faRightFromBracket,
    info: "Logout from your account",
    onPress: handleLogout, // Pass navigation when calling this in Settings screen
  },
];
