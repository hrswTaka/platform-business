import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ActivityIndicator, Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { BottomNav, TabId } from "./components/BottomNav";
import { AddScreen } from "./screens/AddScreen";
import { CompareScreen } from "./screens/CompareScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { SettingsScreen } from "./screens/SettingsScreen";

export type BodyRecord = {
  date: string;
  weight: number;
  memo?: string;
  photoUri?: string | null;
};

export default function App() {
  const [tab, setTab] = useState<TabId>("home");
  const [records, setRecords] = useState<Record<string, BodyRecord>>({});
  const [latestSavedDate, setLatestSavedDate] = useState<string | null>(null);

  function saveRecord(record: BodyRecord) {
    setRecords(prev => ({ ...prev, [record.date]: record }));
    setLatestSavedDate(record.date);
    setTab("home");
  }

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
      <View style={s.shell}>
        <StatusBar style="dark" />
        <View style={s.screen}>
          {tab === "home"     && <HomeScreen records={records} focusDate={latestSavedDate} />}
          {tab === "compare"  && <CompareScreen records={records} />}
          {tab === "add"      && <AddScreen onSave={saveRecord} />}
          {tab === "settings" && <SettingsScreen />}
        </View>
        <BottomNav activeTab={tab} onTabPress={setTab} />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   {
    flex:1,
    backgroundColor: Platform.OS === "web" ? "#D0D0D4" : "#fff",
    alignItems: Platform.OS === "web" ? "center" : "stretch",
  },
  shell:  {
    flex:1,
    width:"100%",
    maxWidth: Platform.OS === "web" ? 390 : undefined,
    backgroundColor:"#fff",
    overflow:"hidden",
    borderRadius: Platform.OS === "web" ? 28 : 0,
  },
  screen: { flex:1 },
});
