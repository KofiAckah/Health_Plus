import { View, Text, ScrollView, StatusBar, Image } from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import { BackendLink } from "../Components/Default";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
// import { format } from "date-fns"; // Add this line

const Social = () => {
  const [issues, setIssues] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchIssueData = async () => {
      try {
        const response = await axios.get(`${BackendLink}/issue/`);
        setIssues(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching issues data:", error);
        setLoading(false);
      }
    };

    fetchIssueData();
  }, []);
  return (
    <ScrollView className="flex-1 bg-white">
      {/* <View className=""> */}
      <Text className="text-2xl font-bold mb-4 mx-auto">Feed</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        issues &&
        issues.map((issue) => (
          <View key={issue._id} className="mb-2">
            <View className="p-4">
              <View>
                <View className="flex-row mb-2">
                  {issue.createdBy.profilePicture ? (
                    <Image
                      source={{ uri: issue.createdBy.profilePicture }}
                      className="w-12 h-12 rounded-full mr-2"
                    />
                  ) : (
                    <View className="w-12 h-12 rounded-full mr-2 border border-secondary-700 flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faUser}
                        size={26}
                        color="#4a4a4a"
                      />
                    </View>
                  )}
                  <View className="flex flex-col justify-center">
                    <Text className="text-lg font-semibold">
                      {issue.createdBy ? issue.createdBy.name : "Unknown User"}
                    </Text>
                    <Text className="text-secondary-700 text-sm">
                      {new Date(issue.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                </View>
              </View>
              <Text className="text-lg font-semibold">{issue.title}</Text>
              <Text className="text-secondary-800 mt-1">
                {issue.description}
              </Text>
            </View>
            <Image
              source={{ uri: issue.issuePicture }}
              className="w-full h-64 object-cover"
            />
          </View>
        ))
      )}
      {/* </View> */}
    </ScrollView>
  );
};

export default Social;
