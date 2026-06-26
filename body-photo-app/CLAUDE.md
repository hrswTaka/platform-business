# 体重×写真記録アプリ（PHYSIQUE）

## プロジェクト概要

筋トレ・ダイエットを継続している人が体重と写真をセットで記録し、ビフォーアフターを視覚的に比較できるモバイルアプリ。

- **アプリ名**: PHYSIQUE
- **TODO・設計**: [TODO.md](./TODO.md)
- **デザインモックアップ**: [design-mockup.html](./design-mockup.html)

## 技術スタック

| 要素 | 採用 |
|---|---|
| フレームワーク | Expo（React Native）+ TypeScript |
| スタイル | NativeWind（Tailwind CSS for RN）|
| DB | expo-sqlite |
| 課金 | RevenueCat（`react-native-purchases`）|
| アナリティクス | PostHog（`posthog-react-native`）|
| 写真 | expo-image-picker + expo-file-system |
| 画像合成 | react-native-view-shot |
| CSV | Papa Parse |
| ルーティング | Expo Router（file-based）|

## 重要方針

- **写真はローカルのみ**: expo-sqlite + expo-file-system に保存。サーバーには一切送らない
- **ネイティブアプリ**: iOS / Android 両対応。App Store / Google Play 配布
- **モバイルファースト**: スマホ縦持ちレイアウト優先

## ディレクトリ構成（予定）

```
app/
  (tabs)/
    index.tsx         ← ホーム（記録一覧）
    gallery.tsx       ← ギャラリー
    settings.tsx      ← 設定・CSV・削除
  record/
    index.tsx         ← 新規記録追加
  compare/
    index.tsx         ← ビフォーアフター比較
lib/
  db.ts               ← expo-sqlite DB定義・CRUD
  export.ts           ← CSV/JSONエクスポートユーティリティ
components/
  RecordCard.tsx
  CompareView.tsx
  ShareExport.tsx
```

## コマンド

```bash
npx expo start          # 開発サーバー起動
npx expo run:ios        # iOS シミュレーター
npx expo run:android    # Android エミュレーター
eas build               # 本番ビルド（EAS Build）
eas submit              # ストア提出
```

## データモデル

```ts
interface BodyRecord {
  id: string       // UUID
  date: string     // "2026-05-23"
  weight: number   // 体重 kg（小数点1桁）
  waist?: number   // ウエスト cm（オプション）
  photoUri?: string // expo-file-system 上のローカルURI
  note?: string    // メモ
  createdAt: number
}
```
