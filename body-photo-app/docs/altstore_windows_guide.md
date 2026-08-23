# AltStoreでPHYSIQUEをiPhoneに無料インストールする手順（Windows版）

Apple Developer Program（¥14,900/年）に加入せず、無料のApple IDだけでiPhoneにネイティブアプリをインストールする手順。

## 全体像

```
【準備】Windows PCにApple製ソフト+AltServerを入れる（初回のみ・約30分）
   ↓
【導入】iPhoneにAltStoreアプリを入れる（初回のみ）
   ↓
【入手】PHYSIQUEのIPAファイルを用意する
   ↓
【インストール】AltStoreでIPAを開いてインストール
   ↓
【維持】7日ごとの再署名（家のWi-Fiで自動）
```

## 制約（先に理解しておくこと）

| 制約 | 内容 |
|---|---|
| 7日で署名失効 | 期限が切れるとアプリが起動できなくなる（**データは消えない**）。AltServer起動中のPCと同じWi-Fiにいれば自動更新される |
| 同時3アプリまで | 無料Apple IDでサイドロードできるアプリは同時に3つまで（AltStore自身も1つ分を消費） |
| 週10 App IDまで | 1週間に新規登録できるアプリIDは10個まで（通常の使い方では問題にならない） |

---

## Part 1: Windows PCの準備（初回のみ）

### 1-1. iTunes をインストール

- **必ずApple公式サイト版を使うこと。Microsoft Store版は不可**（AltServerが認識できない）
- ダウンロード: https://support.apple.com/ja-jp/108351 の「Windows用iTunes」→「Apple の Web サイトから入手」
- すでにMicrosoft Store版が入っている場合は、アンインストールしてから公式サイト版を入れ直す

### 1-2. iCloud をインストール

- こちらも **Apple公式サイト版**（Microsoft Store版は不可）
- ダウンロード: https://support.apple.com/ja-jp/103232 内の「Windows 用 iCloud」（apple.com 直配布のインストーラ）

### 1-3. AltServer をインストール

1. https://altstore.io/ を開く
2. 「Download AltServer (Windows)」でZIPをダウンロード
3. 解凍して `setup.exe` を実行
4. インストール後、スタートメニューから **AltServer** を起動（タスクトレイに菱形のアイコンが常駐する）

### 1-4. Apple IDの「App用パスワード」を発行（推奨）

AltServerにApple IDのパスワードを直接入れたくない場合に使う。

1. https://account.apple.com/ にサインイン
2. 「サインインとセキュリティ」→「App用パスワード」→「＋」
3. 名前（例: AltStore）を付けて発行された `xxxx-xxxx-xxxx-xxxx` を控える
4. 以後、AltServerのパスワード欄にはこれを入力する

> 二要素認証が有効なApple IDが必要。パスワードはAltServerからAppleに直接送られ、Alt Storeの開発元サーバーには送信されない設計だが、心配ならサブのApple IDを作って使ってもよい（その場合iPhone側の3アプリ制限はそのIDに紐づく）。

---

## Part 2: iPhoneにAltStoreを入れる（初回のみ）

1. iPhoneをUSBケーブルでPCに接続
2. iPhoneに「このコンピュータを信頼しますか?」→ **信頼** → パスコード入力
3. iTunesを起動し、iPhoneが認識されることを確認
   - ついでに iTunes の iPhone管理画面 → 概要 → 「**Wi-Fi経由でこのiPhoneと同期**」にチェックを入れて適用（後の自動再署名に必要）
4. タスクトレイのAltServerアイコンを右クリック → **Install AltStore** → 自分のiPhoneを選択
5. Apple IDとパスワード（App用パスワード）を入力
6. iPhoneのホーム画面に **AltStore** が追加される
7. iPhoneの 設定 → 一般 → **VPNとデバイス管理** → 自分のApple IDのプロファイルを開いて「**信頼**」
8. iOS 16以降の場合: 設定 → プライバシーとセキュリティ → **デベロッパモード** をオンにして再起動

---

## Part 3: PHYSIQUEのIPAファイルを用意する

> **注意**: EASのクラウドiOSビルドは有料のApple Developer Programが必要なため、無料ルートでは使えない。無料でIPAを作るには以下のいずれか。

### 方法a: Macを持っている人にビルドしてもらう（現状はこちら）

開発環境のMacで**未署名IPA**をビルドして受け取る（AltStoreがインストール時に自分のApple IDで署名し直すため、未署名でよい）。ビルドは開発側（Claude Code）に依頼すればよい。

### 方法b: GitHub Actionsで自動ビルド（Mac不要・完全Windows運用向け）

リポジトリ（public）のGitHub Actionsは**macOSランナーが無料**で使える。ワークフローを一度セットアップすれば、以後はGitHubのActionsページからIPAをダウンロードするだけになる。セットアップは開発側に依頼する。

どちらの場合も、手に入れた `physique.ipa` をiPhoneに渡す：

- OneDrive / Googleドライブ / LINEの「Keep」などでiPhoneへ送り、iPhoneの「ファイル」アプリに保存する

---

## Part 4: インストール

1. iPhoneで **AltStore** を開く
2. 「My Apps」タブ → 左上の「＋」
3. ファイルアプリから `physique.ipa` を選択
4. Apple IDのサインインを求められたら入力
5. 1〜2分でホーム画面に **PHYSIQUE** が追加される

以後は普通のアプリとして起動できる。**オフラインでも動作**し、体重・写真データはすべて端末内に保存される。

---

## Part 5: 7日ごとの再署名（維持）

- **自動**: PCでAltServerが起動していて、iPhoneが同じWi-Fiにいれば、AltStoreがバックグラウンドで自動更新する
  - PCは常時起動が理想だが、週1回AltServerを起動した状態でiPhoneと同じWi-Fiにしばらくいればよい
- **手動**: AltStore → My Apps → PHYSIQUEの「**7 DAYS**」表示をタップで即時更新
- **期限切れになったら**: アプリが起動しなくなるが**データは無事**。上記の手動更新で復活する

---

## トラブルシューティング

| 症状 | 対処 |
|---|---|
| AltServerがiPhoneを認識しない | iTunes/iCloudがMicrosoft Store版になっていないか確認。公式サイト版に入れ替える |
| 「Wi-Fi経由で更新されない」 | iTunesの「Wi-Fi経由でこのiPhoneと同期」が有効か確認。PCのファイアウォールでAltServerを許可 |
| インストール時に `Maximum App ID` エラー | 週10個の新規App ID制限。7日待つか、既存のサイドロードアプリを削除 |
| アプリが「信頼されていないデベロッパ」で起動しない | 設定 → 一般 → VPNとデバイス管理 → プロファイルを信頼 |
| iOS 16+で起動しない | デベロッパモードがオンか確認（設定 → プライバシーとセキュリティ） |

---

## 参考: 手間を減らしたくなったら

- **SideStore**（AltStore派生）: 初回設定後はPCなしで再署名できるが、セットアップ難度が高い
- **Apple Developer Program（¥14,900/年）**: 7日制限・3アプリ制限が消え、TestFlightで配布可能に。ビルドもEASクラウドで完結する。本気で使い続けるならこちらへの移行が最終的にはラク
