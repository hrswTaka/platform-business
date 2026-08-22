import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
          <View style={s.datePill}>
            <Text style={s.datePillTxt}>{y} · {m} · {d} {dow}</Text>
          </View>
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
    </View>
  );
}

const s = StyleSheet.create({
  root:       { flex:1, backgroundColor:C.bg },

  dateNav:    { flexDirection:"row", alignItems:"center",
                 paddingHorizontal:16, paddingTop:16, gap:8 },
  dateNavBtn: { width:34, height:34, alignItems:"center", justifyContent:"center",
                 borderRadius:10, backgroundColor:C.surf1, borderWidth:1, borderColor:C.border },
  datePill:   { flex:1, alignItems:"center", borderWidth:1, borderColor:C.border,
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
});
