const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Webでは expo-sqlite / expo-file-system を使わない（IndexedDBフォールバック）。
// expo-sqlite の web 実装は wasm を要求しビルドが壊れるため、空モジュールに差し替える。
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && (moduleName === "expo-sqlite" || moduleName.startsWith("expo-sqlite/"))) {
    return { type: "sourceFile", filePath: path.join(__dirname, "lib", "empty-module.js") };
  }
  return (defaultResolveRequest ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
