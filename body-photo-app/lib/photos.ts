import { Platform } from "react-native";

// 写真は端末内（アプリ専用の Documents/photos/）にのみ保存する。
// image-picker が返す URI はキャッシュ領域でOSに消されうるため、ここで恒久領域へコピーする。

function photosDir() {
  const { Directory, Paths } = require("expo-file-system") as typeof import("expo-file-system");
  const dir = new Directory(Paths.document, "photos");
  if (!dir.exists) dir.create({ intermediates: true });
  return dir;
}

export function persistPhoto(tempUri: string, date: string): string {
  // Web プレビューでは blob/data URI をそのまま使う（開発確認用）
  if (Platform.OS === "web") return tempUri;

  const { File } = require("expo-file-system") as typeof import("expo-file-system");
  const ext = tempUri.split(".").pop()?.toLowerCase() ?? "jpg";
  const dest = new File(photosDir(), `${date}_${Date.now()}.${ext}`);
  new File(tempUri).copy(dest);
  return dest.uri;
}

export function deletePhoto(uri: string | null | undefined) {
  if (!uri || Platform.OS === "web") return;
  try {
    const { File } = require("expo-file-system") as typeof import("expo-file-system");
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // 写真削除の失敗は記録操作を妨げない
  }
}
