const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Exclude the app directory from bundling (we're migrating from expo-router to react-navigation)
config.resolver.blockList = [/^\/app\/.*/];

module.exports = config;
