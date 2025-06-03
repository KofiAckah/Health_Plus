import "./global.css";
import { SafeAreaView, StatusBar } from "react-native";
import StackScren from "./src/Navigations/StackScren";

export default function App() {
  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="dark-content" backgroundColor={"#0071BD"} />
      <StackScren />
    </SafeAreaView>
  );
}
