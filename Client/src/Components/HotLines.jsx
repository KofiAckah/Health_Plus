import { Linking } from "react-native";

export const HotlinesData = [
  {
    name: "Fire Service",
    cell: 911,
    image: require("../../assets/FireLogo.jpg"),
    onPress: () => Linking.openURL("tel:911"),
    color: "#ff0000",
  },
  {
    name: "Police Service",
    cell: 999,
    image: require("../../assets/PoliceLogo.jpeg"),
    onPress: () => Linking.openURL("tel:999"),
    color: "#0000ff",
  },
  {
    name: "Ambulance Service",
    cell: 112,
    image: require("../../assets/GHSLogo.jpeg"),
    onPress: () => Linking.openURL("tel:112"),
    color: "#00ff00",
  },
  // {
  //   name: "Emergency Services",
  //   cell: 911,
  //   image: require("../../assets/EmergencyLogo.jpg"),
  //   onPress : () => Linking.openURL("tel:911"),
  //   color: "#ff00ff",
  // }
];
