import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppHeader } from "../components/AppHeader";
import { C, F } from "../constants/theme";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type RowProps = {
  iconName: IoniconName;
  iconBg: string;
  title: string;
  sub: string;
  danger?: boolean;
};

function Row({ iconName, iconBg, title, sub, danger }: RowProps) {
  return (
    <TouchableOpacity style={s.row} activeOpacity={0.7}>
      <View style={[s.rowIco, {backgroundColor: iconBg}]}>
        <Ionicons name={iconName} size={17} color={danger ? C.red : C.t2} />
      </View>
      <View style={s.rowText}>
        <Text style={[s.rowTitle, danger && {color:C.red}]}>{title}</Text>
        <Text style={s.rowSub}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={14} color={C.t3} />
    </TouchableOpacity>
  );
}

export function SettingsScreen() {
  return (
    <View style={s.root}>
      <AppHeader />
      <ScrollView contentContainerStyle={s.content}>

        <Text style={s.sectionLbl}>データ管理</Text>
        <View style={s.list}>
          <Row iconName="download-outline" iconBg="rgba(200,255,51,0.13)"
               title="CSVエクスポート" sub="日付・体重データをダウンロード" />
          <Row iconName="cloud-upload-outline" iconBg="rgba(255,255,255,0.06)"
               title="全データをバックアップ" sub="写真含む全データをJSONで保存" />
        </View>

        <Text style={s.sectionLbl}>プライバシー・セキュリティ</Text>
        <View style={s.list}>
          <Row iconName="shield-checkmark-outline" iconBg="rgba(255,255,255,0.06)"
               title="プライバシーポリシー" sub="写真は端末内にのみ保存されます" />
          <Row iconName="trash-outline" iconBg="rgba(255,68,68,0.13)"
               title="全データを削除" sub="写真・記録をすべて消去する" danger />
        </View>

        <View style={s.sig}>
          <Text style={s.sigName}>PHY<Text style={{color:C.accent}}>SIQ</Text>UE</Text>
          <Text style={s.sigVer}>v0.1.0</Text>
          <View style={s.privacyNote}>
            <View style={s.privacyDot} />
            <Text style={s.privacyTxt}>写真はお使いの端末内にのみ保存されます</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:       { flex:1, backgroundColor:C.bg },
  content:    { padding:20, paddingBottom:40 },

  sectionLbl: { fontSize:10, fontWeight:"700", textTransform:"uppercase", letterSpacing:2,
                 color:C.t3, marginBottom:10 },
  list:       { backgroundColor:C.surf1, borderWidth:1, borderColor:C.border,
                 borderRadius:16, overflow:"hidden", marginBottom:24 },
  row:        { flexDirection:"row", alignItems:"center",
                 paddingVertical:15, paddingHorizontal:16,
                 borderBottomWidth:1, borderBottomColor:C.border },
  rowIco:     { width:36, height:36, borderRadius:10,
                 alignItems:"center", justifyContent:"center", marginRight:14 },
  rowText:    { flex:1 },
  rowTitle:   { fontSize:15, fontWeight:"600", color:C.t1 },
  rowSub:     { fontSize:11, color:C.t3, marginTop:1 },

  sig:        { alignItems:"center", marginTop:20 },
  sigName:    { fontFamily:F.condensedBlack, fontSize:22, letterSpacing:5, color:C.t3 },
  sigVer:     { fontFamily:F.mono, fontSize:10, color:C.t3, marginTop:4 },
  privacyNote:{ flexDirection:"row", alignItems:"center", gap:6, marginTop:12,
                 backgroundColor:C.surf1, borderWidth:1, borderColor:C.border,
                 borderRadius:100, paddingHorizontal:14, paddingVertical:6 },
  privacyDot: { width:6, height:6, borderRadius:3, backgroundColor:C.accent },
  privacyTxt: { fontSize:11, color:C.t3 },
});
