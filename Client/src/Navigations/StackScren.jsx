import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

// Screens
import BottomTab from "./BottomTab";
import Help from "../Screens/Help";
// Accounts Screens
import Signup from "../Screens/Accounts/Signup";
import Login from "../Screens/Accounts/Login";
import ForgetPassword from "../Screens/Accounts/ForgetPassword";
// Socials Screens
import PostIssue from "../Screens/Socials/PostIssue";

const Stack = createStackNavigator();

const StackScren = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setInitialRoute(token ? "BottomTab" : "Login");
      } catch (e) {
        setInitialRoute("Login");
      }
    };
    checkLogin();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#F06A37" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen name="BottomTab" component={BottomTab} />
        {/* Accounts Screen */}
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        </>
        {/* Socials Screen */}
        <>
          <Stack.Screen name="PostIssue" component={PostIssue} />
        </>
        {/* Help Screen */}
        <Stack.Screen name="Help" component={Help} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackScren;
