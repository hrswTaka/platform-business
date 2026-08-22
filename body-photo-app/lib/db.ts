import { Platform } from "react-native";

export type BodyRecord = {
  date: string;            // "2026-05-23" 主キー（1日1記録）
  weight: number;          // kg 小数点1桁
  memo?: string;
  photoUri?: string | null; // 端末ローカルURI（expo-file-system）。サーバーには送らない
};

export type RecordMap = Record<string, BodyRecord>;

// ---------------------------------------------------------------------------
// ネイティブ (iOS / Android): expo-sqlite
// Web (開発プレビュー用): localStorage フォールバック
// どちらも端末ローカルのみ。クラウド同期は行わない。
// ---------------------------------------------------------------------------

const WEB_STORAGE_KEY = "physique.records.v1";

type Db = import("expo-sqlite").SQLiteDatabase;
let db: Db | null = null;

function getDb(): Db {
  if (!db) {
    const SQLite = require("expo-sqlite") as typeof import("expo-sqlite");
    db = SQLite.openDatabaseSync("physique.db");
    db.execSync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS records (
        date       TEXT PRIMARY KEY NOT NULL,
        weight     REAL NOT NULL,
        memo       TEXT,
        photo_uri  TEXT,
        updated_at INTEGER NOT NULL
      );
    `);
  }
  return db;
}

function readWebStore(): RecordMap {
  try {
    const raw = globalThis.localStorage?.getItem(WEB_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RecordMap) : {};
  } catch {
    return {};
  }
}

function writeWebStore(records: RecordMap) {
  globalThis.localStorage?.setItem(WEB_STORAGE_KEY, JSON.stringify(records));
}

export function getAllRecords(): RecordMap {
  if (Platform.OS === "web") return readWebStore();

  const rows = getDb().getAllSync<{
    date: string;
    weight: number;
    memo: string | null;
    photo_uri: string | null;
  }>("SELECT date, weight, memo, photo_uri FROM records");

  const map: RecordMap = {};
  for (const r of rows) {
    map[r.date] = {
      date: r.date,
      weight: r.weight,
      memo: r.memo ?? undefined,
      photoUri: r.photo_uri,
    };
  }
  return map;
}

export function upsertRecord(record: BodyRecord) {
  if (Platform.OS === "web") {
    const records = readWebStore();
    records[record.date] = record;
    writeWebStore(records);
    return;
  }
  getDb().runSync(
    `INSERT INTO records (date, weight, memo, photo_uri, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET
       weight = excluded.weight,
       memo = excluded.memo,
       photo_uri = excluded.photo_uri,
       updated_at = excluded.updated_at`,
    [record.date, record.weight, record.memo ?? null, record.photoUri ?? null, Date.now()],
  );
}

export function deleteRecord(date: string) {
  if (Platform.OS === "web") {
    const records = readWebStore();
    delete records[date];
    writeWebStore(records);
    return;
  }
  getDb().runSync("DELETE FROM records WHERE date = ?", [date]);
}
