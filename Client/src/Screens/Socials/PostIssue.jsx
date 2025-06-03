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
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const PostIssue = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  // Post issue to backend
  const handlePost = async () => {
    if (!title.trim() || !description.trim() || !image) {
      Alert.alert("Error", "Please fill all fields and add an image.");
      return;
    }
    setUploading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
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
          <View className="w-[90%] mx-auto mb-4 ">
            <Image
              source={
                image ? { uri: image } : require("../../../assets/no image.jpg")
              }
              className="w-full h-64 rounded-3xl"
              style={{ resizeMode: "cover" }}
            />
            <TouchableOpacity
              className="absolute top-2 right-2 bg-white p-2 rounded-2xl shadow"
              onPress={pickImage}
            >
              <Text>{image ? "Change Image" : "Add Image"}</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TextInput
              className="w-[90%] mx-auto bg-secondary-200 p-3 rounded-lg mb-4 placeholder:text-primary-100"
              placeholder="Title"
              placeholderTextColor="#b0b8c1"
              multiline
              numberOfLines={4}
              style={{ textAlignVertical: "top" }}
              value={title}
              onChangeText={setTitle}
              editable={!uploading}
            />
            <TextInput
              className="w-[90%] mx-auto bg-secondary-200 p-3 rounded-lg mb-4 h-28 placeholder:text-primary-100"
              placeholder="Description"
              placeholderTextColor="#b0b8c1"
              multiline
              numberOfLines={6}
              style={{ textAlignVertical: "top" }}
              value={description}
              onChangeText={setDescription}
              editable={!uploading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostIssue;
