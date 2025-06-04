import { View, TextInput, TouchableOpacity, Alert } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";
import { BackendLink } from "./Default";

const AddComment = ({
  issueId,
  onCommentAdded = () => {},
  inputClassName = "",
  buttonClassName = "",
}) => {
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSend = async () => {
    if (!value.trim()) return;
    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `${BackendLink}/issue/${issueId}/comment`,
        { text: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setValue("");
      onCommentAdded();
      Alert.alert("Success", "Comment added");
    } catch (error) {
      console.error("Error adding comment:", error);
      Alert.alert("Error", "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-row align-items-center mt-2">
      <TextInput
        placeholder="Add a comment..."
        value={value}
        onChangeText={setValue}
        className={`flex-1 bg-secondary-200 rounded-lg pl-3 p-2 mr-2 placeholder:text-primary-100 ${inputClassName}`}
        editable={!submitting}
      />
      <TouchableOpacity
        onPress={handleSend}
        className={`bg-primary-100 p-2 px-4 rounded-lg ${buttonClassName}`}
        disabled={!value.trim() || submitting}
      >
        <FontAwesomeIcon
          icon={faPaperPlane}
          size={20}
          color="#fff"
          style={{
            marginHorizontal: "auto",
            marginVertical: "auto",
            opacity: !value.trim() || submitting ? 0.5 : 1,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default AddComment;
