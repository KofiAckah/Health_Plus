import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Screens
import BottomTab from "./BottomTab";
import Help from "../Screens/Help";
// Accounts Screens
import ForgetPassword from "../Screens/Accounts/ForgetPassword";
import Signup from "../Screens/Accounts/Signup";
import Login from "../Screens/Accounts/Login";

const Stack = createStackNavigator();

const StackScren = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="BottomTab"
      >
        <Stack.Screen name="BottomTab" component={BottomTab} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        {/* Add other screens here */}
        <Stack.Screen name="Help" component={Help} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackScren;
