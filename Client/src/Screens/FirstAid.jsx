import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import { faHeart, faFire, faBandage } from "@fortawesome/free-solid-svg-icons";
import { firstAidTips } from "../Components/FirstAidTips";

const FirstAid = () => {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4 mb-16">
        <Text className="text-2xl font-bold mb-4">First Aid Tips</Text>

        {firstAidTips.map((category) => (
          <View key={category.id} className="bg-white rounded-lg p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <FontAwesomeIcon icon={category.icon} size={24} color="#FF4B4B" />
              <Text className="text-lg font-semibold ml-2">
                {category.category}
              </Text>
            </View>

            {category.tips.map((tip, index) => (
              <View key={index} className="mb-4">
                <Text className="text-lg font-semibold mb-2">{tip.title}</Text>
                {tip.steps.map((step, stepIndex) => (
                  <View key={stepIndex} className="flex-row items-center mb-2">
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
  );
};

export default FirstAid;
