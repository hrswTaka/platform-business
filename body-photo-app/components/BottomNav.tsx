import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { C, F } from "../constants/theme";

export type TabId = "home" | "compare" | "add" | "settings";
type IoniconName = ComponentProps<typeof Ionicons>["name"];

interface Props {
  activeTab: TabId;
  onTabPress: (tab: TabId) => void;
}

export function BottomNav({ activeTab, onTabPress }: Props) {
  const ic = (name: IoniconName, active: boolean) =>
    <Ionicons name={name} size={22} color={active ? C.accent : C.t3} />;

  return (
    <View style={s.nav}>
      <TouchableOpacity style={s.btn} onPress={() => onTabPress("home")}>
        {ic("home-outline", activeTab === "home")}
        <Text style={[s.label, activeTab === "home" && s.active]}>ホーム</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.btn} onPress={() => onTabPress("compare")}>
        {ic("albums-outline", activeTab === "compare")}
        <Text style={[s.label, activeTab === "compare" && s.active]}>比較</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.btn} onPress={() => onTabPress("add")}>
        <View style={s.addBtn}>
          <Ionicons name="add" size={28} color="#fff" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={s.btn} onPress={() => onTabPress("settings")}>
        {ic("settings-outline", activeTab === "settings")}
        <Text style={[s.label, activeTab === "settings" && s.active]}>設定</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  nav:    { flexDirection:"row", height:56, backgroundColor:"rgba(255,255,255,0.96)",
             borderTopWidth:1, borderTopColor:C.border },
  btn:    { flex:1, alignItems:"center", justifyContent:"center", gap:3 },
  label:  { fontFamily:F.condensedBlack, fontSize:9, letterSpacing:1.2,
             color:C.t3, textTransform:"uppercase" },
  active: { color:C.accent },
  addBtn: { width:42, height:42, borderRadius:21, backgroundColor:C.accent,
             alignItems:"center", justifyContent:"center" },
});
