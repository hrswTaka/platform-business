import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppHeader } from "../components/AppHeader";
import { C, F } from "../constants/theme";

const PHOTOS: Record<string, {weight:number; color:string}> = {
  "2026-01-15": { weight:78.4, color:"#C5D8EC" },
  "2026-02-03": { weight:76.8, color:"#D4C5E0" },
  "2026-03-12": { weight:74.5, color:"#B8D8BE" },
  "2026-04-20": { weight:72.9, color:"#DDD8B0" },
  "2026-05-10": { weight:72.1, color:"#DFC5C8" },
};

const { width: W } = Dimensions.get("window");

export function CompareScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const [layout, setLayout] = useState<"v"|"h">("v");
  const [sortMode, setSortMode] = useState<"date"|"weight">("date");

  function toggle(ds: string) {
    setSelected(prev =>
      prev.includes(ds) ? prev.filter(d=>d!==ds) : [...prev, ds]
    );
  }

  const sorted = [...selected].sort((a,b) => {
    if (sortMode === "weight")
      return (PHOTOS[b]?.weight||0) - (PHOTOS[a]?.weight||0);
    return a.localeCompare(b);
  });

  return (
    <View style={s.root}>
      <AppHeader />
      <ScrollView>
        {/* Date picker trigger */}
        <TouchableOpacity style={s.pickBtn}>
          <Ionicons name="calendar-outline" size={18} color={C.t3} />
          <Text style={s.pickTxt}>カレンダーで日付を選択</Text>
          <View style={[s.badge, selected.length > 0 && s.badgeActive]}>
            <Text style={[s.badgeTxt, selected.length > 0 && s.badgeTxtActive]}>
              {selected.length > 0 ? `${selected.length}枚` : "未選択"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Quick select from sample data */}
        <View style={s.quickRow}>
          <Text style={s.quickLabel}>サンプルから選択</Text>
          {Object.entries(PHOTOS).map(([ds]) => (
            <TouchableOpacity
              key={ds}
              style={[s.quickBtn, selected.includes(ds) && s.quickBtnActive]}
              onPress={() => toggle(ds)}
            >
              <Text style={[s.quickBtnTxt, selected.includes(ds) && s.quickBtnTxtActive]}>
                {ds.slice(5)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sort & layout toggles */}
        {selected.length > 0 && (
          <View style={s.sortRow}>
            <Text style={s.sortLabel}>並び替え</Text>
            {(["date","weight"] as const).map(mode => (
              <TouchableOpacity
                key={mode}
                style={[s.pill, sortMode===mode && s.pillActive]}
                onPress={() => setSortMode(mode)}
              >
                <Text style={[s.pillTxt, sortMode===mode && s.pillTxtActive]}>
                  {mode==="date" ? "日付順" : "体重順"}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={{flex:1}} />
            {(["v","h"] as const).map(l => (
              <TouchableOpacity
                key={l}
                style={[s.layoutBtn, layout===l && s.layoutBtnActive]}
                onPress={() => setLayout(l)}
              >
                <Ionicons
                  name={l==="v" ? "reorder-four-outline" : "grid-outline"}
                  size={14}
                  color={layout===l ? "#fff" : C.t3}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Compare result */}
        <View style={[s.result, layout==="h" && s.resultH]}>
          {sorted.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyTxt}>日付を選択してください</Text>
            </View>
          ) : layout === "h" ? (
            sorted.map((ds, i) => {
              const rec = PHOTOS[ds];
              const label = sorted.length===1?"RECORD":i===0?"BEFORE":i===sorted.length-1?"AFTER":`STEP ${i+1}`;
              return (
                <View key={ds} style={[s.photoH, {backgroundColor: rec.color}]}>
                  <View style={s.badge2}>
                    <Text style={s.b2Tag}>{label}</Text>
                    <Text style={s.b2Wt}>{rec.weight}kg</Text>
                    <Text style={s.b2Date}>{ds.replace(/-/g,".")}</Text>
                  </View>
                </View>
              );
            })
          ) : (
            sorted.map((ds, i) => {
              const rec = PHOTOS[ds];
              const label = sorted.length===1?"RECORD":i===0?"BEFORE":i===sorted.length-1?"AFTER":`STEP ${i+1}`;
              return (
                <View key={ds}>
                  <View style={[s.photoV, {backgroundColor: rec.color}]}>
                    <View style={s.badge2}>
                      <Text style={s.b2Tag}>{label}</Text>
                      <Text style={s.b2Wt}>{rec.weight}kg</Text>
                      <Text style={s.b2Date}>{ds.replace(/-/g,".")}</Text>
                    </View>
                  </View>
                  {i < sorted.length-1 && <View style={s.divider} />}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:     { flex:1, backgroundColor:C.bg },

  pickBtn:  { flexDirection:"row", alignItems:"center", gap:10,
               marginHorizontal:20, marginTop:16, marginBottom:4,
               paddingVertical:15, paddingHorizontal:18,
               backgroundColor:C.surf1, borderWidth:1.5, borderStyle:"dashed",
               borderColor:C.borderHi, borderRadius:14 },
  pickTxt:  { flex:1, fontSize:14, fontWeight:"600", color:C.t2 },
  badge:    { backgroundColor:C.surf3, borderRadius:100, paddingHorizontal:10, paddingVertical:3 },
  badgeActive:{ backgroundColor:C.accent },
  badgeTxt: { fontFamily:F.mono, fontSize:10, fontWeight:"600", color:C.t3 },
  badgeTxtActive:{ color:"#fff" },

  quickRow: { flexDirection:"row", flexWrap:"wrap", gap:6,
               paddingHorizontal:20, paddingVertical:12, alignItems:"center" },
  quickLabel:{ fontSize:9, fontWeight:"700", textTransform:"uppercase", letterSpacing:1.5,
                color:C.t3, marginRight:4 },
  quickBtn: { paddingHorizontal:10, paddingVertical:5, borderRadius:8,
               borderWidth:1, borderColor:C.border, backgroundColor:C.surf2 },
  quickBtnActive:{ backgroundColor:C.accent, borderColor:C.accent },
  quickBtnTxt:{ fontFamily:F.mono, fontSize:11, color:C.t2 },
  quickBtnTxtActive:{ color:"#fff" },

  sortRow:  { flexDirection:"row", alignItems:"center", gap:6,
               paddingHorizontal:20, marginBottom:12 },
  sortLabel:{ fontSize:9, fontWeight:"700", textTransform:"uppercase",
               letterSpacing:1.5, color:C.t3, marginRight:2 },
  pill:     { paddingHorizontal:13, paddingVertical:5, borderRadius:8,
               borderWidth:1, borderColor:C.border, backgroundColor:C.surf2 },
  pillActive:{ backgroundColor:C.accent, borderColor:C.accent },
  pillTxt:  { fontSize:11, fontWeight:"700", color:C.t3 },
  pillTxtActive:{ color:"#fff" },
  layoutBtn:{ width:32, height:28, borderRadius:8, alignItems:"center", justifyContent:"center",
               borderWidth:1, borderColor:C.border, backgroundColor:C.surf2 },
  layoutBtnActive:{ backgroundColor:C.accent, borderColor:C.accent },

  result:   { marginHorizontal:20, marginBottom:24, borderWidth:1,
               borderColor:C.border, borderRadius:20, overflow:"hidden",
               backgroundColor:C.surf1 },
  resultH:  { flexDirection:"row" },
  empty:    { paddingVertical:48, paddingHorizontal:20, alignItems:"center" },
  emptyTxt: { fontSize:13, color:C.t3 },
  photoV:   { width:"100%", aspectRatio:16/9, justifyContent:"flex-end", padding:12 },
  photoH:   { flex:1, aspectRatio:3/4, justifyContent:"flex-end", padding:8 },
  divider:  { height:1, backgroundColor:C.border },
  badge2:   { backgroundColor:"rgba(255,255,255,0.82)", borderRadius:10,
               paddingVertical:8, paddingHorizontal:12,
               borderWidth:1, borderColor:"rgba(0,0,0,0.1)" },
  b2Tag:    { fontSize:8, fontWeight:"700", textTransform:"uppercase",
               letterSpacing:2, color:C.t3, marginBottom:2 },
  b2Wt:    { fontFamily:F.condensedExtraBold, fontSize:24, color:C.t1, lineHeight:26 },
  b2Date:  { fontFamily:F.mono, fontSize:10, color:C.t3 },
});
