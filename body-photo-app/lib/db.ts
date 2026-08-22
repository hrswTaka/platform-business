import { Platform } from "react-native";

export type BodyRecord = {
  date: string;            // "2026-05-23" 主キー（1日1記録）
  weight: number;          // kg 小数点1桁
  memo?: string;
  photoUri?: string | null; // ネイティブ: expo-file-system のローカルURI / Web: data URI（IndexedDB内）
};

export type RecordMap = Record<string, BodyRecord>;

// ---------------------------------------------------------------------------
// ネイティブ (iOS / Android): expo-sqlite
// Web (PWA): IndexedDB（写真は data URI としてレコード内に保存）
// どちらも端末ローカルのみ。クラウド同期は行わない。
// ---------------------------------------------------------------------------

const LEGACY_WEB_KEY = "physique.records.v1"; // 旧localStorage保存からの移行用

// ---- ネイティブ: expo-sqlite -------------------------------------------------

type Db = import("expo-sqlite").SQLiteDatabase;
let sqliteDb: Db | null = null;

function getSqlite(): Db {
  if (!sqliteDb) {
    const SQLite = require("expo-sqlite") as typeof import("expo-sqlite");
    sqliteDb = SQLite.openDatabaseSync("physique.db");
    sqliteDb.execSync(`
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
  return sqliteDb;
}

// ---- Web: IndexedDB ---------------------------------------------------------

const IDB_NAME = "physique";
const IDB_STORE = "records";
let idbPromise: Promise<IDBDatabase> | null = null;

function openIdb(): Promise<IDBDatabase> {
  if (!idbPromise) {
    idbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(IDB_STORE)) {
          req.result.createObjectStore(IDB_STORE, { keyPath: "date" });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    // ブラウザによるサイトデータ削除（写真消失）を防ぐため、恒久ストレージを要求する
    navigator.storage?.persist?.().catch(() => {});
  }
  return idbPromise;
}

function idbRequest<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
  const db = await openIdb();
  return db.transaction(IDB_STORE, mode).objectStore(IDB_STORE);
}

// 旧localStorage形式からの一度きりの移行
async function migrateLegacyWebStore() {
  try {
    const raw = globalThis.localStorage?.getItem(LEGACY_WEB_KEY);
    if (!raw) return;
    const legacy = JSON.parse(raw) as RecordMap;
    const store = await idbStore("readwrite");
    for (const record of Object.values(legacy)) store.put(record);
    globalThis.localStorage?.removeItem(LEGACY_WEB_KEY);
  } catch {
    // 移行失敗は無視（新規保存はIndexedDBに入る）
  }
}

// ---- 共通API ---------------------------------------------------------------

export async function getAllRecords(): Promise<RecordMap> {
  if (Platform.OS === "web") {
    await migrateLegacyWebStore();
    const store = await idbStore("readonly");
    const rows = await idbRequest(store.getAll() as IDBRequest<BodyRecord[]>);
    const map: RecordMap = {};
    for (const r of rows) map[r.date] = r;
    return map;
  }

  const rows = getSqlite().getAllSync<{
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

export async function upsertRecord(record: BodyRecord): Promise<void> {
  if (Platform.OS === "web") {
    const store = await idbStore("readwrite");
    await idbRequest(store.put(record));
    return;
  }
  getSqlite().runSync(
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

export async function deleteRecord(date: string): Promise<void> {
  if (Platform.OS === "web") {
    const store = await idbStore("readwrite");
    await idbRequest(store.delete(date));
    return;
  }
  getSqlite().runSync("DELETE FROM records WHERE date = ?", [date]);
}
