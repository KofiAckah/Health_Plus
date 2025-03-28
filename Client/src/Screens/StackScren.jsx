import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Screens
import BottomTab from "./BottomTab";
import Help from "./Help";

const Stack = createStackNavigator();

const StackScren = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="BottomTab"
      >
        <Stack.Screen name="BottomTab" component={BottomTab} />
        <Stack.Screen name="Help" component={Help} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackScren;
