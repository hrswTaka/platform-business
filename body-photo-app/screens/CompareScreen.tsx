import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { C, F } from "../constants/theme";
import type { BodyRecord } from "../App";

const DOW = ["日","月","火","水","木","金","土"];

function pad(n: number) { return String(n).padStart(2,"0"); }

interface Props {
  records: Record<string, BodyRecord>;
}

export function CompareScreen({ records }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [layout, setLayout] = useState<"v"|"h">("v");
  const [sortMode, setSortMode] = useState<"date"|"weight">("date");
  const [pickerOpen, setPickerOpen] = useState(false);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  function toggle(ds: string) {
    setSelected(prev =>
      prev.includes(ds) ? prev.filter(d=>d!==ds) : [...prev, ds]
    );
  }

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  }

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number|null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({length: daysInMonth}, (_, i) => i + 1),
  ];
  const ds = (d: number) => `${year}-${pad(month)}-${pad(d)}`;

  const photoRecords = Object.fromEntries(
    Object.entries(records).filter(([, record]) => !!record.photoUri)
  );
  const sorted = selected.filter(ds => photoRecords[ds]).sort((a,b) => {
    if (sortMode === "weight")
      return (photoRecords[b]?.weight||0) - (photoRecords[a]?.weight||0);
    return a.localeCompare(b);
  });

  return (
    <View style={s.root}>
      <ScrollView>
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
              <Text style={s.emptyTxt}>
                {Object.keys(photoRecords).length > 0 ? "右下のボタンから日付を選択" : "写真付きの記録がありません"}
              </Text>
            </View>
          ) : layout === "h" ? (
            sorted.map(ds => {
              const rec = photoRecords[ds];
              return (
                <View key={ds} style={s.itemHWrap}>
                  <View style={s.card}>
                    <View style={s.photoH}>
                      <Image source={{ uri: rec.photoUri || "" }} style={s.photoImg} resizeMode="contain" />
                    </View>
                    <View style={s.caption}>
                      <Text style={s.capWt}>{rec.weight}<Text style={s.capUnit}>kg</Text></Text>
                      <Text style={s.capDate}>{ds.replace(/-/g,".")}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            sorted.map(ds => {
              const rec = photoRecords[ds];
              return (
                <View key={ds} style={s.itemV}>
                  <View style={s.card}>
                    <View style={s.photoV}>
                      <Image source={{ uri: rec.photoUri || "" }} style={s.photoImg} resizeMode="contain" />
                    </View>
                    <View style={s.caption}>
                      <Text style={s.capWt}>{rec.weight}<Text style={s.capUnit}>kg</Text></Text>
                      <Text style={s.capDate}>{ds.replace(/-/g,".")}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Floating date picker button */}
      <TouchableOpacity style={s.fab} onPress={() => setPickerOpen(true)} activeOpacity={0.85}>
        <Ionicons name="calendar-outline" size={22} color="#fff" />
        {selected.length > 0 && (
          <View style={s.fabBadge}>
            <Text style={s.fabBadgeTxt}>{selected.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={pickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerOpen(false)}
      >
        <View style={s.modalRoot}>
          <Pressable style={s.scrim} onPress={() => setPickerOpen(false)} />
          <View style={s.sheet}>
            <View style={s.sheetHandle} />
            <View style={s.sheetHead}>
              <Text style={s.sheetTitle}>比較する日付</Text>
              <TouchableOpacity style={s.sheetClose} onPress={() => setPickerOpen(false)}>
                <Ionicons name="close" size={18} color={C.t2} />
              </TouchableOpacity>
            </View>

            <View style={s.calNav}>
              <TouchableOpacity style={s.calNavBtn} onPress={prevMonth}>
                <Ionicons name="chevron-back" size={18} color={C.t2} />
              </TouchableOpacity>
              <Text style={s.calTitle}>{year}年{month}月</Text>
              <TouchableOpacity style={s.calNavBtn} onPress={nextMonth}>
                <Ionicons name="chevron-forward" size={18} color={C.t2} />
              </TouchableOpacity>
            </View>

            <View style={s.dowRow}>
              {DOW.map((d, i) => (
                <Text
                  key={d}
                  style={[
                    s.dowCell,
                    i === 0 && {color:"rgba(229,57,53,0.65)"},
                    i === 6 && {color:"rgba(25,118,210,0.65)"},
                  ]}
                >
                  {d}
                </Text>
              ))}
            </View>

            <View style={s.calGrid}>
              {cells.map((d, i) => {
                if (d === null) return <View key={`empty-${i}`} style={[s.calCell, s.calEmpty]} />;
                const key = ds(d);
                const rec = photoRecords[key];
                const isSelected = selected.includes(key);
                return (
                  <TouchableOpacity
                    key={key}
                    style={[
                      s.calCell,
                      rec && s.calHasPhoto,
                      isSelected && s.calSelected,
                    ]}
                    disabled={!rec}
                    activeOpacity={rec ? 0.72 : 1}
                    onPress={() => toggle(key)}
                  >
                    <Text style={[s.calDay, isSelected && s.calDaySelected]}>{d}</Text>
                    {rec && (
                      <>
                        <View style={[s.photoDot, isSelected && s.photoDotSelected]} />
                        <Text style={[s.calWeight, isSelected && s.calWeightSelected]}>{rec.weight}</Text>
                      </>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={s.doneBtn} onPress={() => setPickerOpen(false)} activeOpacity={0.85}>
              <Text style={s.doneTxt}>{selected.length > 0 ? `${selected.length}枚で比較` : "閉じる"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root:     { flex:1, backgroundColor:C.bg },

  fab:      { position:"absolute", right:18, bottom:18, width:56, height:56,
               borderRadius:28, backgroundColor:C.accent,
               alignItems:"center", justifyContent:"center",
               shadowColor:"#000", shadowOpacity:0.25, shadowRadius:8,
               shadowOffset:{width:0, height:3}, elevation:6 },
  fabBadge: { position:"absolute", top:-4, right:-4, minWidth:22, height:22,
               borderRadius:11, backgroundColor:C.t1, paddingHorizontal:5,
               alignItems:"center", justifyContent:"center",
               borderWidth:2, borderColor:C.bg },
  fabBadgeTxt:{ fontFamily:F.mono, fontSize:11, fontWeight:"700", color:"#fff" },

  sortRow:  { flexDirection:"row", alignItems:"center", gap:6,
               paddingHorizontal:12, marginTop:10, marginBottom:10 },
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

  result:   { marginHorizontal:8, marginTop:8, marginBottom:90 },
  resultH:  { flexDirection:"row", flexWrap:"wrap", marginHorizontal:-4 },
  empty:    { paddingVertical:48, paddingHorizontal:20, alignItems:"center",
               borderWidth:1, borderColor:C.border, borderRadius:16,
               backgroundColor:C.surf1 },
  emptyTxt: { fontSize:13, color:C.t3 },
  itemV:    { marginBottom:14 },
  itemHWrap:{ width:"50%", paddingHorizontal:4, marginBottom:8 },
  card:     { borderWidth:1, borderColor:C.border, borderRadius:16,
               overflow:"hidden", backgroundColor:C.surf1 },
  photoV:   { width:"100%", aspectRatio:3/4, backgroundColor:C.bg },
  photoH:   { width:"100%", aspectRatio:3/4, backgroundColor:C.bg },
  photoImg: { width:"100%", height:"100%" },
  caption:  { flexDirection:"row", alignItems:"baseline", justifyContent:"center", gap:8,
               paddingVertical:7, backgroundColor:C.surf1,
               borderTopWidth:1, borderTopColor:C.border },
  capWt:    { fontFamily:F.condensedExtraBold, fontSize:18, color:C.t1, lineHeight:20 },
  capUnit:  { fontSize:11, color:C.t3 },
  capDate:  { fontFamily:F.mono, fontSize:10, color:C.t3 },

  modalRoot:{ flex:1, justifyContent:"flex-end" },
  scrim:    { position:"absolute", top:0, right:0, bottom:0, left:0,
               backgroundColor:"rgba(0,0,0,0.38)" },
  sheet:    { backgroundColor:C.bg, borderTopLeftRadius:24, borderTopRightRadius:24,
               paddingHorizontal:20, paddingTop:10, paddingBottom:22,
               borderTopWidth:1, borderColor:C.border },
  sheetHandle:{ alignSelf:"center", width:38, height:4, borderRadius:2,
                 backgroundColor:C.surf3, marginBottom:14 },
  sheetHead:{ flexDirection:"row", alignItems:"center", marginBottom:12 },
  sheetTitle:{ flex:1, fontFamily:F.condensedExtraBold, fontSize:24,
                letterSpacing:1, color:C.t1 },
  sheetClose:{ width:34, height:34, borderRadius:17, backgroundColor:C.surf1,
                alignItems:"center", justifyContent:"center", borderWidth:1, borderColor:C.border },

  calNav:   { flexDirection:"row", alignItems:"center", marginBottom:10 },
  calNavBtn:{ width:34, height:34, borderRadius:10, backgroundColor:C.surf1,
               borderWidth:1, borderColor:C.border, alignItems:"center", justifyContent:"center" },
  calTitle: { flex:1, textAlign:"center", fontFamily:F.condensedExtraBold,
               fontSize:20, letterSpacing:1, color:C.t1 },
  dowRow:   { flexDirection:"row", backgroundColor:C.surf1,
               borderTopLeftRadius:10, borderTopRightRadius:10, overflow:"hidden" },
  dowCell:  { width:"14.2857%", textAlign:"center", paddingVertical:7,
               fontSize:11, fontWeight:"700", color:C.t3 },
  calGrid:  { flexDirection:"row", flexWrap:"wrap", borderLeftWidth:1,
               borderTopWidth:1, borderColor:C.border },
  calCell:  { width:"14.2857%", height:48, borderRightWidth:1, borderBottomWidth:1,
               borderColor:C.border, alignItems:"center", justifyContent:"center",
               backgroundColor:C.bg },
  calEmpty: { backgroundColor:C.surf1 },
  calHasPhoto:{ backgroundColor:C.surf1 },
  calSelected:{ backgroundColor:C.accentDim },
  calDay:   { fontSize:13, fontWeight:"600", color:C.t2 },
  calDaySelected:{ color:C.accent },
  photoDot: { width:5, height:5, borderRadius:3, backgroundColor:C.accent,
               opacity:0.35, marginTop:3 },
  photoDotSelected:{ opacity:1 },
  calWeight:{ fontFamily:F.condensedExtraBold, fontSize:11, color:C.t2,
               lineHeight:13, marginTop:1 },
  calWeightSelected:{ color:C.accent },
  doneBtn:  { marginTop:16, backgroundColor:C.accent, borderRadius:100,
               paddingVertical:15, alignItems:"center" },
  doneTxt:  { fontFamily:F.condensedBlack, fontSize:18, color:"#fff", letterSpacing:1.5 },
});
