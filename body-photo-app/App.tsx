import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { BottomNav, TabId } from "./components/BottomNav";
import { getAllRecords, upsertRecord, type BodyRecord, type RecordMap } from "./lib/db";
import { deletePhoto, persistPhoto } from "./lib/photos";
import { AddScreen } from "./screens/AddScreen";
import { CompareScreen } from "./screens/CompareScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { SettingsScreen } from "./screens/SettingsScreen";

export type { BodyRecord };

export default function App() {
  const [tab, setTab] = useState<TabId>("home");
  const [records, setRecords] = useState<RecordMap>({});
  const [latestSavedDate, setLatestSavedDate] = useState<string | null>(null);

  useEffect(() => {
    getAllRecords().then(setRecords).catch(console.error);
  }, []);

  function saveRecord(record: BodyRecord) {
    const prev = records[record.date];
    let photoUri = record.photoUri ?? null;
    // 新しい写真が選ばれたら恒久領域へコピーし、置き換えられた旧写真は消す
    if (photoUri && photoUri !== prev?.photoUri) {
      photoUri = persistPhoto(photoUri, record.date);
      deletePhoto(prev?.photoUri);
    }
    const saved: BodyRecord = { ...record, photoUri };
    upsertRecord(saved).catch(console.error);
    setRecords(prevMap => ({ ...prevMap, [saved.date]: saved }));
    setLatestSavedDate(saved.date);
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
          {/* タブを離れても各画面の状態（比較の選択など）を保持するため、全てマウントしたまま表示を切り替える */}
          <View style={[s.tabPane, tab !== "home" && s.tabHidden]}>
            <HomeScreen records={records} focusDate={latestSavedDate} />
          </View>
          <View style={[s.tabPane, tab !== "compare" && s.tabHidden]}>
            <CompareScreen records={records} />
          </View>
          <View style={[s.tabPane, tab !== "add" && s.tabHidden]}>
            <AddScreen onSave={saveRecord} records={records} />
          </View>
          <View style={[s.tabPane, tab !== "settings" && s.tabHidden]}>
            <SettingsScreen />
          </View>
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
  tabPane:{ flex:1 },
  tabHidden:{ display:"none" },
});
