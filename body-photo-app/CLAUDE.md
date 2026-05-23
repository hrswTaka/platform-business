# 体重×写真記録アプリ（PHYSIQUE）

## プロジェクト概要

筋トレ・ダイエットを継続している人が体重と写真をセットで記録し、ビフォーアフターを視覚的に比較できるPWAアプリ。

- **アプリ名**: PHYSIQUE
- **TODO・設計**: [TODO.md](./TODO.md)
- **デザインモックアップ**: [design-mockup.html](./design-mockup.html)

## 技術スタック

- **フレームワーク**: Next.js + TypeScript + Tailwind CSS
- **DB**: Dexie.js（IndexedDB — 写真はサーバーに送らない）
- **CSV**: Papa Parse
- **写真アップロード**: react-dropzone
- **Instagram画像出力**: html2canvas（Canvas APIによるクライアント側レンダリング）

## 重要方針

- **写真はローカルのみ**: IndexedDBに保存。サーバーには一切送らない
- **PWA**: PC Webブラウザ + スマホホーム画面追加を1コードでカバー
- **モバイルファースト**: max-width 390px基準、スマホ縦持ちレイアウト優先

## ディレクトリ構成（予定）

```
app/
  page.tsx          ← ホーム（記録一覧）
  record/
    page.tsx        ← 新規記録追加
  compare/
    page.tsx        ← ビフォーアフター比較
  settings/
    page.tsx        ← 設定・CSV・削除
lib/
  db.ts             ← Dexie.js DB定義
  export.ts         ← CSV/JSONエクスポートユーティリティ
components/
  RecordCard.tsx
  CompareView.tsx
  InstagramExport.tsx
```

## コマンド

```bash
npm run dev    # 開発サーバー起動（http://localhost:3000）
npm run build  # 本番ビルド
npm run start  # 本番サーバー起動
```

## データモデル

```ts
interface BodyRecord {
  id: string       // UUID
  date: string     // "2026-05-23"
  weight: number   // 体重 kg（小数点1桁）
  waist?: number   // ウエスト cm（オプション）
  photoBlob?: Blob // 写真（IndexedDB内のみ）
  note?: string    // メモ
  createdAt: number
}
```
