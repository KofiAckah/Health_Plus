import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faAmbulance,
  faFirstAid,
  faUserFriends,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

// Screens
import Emergency from "./Emergency";
import FirstAid from "./FirstAid";
import Social from "./Social";
import Profile from "./Profile";

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
          }
          return (
            <FontAwesomeIcon
              icon={iconName}
              size={(size = focused ? 28 : 22)}
              color={(color = focused ? "#f5f5f5" : "#cbeef3")}
            />
          );
        },
        tabBarLabelStyle: {
          color: "#f5f5f5",
          fontSize: 11,
          fontWeight: "bold",
          fontFamily: "San-Serif",
          textAlign: "center",
        },
        tabBarActiveBackgroundColor: "#f26a8d",
        tabBarInactiveBackgroundColor: "#f49cbb",
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
          marginHorizontal: 7,
        },
      })}
    >
      <Tab.Screen name="Emergency" component={Emergency} />
      <Tab.Screen name="FirstAid" component={FirstAid} />
      <Tab.Screen name="Social" component={Social} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomTab;
