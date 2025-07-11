import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faAmbulance,
  faFirstAid,
  faUserFriends,
  faUser,
  faPhone,
  faP,
} from "@fortawesome/free-solid-svg-icons";

// Screens
import Emergency from "../Screens/Emergency";
import FirstAid from "../Screens/FirstAid";
import Social from "../Screens/Social";
import Profile from "../Screens/Profile";
import CallLog from "../Screens/CallLog";

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Emergency") {
            iconName = faAmbulance;
          } else if (route.name === "FirstAid") {
            iconName = faFirstAid;
          } else if (route.name === "Social") {
            iconName = faUserFriends;
          } else if (route.name === "Profile") {
            iconName = faUser;
          } else if (route.name === "Call Log") {
            iconName = faPhone;
          }
          return (
            <FontAwesomeIcon
              icon={iconName}
              size={(size = focused ? 25 : 20)}
              color={(color = focused ? "#023e8a" : "#f5f5f5")}
              // color={(color = focused ? "#f5f5f5" : "#cbeef3")}
            />
          );
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "bold",
          fontFamily: "San-Serif",
          textAlign: "center",
        },
        tabBarActiveTintColor: "#023e8a",
        tabBarInactiveTintColor: "#f5f5f5",
        tabBarActiveBackgroundColor: "#ade8f4",
        tabBarInactiveBackgroundColor: "#023e8a",
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          height: 53,
          borderRadius: 20,
          marginBottom: 7,
          marginHorizontal: 8,
        },
      })}
    >
      <Tab.Screen name="Emergency" component={Emergency} />
      <Tab.Screen name="FirstAid" component={FirstAid} />
      <Tab.Screen name="Social" component={Social} />
      <Tab.Screen name="Call Log" component={CallLog} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomTab;
