import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from "react-native";
import { BottomNav, TabId } from "./components/BottomNav";
import { AddScreen } from "./screens/AddScreen";
import { CompareScreen } from "./screens/CompareScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { SettingsScreen } from "./screens/SettingsScreen";

export default function App() {
  const [tab, setTab] = useState<TabId>("home");

  const [fontsLoaded] = useFonts({
    "BarlowCondensed-Black":
      require("@expo-google-fonts/barlow-condensed/900Black/BarlowCondensed_900Black.ttf"),
    "BarlowCondensed-ExtraBold":
      require("@expo-google-fonts/barlow-condensed/800ExtraBold/BarlowCondensed_800ExtraBold.ttf"),
    "IBMPlexMono":
      require("@expo-google-fonts/ibm-plex-mono/400Regular/IBMPlexMono_400Regular.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex:1, alignItems:"center", justifyContent:"center" }}>
        <ActivityIndicator color="#C89898" />
      </View>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />
      <View style={s.screen}>
        {tab === "home"     && <HomeScreen />}
        {tab === "compare"  && <CompareScreen />}
        {tab === "add"      && <AddScreen onSave={() => setTab("home")} />}
        {tab === "settings" && <SettingsScreen />}
      </View>
      <BottomNav activeTab={tab} onTabPress={setTab} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex:1, backgroundColor:"#fff" },
  screen: { flex:1 },
});
