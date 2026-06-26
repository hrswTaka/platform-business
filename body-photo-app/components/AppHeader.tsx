import { StyleSheet, Text, View } from "react-native";
import { C, F } from "../constants/theme";

export function AppHeader() {
  const today = new Date();
  const label = `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,"0")}.${String(today.getDate()).padStart(2,"0")}`;

  return (
    <View style={s.header}>
      <Text style={s.wordmark}>PHY<Text style={s.accent}>SIQ</Text>UE</Text>
      <View style={s.chip}><Text style={s.chipTxt}>{label}</Text></View>
    </View>
  );
}

const s = StyleSheet.create({
  header:   { flexDirection:"row", alignItems:"center", justifyContent:"space-between",
               paddingHorizontal:20, paddingTop:16, paddingBottom:12,
               borderBottomWidth:1, borderBottomColor:C.border, backgroundColor:C.bg },
  wordmark: { fontFamily:F.condensedBlack, fontSize:24, letterSpacing:5, color:C.t1 },
  accent:   { color:C.accent },
  chip:     { backgroundColor:C.surf2, borderWidth:1, borderColor:C.border,
               borderRadius:8, paddingHorizontal:10, paddingVertical:5 },
  chipTxt:  { fontFamily:F.mono, fontSize:10, color:C.t3 },
});
