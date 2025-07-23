import axios from "axios";
import { useState } from "react";
import { BackendLink } from "../../Components/Default";
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
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes, faImage, faFlag } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const PostIssue = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [hasStatus, setHasStatus] = useState(false);

  // Pick image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImage(result.assets[0].uri);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImage(null);
    // Reset status when image is removed
    setHasStatus(false);
  };

  // Post issue to backend
  const handlePost = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Please fill in both title and description.");
      return;
    }

    setUploading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      // Check if we have an image to upload
      if (image) {
        // Use FormData for multipart upload when image is present
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("hasStatus", hasStatus.toString());
        formData.append("issuePicture", {
          uri: image,
          name: "issue.jpg",
          type: "image/jpeg",
        });

        await axios.post(`${BackendLink}/issue/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Send JSON data when no image - no status when no image
        await axios.post(
          `${BackendLink}/issue/`,
          {
            title,
            description,
            hasStatus: false, // Always false when no image
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      Alert.alert("Success", "Post created!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to create post.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView className="bg-white h-full">
        <View>
          <View className="flex-row items-center justify-between px-4 py-3">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-1 ml-2"
            >
              <FontAwesomeIcon icon={faTimes} size={22} />
            </TouchableOpacity>
            <Text className="text-xl font-semibold">Create a post</Text>
            <TouchableOpacity
              className="p-2 mr-2"
              onPress={handlePost}
              disabled={uploading}
            >
              <Text className="font-semibold text-primary-400 text-lg">
                {uploading ? "Posting..." : "Post"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View className="px-4">
            <TextInput
              className="w-full bg-secondary-200 p-3 rounded-lg mb-4 placeholder:text-primary-100"
              placeholder="Title"
              placeholderTextColor="#b0b8c1"
              multiline
              numberOfLines={2}
              style={{ textAlignVertical: "top" }}
              value={title}
              onChangeText={setTitle}
              editable={!uploading}
            />

            <TextInput
              className="w-full bg-secondary-200 p-3 rounded-lg mb-4 h-28 placeholder:text-primary-100"
              placeholder="Description"
              placeholderTextColor="#b0b8c1"
              multiline
              numberOfLines={6}
              style={{ textAlignVertical: "top" }}
              value={description}
              onChangeText={setDescription}
              editable={!uploading}
            />

            {/* Image Section */}
            {image ? (
              <View className="mb-4">
                <Text className="text-primary-100 text-base font-semibold mb-2">
                  Selected Image:
                </Text>
                <View className="relative">
                  <Image
                    source={{ uri: image }}
                    className="w-full h-64 rounded-lg"
                    style={{ resizeMode: "cover" }}
                  />
                  <TouchableOpacity
                    className="absolute top-2 right-2 bg-red-500 p-2 rounded-full"
                    onPress={removeImage}
                    disabled={uploading}
                  >
                    <FontAwesomeIcon icon={faTimes} size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                className="w-full bg-secondary-200 p-4 rounded-lg mb-4 flex-row items-center justify-center border-2 border-dashed border-primary-100"
                onPress={pickImage}
                disabled={uploading}
              >
                <FontAwesomeIcon
                  icon={faImage}
                  size={24}
                  color="#49739c"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-primary-100 text-base font-medium">
                  Add Image (Optional)
                </Text>
              </TouchableOpacity>
            )}

            {/* Status Toggle Section - Only show when image is present */}
            {image && (
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
                        Add Status Tracking
                      </Text>
                      <Text className="text-primary-100 text-sm opacity-70">
                        Track progress with status (Open, In Progress, Resolved)
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={hasStatus}
                    onValueChange={setHasStatus}
                    disabled={uploading}
                    trackColor={{ false: "#d1d5db", true: "#49739c" }}
                    thumbColor={hasStatus ? "#ffffff" : "#f3f4f6"}
                  />
                </View>

                {hasStatus && (
                  <View className="mt-3 pt-3 border-t border-gray-300">
                    <Text className="text-primary-100 text-sm">
                      Status will be set to "Open" by default
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Action Buttons */}
            {image && (
              <TouchableOpacity
                className="w-full bg-primary-100 p-3 rounded-lg mb-4"
                onPress={pickImage}
                disabled={uploading}
              >
                <Text className="text-white text-center font-semibold">
                  Change Image
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostIssue;
