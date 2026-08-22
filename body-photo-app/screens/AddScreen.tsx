import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { C, F } from "../constants/theme";
import type { BodyRecord } from "../App";

const DOW_JP = ["日","月","火","水","木","金","土"];

interface Props { onSave: (record: BodyRecord) => void; }

export function AddScreen({ onSave }: Props) {
  const today = new Date();
  const [date, setDate] = useState(today);
  const [weight, setWeight] = useState("72.1");
  const [memo, setMemo] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  function prevDay() { const d=new Date(date); d.setDate(d.getDate()-1); setDate(d); }
  function nextDay() { const d=new Date(date); d.setDate(d.getDate()+1); setDate(d); }

  // カレンダーモーダル
  const [calOpen, setCalOpen] = useState(false);
  const [calYear, setCalYear] = useState(date.getFullYear());
  const [calMonth, setCalMonth] = useState(date.getMonth() + 1);

  function openCal() {
    setCalYear(date.getFullYear());
    setCalMonth(date.getMonth() + 1);
    setCalOpen(true);
  }
  function calPrevMonth() {
    if (calMonth === 1) { setCalYear(y => y - 1); setCalMonth(12); }
    else setCalMonth(m => m - 1);
  }
  function calNextMonth() {
    if (calMonth === 12) { setCalYear(y => y + 1); setCalMonth(1); }
    else setCalMonth(m => m + 1);
  }
  function pickDay(day: number) {
    setDate(new Date(calYear, calMonth - 1, day));
    setCalOpen(false);
  }

  const calFirstDay = new Date(calYear, calMonth - 1, 1).getDay();
  const calDays = new Date(calYear, calMonth, 0).getDate();
  const calCells: (number|null)[] = [
    ...Array(calFirstDay).fill(null),
    ...Array.from({length: calDays}, (_, i) => i + 1),
  ];

  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,"0");
  const d = String(date.getDate()).padStart(2,"0");
  const dow = DOW_JP[date.getDay()];
  const dateKey = `${y}-${m}-${d}`;
  const canSave = Number.isFinite(parseFloat(weight));

  async function pickPhoto() {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.85,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  function save() {
    const parsedWeight = parseFloat(weight);
    if (!Number.isFinite(parsedWeight)) return;
    onSave({
      date: dateKey,
      weight: Number(parsedWeight.toFixed(1)),
      memo: memo.trim(),
      photoUri,
    });
  }

  return (
    <View style={s.root}>
      <ScrollView keyboardShouldPersistTaps="handled">

        {/* Date navigator */}
        <View style={s.dateNav}>
          <TouchableOpacity style={s.dateNavBtn} onPress={prevDay}>
            <Ionicons name="chevron-back" size={18} color={C.t2} />
          </TouchableOpacity>
          <TouchableOpacity style={s.datePill} onPress={openCal} activeOpacity={0.75}>
            <Ionicons name="calendar-outline" size={14} color={C.t3} />
            <Text style={s.datePillTxt}>{y} · {m} · {d} {dow}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.dateNavBtn} onPress={nextDay}>
            <Ionicons name="chevron-forward" size={18} color={C.t2} />
          </TouchableOpacity>
        </View>

        <Text style={s.prevHint}>
          前回は <Text style={s.prevHintBold}>71.7kg</Text> でした
        </Text>

        {/* Form rows */}
        <View style={s.formRows}>

          {/* 体重 */}
          <View style={s.row}>
            <Text style={s.rowLbl}>体重</Text>
            <View style={s.rowBody}>
              <View style={s.wtRow}>
                <TextInput
                  style={s.wtInput}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                  selectTextOnFocus
                />
                <Text style={s.wtUnit}>kg</Text>
              </View>
            </View>
          </View>

          {/* 写真 */}
          <View style={s.row}>
            <Text style={s.rowLbl}>写真</Text>
            <View style={s.rowBody}>
              {photoUri ? (
                <View style={s.photoPreviewWrap}>
                  <View style={s.photoPreviewFrame}>
                    <Image source={{ uri: photoUri }} style={s.photoPreview} resizeMode="contain" />
                  </View>
                  <TouchableOpacity style={s.photoChangeBtn} onPress={pickPhoto}>
                    <Ionicons name="refresh-outline" size={14} color={C.t2} />
                    <Text style={s.photoBtnTxt}>変更</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={s.photoBtn} onPress={pickPhoto}>
                  <Ionicons name="camera-outline" size={16} color={C.t2} />
                  <Text style={s.photoBtnTxt}>タップして追加</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* メモ */}
          <View style={s.row}>
            <Text style={s.rowLbl}>メモ</Text>
            <View style={s.rowBody}>
              <TextInput
                style={s.memoInput}
                value={memo}
                onChangeText={setMemo}
                placeholder="未入力"
                placeholderTextColor={C.t3}
              />
            </View>
          </View>

        </View>

        <TouchableOpacity
          style={[s.saveBtn, !canSave && s.saveBtnDisabled]}
          onPress={save}
          activeOpacity={0.85}
          disabled={!canSave}
        >
          <Text style={s.saveTxt}>記録を保存</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* 日付選択カレンダー */}
      <Modal
        visible={calOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCalOpen(false)}
      >
        <View style={s.modalRoot}>
          <Pressable style={s.scrim} onPress={() => setCalOpen(false)} />
          <View style={s.sheet}>
            <View style={s.sheetHandle} />
            <View style={s.calNav}>
              <TouchableOpacity style={s.calNavBtn} onPress={calPrevMonth}>
                <Ionicons name="chevron-back" size={18} color={C.t2} />
              </TouchableOpacity>
              <Text style={s.calTitle}>{calYear}年{calMonth}月</Text>
              <TouchableOpacity style={s.calNavBtn} onPress={calNextMonth}>
                <Ionicons name="chevron-forward" size={18} color={C.t2} />
              </TouchableOpacity>
            </View>

            <View style={s.dowRow}>
              {DOW_JP.map((dowLabel, i) => (
                <Text
                  key={dowLabel}
                  style={[
                    s.dowCell,
                    i === 0 && {color:"rgba(229,57,53,0.65)"},
                    i === 6 && {color:"rgba(25,118,210,0.65)"},
                  ]}
                >
                  {dowLabel}
                </Text>
              ))}
            </View>

            <View style={s.calGrid}>
              {calCells.map((day, i) => {
                if (day === null) return <View key={`empty-${i}`} style={[s.calCell, s.calEmpty]} />;
                const isPicked =
                  calYear === date.getFullYear() &&
                  calMonth === date.getMonth() + 1 &&
                  day === date.getDate();
                return (
                  <TouchableOpacity
                    key={day}
                    style={[s.calCell, isPicked && s.calPicked]}
                    activeOpacity={0.72}
                    onPress={() => pickDay(day)}
                  >
                    <Text style={[s.calDay, isPicked && s.calDayPicked]}>{day}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root:       { flex:1, backgroundColor:C.bg },

  dateNav:    { flexDirection:"row", alignItems:"center",
                 paddingHorizontal:16, paddingTop:16, gap:8 },
  dateNavBtn: { width:34, height:34, alignItems:"center", justifyContent:"center",
                 borderRadius:10, backgroundColor:C.surf1, borderWidth:1, borderColor:C.border },
  datePill:   { flex:1, flexDirection:"row", alignItems:"center", justifyContent:"center",
                 gap:6, borderWidth:1, borderColor:C.border,
                 borderRadius:100, paddingVertical:9, backgroundColor:C.surf1 },
  datePillTxt:{ fontFamily:F.mono, fontSize:13, fontWeight:"600", color:C.t1 },

  prevHint:   { textAlign:"center", paddingVertical:9, paddingBottom:14,
                 fontSize:13, color:C.t3 },
  prevHintBold:{ fontFamily:F.condensedExtraBold, fontSize:18, color:C.t2 },

  formRows:   { borderTopWidth:1, borderTopColor:C.border },
  row:        { flexDirection:"row", alignItems:"center",
                 paddingHorizontal:20, paddingVertical:15,
                 borderBottomWidth:1, borderBottomColor:C.border },
  rowLbl:     { fontSize:14, fontWeight:"600", color:C.t1, width:44 },
  rowBody:    { flex:1 },

  wtRow:      { flexDirection:"row", alignItems:"baseline", gap:6 },
  wtInput:    { fontFamily:F.condensedExtraBold, fontSize:34, color:C.t1,
                 backgroundColor:C.surf1, borderWidth:1, borderColor:C.border,
                 borderRadius:10, paddingVertical:6, paddingHorizontal:10,
                 width:130, textAlign:"center" },
  wtUnit:     { fontFamily:F.condensedExtraBold, fontSize:18, color:C.t3 },
  photoBtn:       { flexDirection:"row", alignItems:"center", gap:8,
                     backgroundColor:C.surf1, borderWidth:1, borderColor:C.border,
                     borderRadius:10, paddingVertical:9, paddingHorizontal:12 },
  photoBtnTxt:    { fontSize:12, fontWeight:"600", color:C.t2 },
  photoPreviewWrap:{ flexDirection:"row", alignItems:"center", gap:12 },
  photoPreviewFrame:{ width:86, height:72, borderRadius:8, backgroundColor:C.surf2,
                       overflow:"hidden", alignItems:"center", justifyContent:"center" },
  photoPreview:   { width:"100%", height:"100%" },
  photoChangeBtn: { flexDirection:"row", alignItems:"center", gap:6,
                     backgroundColor:C.surf1, borderWidth:1, borderColor:C.border,
                     borderRadius:8, paddingVertical:7, paddingHorizontal:10 },

  memoInput:  { fontSize:14, color:C.t1 },

  saveBtn:    { marginHorizontal:20, marginTop:24, marginBottom:40,
                 backgroundColor:C.accent, borderRadius:100, paddingVertical:18,
                 alignItems:"center" },
  saveBtnDisabled:{ opacity:0.45 },
  saveTxt:    { fontFamily:F.condensedBlack, fontSize:20, color:"#fff", letterSpacing:2 },

  modalRoot:{ flex:1, justifyContent:"flex-end" },
  scrim:    { position:"absolute", top:0, right:0, bottom:0, left:0,
               backgroundColor:"rgba(0,0,0,0.38)" },
  sheet:    { backgroundColor:C.bg, borderTopLeftRadius:24, borderTopRightRadius:24,
               paddingHorizontal:20, paddingTop:10, paddingBottom:28,
               borderTopWidth:1, borderColor:C.border },
  sheetHandle:{ alignSelf:"center", width:38, height:4, borderRadius:2,
                 backgroundColor:C.surf3, marginBottom:14 },
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
  calCell:  { width:"14.2857%", height:44, borderRightWidth:1, borderBottomWidth:1,
               borderColor:C.border, alignItems:"center", justifyContent:"center",
               backgroundColor:C.bg },
  calEmpty: { backgroundColor:C.surf1 },
  calPicked:{ backgroundColor:C.accent },
  calDay:   { fontSize:13, fontWeight:"600", color:C.t2 },
  calDayPicked:{ color:"#fff", fontWeight:"700" },
});
