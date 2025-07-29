import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUser,
  faEdit,
  faTrash,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BackendLink } from "./Default";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const UserPosts = ({ userPosts, setUserPosts, onRefreshPosts }) => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("all");
  const [refreshingPosts, setRefreshingPosts] = useState(false);

  // Listen for focus to refresh posts when returning from EditPost
  useFocusEffect(
    React.useCallback(() => {
      const checkForPostUpdate = async () => {
        try {
          const lastUpdate = await AsyncStorage.getItem("lastPostUpdate");
          const currentPostUpdate = await AsyncStorage.getItem(
            "currentPostUpdate"
          );

          if (currentPostUpdate && lastUpdate !== currentPostUpdate) {
            if (onRefreshPosts) {
              setRefreshingPosts(true);
              await onRefreshPosts();
              setRefreshingPosts(false);
            }
            await AsyncStorage.setItem("lastPostUpdate", currentPostUpdate);
          }
        } catch (error) {
          console.error("Error checking for post updates:", error);
        }
      };

      checkForPostUpdate();
    }, [onRefreshPosts])
  );

  const handleDeletePost = (postId) => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            await axios.delete(`${BackendLink}/issue/${postId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            // Remove the post from local state
            setUserPosts((prev) => prev.filter((post) => post._id !== postId));
            Alert.alert("Success", "Post deleted successfully");
          } catch (error) {
            console.error("Error deleting post:", error);
            Alert.alert("Error", "Failed to delete post");
          }
        },
      },
    ]);
  };

  const handleEditPost = (post) => {
    // Navigate to edit post screen with post data
    navigation.navigate("EditPost", { post });
  };

  const handleRefreshPosts = async () => {
    if (onRefreshPosts) {
      setRefreshingPosts(true);
      await onRefreshPosts();
      setRefreshingPosts(false);
    }
  };

  const getFilteredPosts = () => {
    switch (activeTab) {
      case "no-images":
        return userPosts.filter(
          (post) => !post.issuePicture || post.issuePicture.trim() === ""
        );
      case "images":
        return userPosts.filter(
          (post) => post.issuePicture && post.issuePicture.trim() !== ""
        );
      default:
        return userPosts;
    }
  };

  const renderPost = ({ item: post }) => (
    <View key={post._id} className="mb-2 bg-gray-50 pb-2">
      {/* Post Actions */}
      <View className="absolute top-2 right-2 flex-row space-x-2 z-20">
        <TouchableOpacity
          onPress={() => handleEditPost(post)}
          className="bg-white p-2 rounded-full shadow-sm"
        >
          <FontAwesomeIcon icon={faEdit} size={16} color="#49739c" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeletePost(post._id)}
          className="bg-white p-2 rounded-full shadow-sm"
        >
          <FontAwesomeIcon icon={faTrash} size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="p-4"
        onPress={() =>
          navigation.navigate("IssueDetails", { issueId: post._id })
        }
        activeOpacity={0.9}
      >
        <Text className="text-lg font-semibold">{post.title}</Text>
        <Text className="text-primary-300 mt-1 line-clamp-3">
          {post.description}
        </Text>
        <Text className="text-primary-100 text-sm mt-2">
          {formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
          })}
        </Text>
      </TouchableOpacity>

      {/* Image with Status Badge */}
      {post.issuePicture && post.issuePicture.trim() !== "" && (
        <View className="relative">
          <Image
            source={{ uri: post.issuePicture }}
            className="w-full h-64 object-cover"
          />
          {/* Status Badge on Image */}
          {post.hasStatus && post.status && (
            <View className="absolute top-2 left-2">
              <Text
                className="px-2 py-1 rounded text-sm font-medium"
                style={{
                  backgroundColor:
                    post.status === "Open"
                      ? "#ef4444"
                      : post.status === "In Progress"
                      ? "#facc15"
                      : post.status === "Resolved"
                      ? "#3b82f6"
                      : "#e5e7eb",
                  color: post.status === "In Progress" ? "#92400e" : "#fff",
                }}
              >
                {post.status}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Status Badge for posts without images */}
      {(!post.issuePicture || post.issuePicture.trim() === "") &&
        post.hasStatus &&
        post.status && (
          <View className="px-4 pb-2">
            <Text
              className="px-2 py-1 rounded text-sm font-medium self-start"
              style={{
                backgroundColor:
                  post.status === "Open"
                    ? "#ef4444"
                    : post.status === "In Progress"
                    ? "#facc15"
                    : post.status === "Resolved"
                    ? "#3b82f6"
                    : "#e5e7eb",
                color: post.status === "In Progress" ? "#92400e" : "#fff",
              }}
            >
              {post.status}
            </Text>
          </View>
        )}
    </View>
  );

  const filteredPosts = getFilteredPosts();

  return (
    <View>
      {/* Tab Navigation with Refresh Button */}
      <View className="flex-row border-b border-gray-200 mb-4">
        <TouchableOpacity
          onPress={() => setActiveTab("all")}
          className={`flex-1 py-3 ${
            activeTab === "all" ? "border-b-2 border-secondary-100" : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "all" ? "text-secondary-100" : "text-gray-500"
            }`}
          >
            All Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("no-images")}
          className={`flex-1 py-3 ${
            activeTab === "no-images" ? "border-b-2 border-secondary-100" : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "no-images" ? "text-secondary-100" : "text-gray-500"
            }`}
          >
            No Images
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("images")}
          className={`flex-1 py-3 ${
            activeTab === "images" ? "border-b-2 border-secondary-100" : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "images" ? "text-secondary-100" : "text-gray-500"
            }`}
          >
            Images
          </Text>
        </TouchableOpacity>

        {/* Refresh Posts Button */}
        <TouchableOpacity
          onPress={handleRefreshPosts}
          className="px-3 py-3"
          disabled={refreshingPosts}
        >
          <FontAwesomeIcon
            icon={faSync}
            size={16}
            color={refreshingPosts ? "#d1d5db" : "#49739c"}
            rotation={refreshingPosts ? 180 : 0}
          />
        </TouchableOpacity>
      </View>

      {/* Posts List */}
      {filteredPosts.length > 0 ? (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item._id}
          renderItem={renderPost}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <View className="items-center py-12">
          <FontAwesomeIcon icon={faUser} size={48} color="#d1d5db" />
          <Text className="text-gray-500 mt-4 text-lg">
            {activeTab === "images"
              ? "No posts with images"
              : activeTab === "no-images"
              ? "No posts without images"
              : "No posts yet"}
          </Text>
          <Text className="text-gray-400 mt-2 text-center px-8">
            Share your thoughts and experiences with the community
          </Text>
        </View>
      )}
    </View>
  );
};

export default UserPosts;
