import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Animated,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { firstAidTips } from "../Components/FirstAidTips";
import { useNavigation } from "@react-navigation/native";
import { useState, useRef } from "react";

const FirstAid = () => {
  const navigation = useNavigation();
  const [showTooltip, setShowTooltip] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleLongPress = () => {
    setShowTooltip(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Hide tooltip after 2 seconds
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShowTooltip(false);
      });
    }, 2500);
  };

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="">
        <View className="p-4 mb-16">
          <Text className="text-2xl font-bold mb-4">First Aid Tips</Text>

          {firstAidTips.map((category) => (
            <View key={category.id} className="bg-white rounded-lg p-4 mb-4">
              <View className="flex-row items-center mb-3">
                <FontAwesomeIcon
                  icon={category.icon}
                  size={24}
                  color="#FF4B4B"
                />
                <Text className="text-lg font-semibold ml-2">
                  {category.category}
                </Text>
              </View>

              {category.tips.map((tip, index) => (
                <View key={index} className="mb-4">
                  <Text className="text-lg font-semibold mb-2">
                    {tip.title}
                  </Text>
                  {tip.steps.map((step, stepIndex) => (
                    <View
                      key={stepIndex}
                      className="flex-row items-center mb-2"
                    >
                      <View className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                      <Text className="text-gray-700">{step}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="absolute bottom-20 right-6">
        {/* Tooltip */}
        {showTooltip && (
          <Animated.View
            style={{ opacity: fadeAnim }}
            className="absolute bottom-16 right-0 bg-gray-800 px-3 py-2 rounded-lg mb-2 w-20"
          >
            <Text className="text-white text-center text-sm font-medium">
              ChatBot
            </Text>
            {/* Triangle pointer */}
            <View className="absolute -bottom-1 right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800" />
          </Animated.View>
        )}

        <TouchableOpacity
          className="bg-blue-500 p-3 rounded-full shadow-lg"
          onPress={() => navigation.navigate("GeminiChat")}
          onLongPress={handleLongPress}
        >
          <FontAwesomeIcon icon={faComment} size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FirstAid;
