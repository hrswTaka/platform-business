import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppHeader } from "../components/AppHeader";
import { C, F } from "../constants/theme";
import type { BodyRecord } from "../App";

const DOW = ["日","月","火","水","木","金","土"];

function pad(n: number) { return String(n).padStart(2,"0"); }

interface Props {
  records: Record<string, BodyRecord>;
  focusDate?: string | null;
}

export function HomeScreen({ records, focusDate }: Props) {
  const { width } = useWindowDimensions();
  const photoWidth = Math.min(220, Math.max(160, width * 0.48));
  const TODAY = { y:2026, m:5, d:23 };
  const [year, setYear] = useState(TODAY.y);
  const [month, setMonth] = useState(TODAY.m);
  const [selected, setSelected] = useState<string|null>(null);

  useEffect(() => {
    if (!focusDate) return;
    const [nextYear, nextMonth] = focusDate.split("-").map(Number);
    if (!nextYear || !nextMonth) return;
    setYear(nextYear);
    setMonth(nextMonth);
    setSelected(focusDate);
  }, [focusDate]);

  const firstDay = new Date(year, month-1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  function prevMonth() {
    if (month===1) { setYear(y=>y-1); setMonth(12); } else setMonth(m=>m-1);
    setSelected(null);
  }
  function nextMonth() {
    if (month===12) { setYear(y=>y+1); setMonth(1); } else setMonth(m=>m+1);
    setSelected(null);
  }

  const ds = (d: number) => `${year}-${pad(month)}-${pad(d)}`;
  const isToday = (d: number) => year===TODAY.y && month===TODAY.m && d===TODAY.d;

  // Build grid cells: nulls for empty, numbers for days
  const cells: (number|null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({length: daysInMonth}, (_, i) => i+1),
  ];

  const selRecord = selected ? records[selected] : null;
  const selParts  = selected?.split("-");
  const selDow    = selected ? DOW[new Date(selected).getDay()] : null;

  return (
    <View style={s.root}>
      <AppHeader />

      {/* Month navigation */}
      <View style={s.monthNav}>
        <TouchableOpacity style={s.navBtn} onPress={prevMonth}>
          <Text style={s.navArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={s.monthTitle}>{year}年{month}月</Text>
        <TouchableOpacity style={s.navBtn} onPress={nextMonth}>
          <Text style={s.navArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setYear(TODAY.y); setMonth(TODAY.m); setSelected(null); }}>
          <Text style={s.todayBtn}>今日</Text>
        </TouchableOpacity>
      </View>

      {/* DOW header */}
      <View style={s.dowRow}>
        {DOW.map((d, i) => (
          <Text key={d} style={[s.dowCell,
            i===0 && {color:"rgba(229,57,53,0.65)"},
            i===6 && {color:"rgba(25,118,210,0.65)"},
          ]}>{d}</Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={s.grid}>
        {cells.map((d, i) => {
          if (d === null) return (
            <View key={`e${i}`} style={[s.cell, s.cellEmpty]} />
          );
          const key = ds(d);
          const record = records[key];
          const dow = i % 7;
          const today_ = isToday(d);
          const isSel  = key === selected;
          return (
            <TouchableOpacity
              key={key}
              style={[
                s.cell,
                today_ && s.cellToday,
                isSel  && s.cellSel,
                dow===0 && !today_ && !isSel && s.cellSun,
                dow===6 && !today_ && !isSel && s.cellSat,
              ]}
              onPress={() => record && setSelected(isSel ? null : key)}
              activeOpacity={record ? 0.7 : 1}
            >
              {today_ ? (
                <View style={s.todayCircle}><Text style={s.circleNum}>{d}</Text></View>
              ) : isSel ? (
                <View style={s.selCircle}><Text style={s.circleNum}>{d}</Text></View>
              ) : (
                <Text style={[s.dayNum,
                  dow===0 && {color:"rgba(229,57,53,0.85)"},
                  dow===6 && {color:"rgba(25,118,210,0.75)"},
                ]}>{d}</Text>
              )}
              {record && (
                <Text style={s.calWt}>{record.weight}<Text style={s.calWtUnit}>kg</Text></Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Day detail panel */}
      <View style={s.detail}>
        {!selected ? (
          <View style={s.detailEmpty}>
            <View style={s.emptyIcon}>
              <Ionicons name="calendar-outline" size={18} color={C.t3} />
            </View>
            <Text style={s.emptyTxt}>日付をタップ</Text>
          </View>
        ) : (
          <View style={s.detailContent}>
            <View style={s.detailLeft}>
              {selParts && (
                <Text style={s.detailDate}>
                  {selParts[0]}.{selParts[1]}.{selParts[2]}（{selDow}）
                </Text>
              )}
              {selRecord ? (
                <Text style={s.detailWt}>
                  {selRecord.weight}<Text style={s.detailWtUnit}>kg</Text>
                </Text>
              ) : (
                <Text style={s.noWeight}>記録なし</Text>
              )}
              {!!selRecord?.memo && <Text style={s.memoTxt}>{selRecord.memo}</Text>}
            </View>
            <View style={[s.detailRight, {width: photoWidth}]}>
              {selRecord?.photoUri ? (
                <View style={s.photoFrame}>
                  <Image source={{ uri: selRecord.photoUri }} style={s.photo} resizeMode="contain" />
                </View>
              ) : (
                <View style={s.noPhoto}>
                  <Ionicons name="camera-outline" size={24} color={C.t3} />
                  <Text style={s.noPhotoTxt}>写真なし</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const CELL_BORDER = "rgba(0,0,0,0.07)";

const s = StyleSheet.create({
  root:       { flex:1, backgroundColor:C.bg },

  monthNav:   { flexDirection:"row", alignItems:"center", height:40,
                 paddingHorizontal:14, borderBottomWidth:1, borderBottomColor:CELL_BORDER },
  navBtn:     { width:30, height:30, alignItems:"center", justifyContent:"center" },
  navArrow:   { fontSize:24, color:C.t2, lineHeight:28 },
  monthTitle: { flex:1, textAlign:"center", fontFamily:F.condensedExtraBold,
                 fontSize:22, letterSpacing:1, color:C.t1 },
  todayBtn:   { fontFamily:F.condensedExtraBold, fontSize:11, color:C.blue,
                 paddingHorizontal:6, paddingVertical:4 },

  dowRow:     { flexDirection:"row", backgroundColor:C.surf1,
                 borderBottomWidth:1, borderBottomColor:CELL_BORDER },
  dowCell:    { width:"14.2857%", textAlign:"center", paddingVertical:6,
                 fontSize:12, fontWeight:"700", color:C.t3 },

  grid:       { flexDirection:"row", flexWrap:"wrap",
                 borderLeftWidth:1, borderTopWidth:1, borderColor:CELL_BORDER },
  cell:       { width:"14.2857%", height:56, borderRightWidth:1, borderBottomWidth:1,
                 borderColor:CELL_BORDER, alignItems:"center",
                 paddingTop:4, paddingBottom:4, backgroundColor:C.bg },
  cellEmpty:  { backgroundColor:C.surf1 },
  cellToday:  { backgroundColor:"rgba(229,57,53,0.05)" },
  cellSel:    { backgroundColor:C.accentDim },
  cellSun:    { backgroundColor:"rgba(229,57,53,0.03)" },
  cellSat:    { backgroundColor:"rgba(25,118,210,0.03)" },

  dayNum:     { fontSize:15, fontWeight:"600", color:C.t2, lineHeight:20 },
  todayCircle:{ width:27, height:27, borderRadius:14, backgroundColor:C.red,
                 alignItems:"center", justifyContent:"center" },
  selCircle:  { width:27, height:27, borderRadius:14, backgroundColor:C.accent,
                 alignItems:"center", justifyContent:"center" },
  circleNum:  { fontSize:15, fontWeight:"700", color:"#fff" },
  calWt:      { fontFamily:F.condensedExtraBold, fontSize:13, color:C.t1, marginTop:"auto" },
  calWtUnit:  { fontSize:9, color:C.t3 },

  detail:     { flex:1, borderTopWidth:1, borderTopColor:C.border },
  detailEmpty:{ flex:1, alignItems:"center", justifyContent:"center", gap:8 },
  emptyIcon:  { width:36, height:36, backgroundColor:C.surf2, borderRadius:10,
                 alignItems:"center", justifyContent:"center" },
  emptyTxt:   { fontSize:12, fontWeight:"500", color:C.t3 },

  detailContent:{ flex:1, flexDirection:"row" },
  detailLeft: { flex:1, justifyContent:"center", paddingLeft:18, paddingRight:8, gap:6 },
  detailDate: { fontFamily:F.mono, fontSize:11, color:C.t3 },
  detailWt:   { fontFamily:F.condensedExtraBold, fontSize:52, color:C.t1, lineHeight:56 },
  detailWtUnit:{ fontFamily:F.condensedExtraBold, fontSize:20, color:C.t3 },
  noWeight:   { fontSize:13, color:C.t3 },
  memoTxt:     { fontSize:12, color:C.t2, lineHeight:18 },
  detailRight:{ marginVertical:14, marginRight:14 },
  noPhoto:    { flex:1, backgroundColor:C.surf1, borderWidth:2, borderStyle:"dashed",
                 borderColor:C.borderHi, borderRadius:12,
                 alignItems:"center", justifyContent:"center", gap:4 },
  photoFrame:  { flex:1, borderRadius:12, overflow:"hidden",
                 alignItems:"center", justifyContent:"center" },
  photo:       { width:"100%", height:"100%" },
  noPhotoTxt: { fontSize:11, color:C.t3 },
});
