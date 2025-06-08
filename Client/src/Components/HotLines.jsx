export const HotlinesData = [
  {
    name: "Fire Service",
    cell: 911,
    image: require("../../assets/FireLogo.jpg"),
    onPress: () => console.log("Call 911"),
    color: "#ff0000",
  },
  {
    name: "Police Service",
    cell: 999,
    image: require("../../assets/PoliceLogo.jpeg"),
    onPress: () => console.log("Call 999"),
    color: "#0000ff",
  },
  {
    name: "Ambulance Service",
    cell: 112,
    image: require("../../assets/GHSLogo.jpeg"),
    onPress: () => console.log("Call 112"),
    color: "#00ff00",
  },
  // {
  //   name: "Emergency Services",
  //   cell: 911,
  //   image: require("../../assets/EmergencyLogo.jpg"),
  //   onPress : () => console.log("Call Emergency Services"),
  //   color: "#ff00ff",
  // }
];
