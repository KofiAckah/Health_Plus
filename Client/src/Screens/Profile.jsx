import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import React from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackendLink } from "../Components/Default";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import UserPosts from "../Components/UserPosts";

const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [shouldRefreshUser, setShouldRefreshUser] = useState(false);

  const fetchUserData = useCallback(async () => {
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
  }, []);

  const fetchUserPosts = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(`${BackendLink}/issue/user/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserPosts(response.data);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Only refresh posts on manual pull-to-refresh
    await fetchUserPosts();
    setRefreshing(false);
  };

  const handleRefreshUserData = async () => {
    // Separate function for refreshing user data
    await fetchUserData();
    setShouldRefreshUser(false);
  };

  // Initial load only
  useEffect(() => {
    const initializeProfile = async () => {
      setLoading(true);
      await Promise.all([fetchUserData(), fetchUserPosts()]);
      setLoading(false);
    };

    initializeProfile();
  }, []);

  // Listen for navigation focus to check if user data should be refreshed
  useFocusEffect(
    useCallback(() => {
      // Check if we're returning from EditProfile
      const unsubscribe = navigation.addListener("focus", () => {
        const routeParams = navigation
          .getState()
          ?.routes?.find((route) => route.name === "Profile")?.params;

        if (routeParams?.refreshUserData) {
          handleRefreshUserData();
          // Clear the param to prevent repeated refreshes
          navigation.setParams({ refreshUserData: undefined });
        }
      });

      return unsubscribe;
    }, [navigation])
  );

  // Alternative approach: Listen for a custom event
  useFocusEffect(
    useCallback(() => {
      const checkForUserUpdate = async () => {
        try {
          const lastUpdate = await AsyncStorage.getItem(
            "lastUserProfileUpdate"
          );
          const currentUserUpdate = await AsyncStorage.getItem(
            "currentUserProfileUpdate"
          );

          if (currentUserUpdate && lastUpdate !== currentUserUpdate) {
            await handleRefreshUserData();
            await AsyncStorage.setItem(
              "lastUserProfileUpdate",
              currentUserUpdate
            );
          }
        } catch (error) {
          console.error("Error checking for user updates:", error);
        }
      };

      checkForUserUpdate();
    }, [])
  );

  if (!userData || loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#11D6CD" />
        <Text onPress={() => navigation.navigate("Login")}>Logout</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#49739c"]}
          />
        }
      >
        {/* Header */}
        <View className="bg-secondary-100 relative h-36 mb-20">
          <View className="flex-row items-center justify-between p-5 w-full">
            <Text className="text-xl font-semibold text-white">Profile</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
              <FontAwesomeIcon icon={faGear} size={24} color="#f5f5f5" />
            </TouchableOpacity>
          </View>

          {/* Profile Picture */}
          <View className="absolute top-20 left-1/2 transform -translate-x-1/2 rounded-full border-4 border-white overflow-hidden w-32 h-32 bg-secondary-100">
            {userData.profilePicture ? (
              <Image
                source={{ uri: userData.profilePicture }}
                className="w-32 h-32"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <FontAwesomeIcon icon={faUser} size={60} color="#f5f5f5" />
              </View>
            )}
          </View>
        </View>

        {/* User Info */}
        <View className="px-6 items-center mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Hi, {userData.name}!
          </Text>
          <Text className="text-gray-600 mb-1">Email: {userData.email}</Text>
          <Text className="text-gray-600 mb-1">
            Phone: {userData.phone || "No Number Provided"}
          </Text>
          <Text className="text-gray-600 text-center">
            Bio: {userData.bio || "No bio provided"}
          </Text>
        </View>

        {/* User Posts Component */}
        <UserPosts
          userPosts={userPosts}
          setUserPosts={setUserPosts}
          onRefreshPosts={fetchUserPosts}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
