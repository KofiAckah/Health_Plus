const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add support for web imports
config.resolver.platforms = ["native", "web", "ios", "android"];

module.exports = withNativeWind(config, { input: "./global.css" });
