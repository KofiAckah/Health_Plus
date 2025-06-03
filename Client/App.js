import "./global.css";
import { SafeAreaView, StyleSheet, Platform, StatusBar } from "react-native";
import StackScren from "./src/Navigations/StackScren";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StackScren />
      {/* <StatusBar style="auto" /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0071BD",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
