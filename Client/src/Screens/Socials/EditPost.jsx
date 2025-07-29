import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronLeft,
  faTimes,
  faImage,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BackendLink } from "../../Components/Default";
import * as ImagePicker from "expo-image-picker";

const EditPost = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { post } = route.params;

  const [title, setTitle] = useState(post.title || "");
  const [description, setDescription] = useState(post.description || "");
  const [image, setImage] = useState(post.issuePicture || null);
  const [hasStatus, setHasStatus] = useState(post.hasStatus || false);
  const [status, setStatus] = useState(post.status || "Open");
  const [updating, setUpdating] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);

  const statusOptions = ["Open", "In Progress", "Resolved"];

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImage(result.assets[0].uri);
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setRemoveImage(true);
    setHasStatus(false);
  };

  const handleUpdatePost = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Please fill in both title and description.");
      return;
    }

    setUpdating(true);
    try {
      const token = await AsyncStorage.getItem("token");

      // Check if we have a new image to upload or need to remove existing image
      const isNewImage =
        image &&
        (image.startsWith("file://") || image.startsWith("content://"));

      if (isNewImage) {
        // Use FormData for new image upload
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("hasStatus", hasStatus.toString());
        if (hasStatus) {
          formData.append("status", status);
        }
        formData.append("issuePicture", {
          uri: image,
          name: "issue.jpg",
          type: "image/jpeg",
        });

        await axios.put(`${BackendLink}/issue/${post._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Use JSON for text-only updates or image removal
        const updateData = {
          title,
          description,
          hasStatus,
        };

        if (hasStatus) {
          updateData.status = status;
        }

        if (removeImage) {
          updateData.removeIssuePicture = "true";
        }

        await axios.put(`${BackendLink}/issue/${post._id}`, updateData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Set flag to refresh posts in Profile screen
      await AsyncStorage.setItem("currentPostUpdate", Date.now().toString());

      Alert.alert("Success", "Post updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error updating post:", error);
      Alert.alert("Error", "Failed to update post.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
            <FontAwesomeIcon icon={faChevronLeft} size={22} color="#49739c" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold">Edit Post</Text>
          <TouchableOpacity
            className="p-2"
            onPress={handleUpdatePost}
            disabled={updating}
          >
            <Text className="font-semibold text-secondary-400 text-lg">
              {updating ? "Updating..." : "Update"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="px-4 py-4">
          {/* Title Input */}
          <TextInput
            className="w-full bg-secondary-200 p-3 rounded-lg mb-4 text-primary-300"
            placeholder="Title"
            placeholderTextColor="#b0b8c1"
            multiline
            numberOfLines={2}
            style={{ textAlignVertical: "top" }}
            value={title}
            onChangeText={setTitle}
            editable={!updating}
          />

          {/* Description Input */}
          <TextInput
            className="w-full bg-secondary-200 p-3 rounded-lg mb-4 h-28 text-primary-300"
            placeholder="Description"
            placeholderTextColor="#b0b8c1"
            multiline
            numberOfLines={6}
            style={{ textAlignVertical: "top" }}
            value={description}
            onChangeText={setDescription}
            editable={!updating}
          />

          {/* Image Section */}
          {image && !removeImage ? (
            <View className="mb-4">
              <Text className="text-primary-100 text-base font-semibold mb-2">
                Image:
              </Text>
              <View className="relative">
                <Image
                  source={{ uri: image }}
                  className="w-full h-64 rounded-lg"
                  style={{ resizeMode: "cover" }}
                />
                <TouchableOpacity
                  className="absolute top-2 right-2 bg-red-500 p-2 rounded-full"
                  onPress={handleRemoveImage}
                  disabled={updating}
                >
                  <FontAwesomeIcon icon={faTimes} size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              className="w-full bg-secondary-200 p-4 rounded-lg mb-4 flex-row items-center justify-center border-2 border-dashed border-primary-100"
              onPress={pickImage}
              disabled={updating}
            >
              <FontAwesomeIcon
                icon={faImage}
                size={24}
                color="#49739c"
                style={{ marginRight: 8 }}
              />
              <Text className="text-primary-100 text-base font-medium">
                {post.issuePicture ? "Change Image" : "Add Image (Optional)"}
              </Text>
            </TouchableOpacity>
          )}

          {/* Status Toggle Section */}
          {(image || post.issuePicture) && !removeImage && (
            <View className="bg-secondary-200 p-4 rounded-lg mb-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <FontAwesomeIcon
                    icon={faFlag}
                    size={20}
                    color="#49739c"
                    style={{ marginRight: 12 }}
                  />
                  <View className="flex-1">
                    <Text className="text-primary-100 text-base font-semibold">
                      Status Tracking
                    </Text>
                    <Text className="text-primary-100 text-sm opacity-70">
                      Track progress with status updates
                    </Text>
                  </View>
                </View>
                <Switch
                  value={hasStatus}
                  onValueChange={setHasStatus}
                  disabled={updating}
                  trackColor={{ false: "#d1d5db", true: "#49739c" }}
                  thumbColor={hasStatus ? "#ffffff" : "#f3f4f6"}
                />
              </View>

              {hasStatus && (
                <View className="mt-3 pt-3 border-t border-gray-300">
                  <Text className="text-primary-100 text-sm font-medium mb-2">
                    Current Status:
                  </Text>
                  <View className="flex-row flex-wrap">
                    {statusOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => setStatus(option)}
                        className={`mr-2 mb-2 px-3 py-2 rounded-lg border ${
                          status === option
                            ? "bg-primary-100 border-primary-100"
                            : "bg-white border-gray-300"
                        }`}
                        disabled={updating}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            status === option
                              ? "text-white"
                              : "text-primary-100"
                          }`}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {updating && (
            <View className="items-center py-4">
              <ActivityIndicator size="large" color="#49739c" />
              <Text className="text-primary-100 mt-2">Updating post...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditPost;
