import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import EditPost from "../Screens/Socials/EditPost";

// Screens
import BottomTab from "./BottomTab";
import GeminiChat from "../Screens/GeminiChat";
// Accounts Screens
import Signup from "../Screens/Accounts/Signup";
import Login from "../Screens/Accounts/Login";
import ForgetPassword from "../Screens/Accounts/ForgetPassword";
import VerifyEmail from "../Screens/Accounts/VerifyEmail";
// Socials Screens
import PostIssue from "../Screens/Socials/PostIssue";
import IssueDetails from "../Screens/Socials/IssueDetails";
// Settings Screens
import Settings from "../Screens/Settings/Settings";
import EditProfile from "../Screens/Settings/EditProfile";
import Notification from "../Screens/Settings/Notification";
import Help from "../Screens/Settings/Help";

const Stack = createStackNavigator();

const StackScren = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        // console.log("Token:", token);
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
        <ActivityIndicator size="large" color="#11D6CD" />
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
        <Stack.Screen name="GeminiChat" component={GeminiChat} />
        {/* Accounts Screen */}
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
        </>
        {/* Socials Screen */}
        <>
          <Stack.Screen name="PostIssue" component={PostIssue} />
          <Stack.Screen name="IssueDetails" component={IssueDetails} />
          <Stack.Screen name="EditPost" component={EditPost} />
        </>
        {/* Settings Screen */}
        <>
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="Help" component={Help} />
        </>
        {/* Help Screen */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackScren;
