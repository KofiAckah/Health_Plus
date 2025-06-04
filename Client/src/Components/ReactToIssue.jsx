import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHeart as faHeartSolid,
  faThumbsUp as faThumbsUpSolid,
  faFaceSmile as faFaceSmileSolid,
  faFaceFrownOpen as faFaceFrownOpenSolid,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart,
  faThumbsUp,
  faFaceSmile,
  faFaceFrownOpen,
} from "@fortawesome/free-regular-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import axios from "axios";
import { BackendLink } from "./Default";

const ReactToIssue = ({
  issue,
  userId,
  onReacted = () => {},
}) => {
  const [submitting, setSubmitting] = useState(false);

  const userReaction = issue.reactedUsers?.find(
    (ru) => ru.user === userId || ru.user?._id === userId
  )?.reaction;

  const handleReaction = async (reactionType) => {
    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        `${BackendLink}/issue/${issue._id}/react`,
        { reaction: reactionType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onReacted();
    } catch (error) {
      console.error("Error reacting to issue:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-row justify-between items-center px-4 pt-2 mx-4">
      <TouchableOpacity
        onPress={() => handleReaction("likes")}
        className="p-2"
        disabled={submitting}
      >
        <View className="flex-row items-center">
          <FontAwesomeIcon
            icon={userReaction === "likes" ? faThumbsUpSolid : faThumbsUp}
            size={20}
            color="#49739c"
          />
          <Text className="ml-2 text-primary-100">
            {issue.reactions.likes}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleReaction("loves")}
        className="p-2"
        disabled={submitting}
      >
        <View className="flex-row items-center">
          <FontAwesomeIcon
            icon={userReaction === "loves" ? faHeartSolid : faHeart}
            size={20}
            color="#49739c"
          />
          <Text className="ml-2 text-primary-100">
            {issue.reactions.loves}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleReaction("joys")}
        className="p-2"
        disabled={submitting}
      >
        <View className="flex-row items-center">
          <FontAwesomeIcon
            icon={userReaction === "joys" ? faFaceSmileSolid : faFaceSmile}
            size={20}
            color="#49739c"
          />
          <Text className="ml-2 text-primary-100">
            {issue.reactions.joys}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleReaction("sads")}
        className="p-2"
        disabled={submitting}
      >
        <View className="flex-row items-center">
          <FontAwesomeIcon
            icon={
              userReaction === "sads"
                ? faFaceFrownOpenSolid
                : faFaceFrownOpen
            }
            size={20}
            color="#49739c"
          />
          <Text className="ml-2 text-primary-100">
            {issue.reactions.sads}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ReactToIssue;
