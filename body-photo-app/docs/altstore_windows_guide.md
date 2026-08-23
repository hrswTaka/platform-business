# PHYSIQUEをiPhoneに無料インストールする完全ガイド（Windows版・0から）

GitHubにあるソースコードから、Apple Developer Program（¥14,900/年）に加入せず、無料のApple IDだけでiPhoneにネイティブアプリをインストールして使うまでの全手順。

## 全体像

```
【Part 0】必要なものを揃える（アカウント・ソフト）
   ↓
【Part 1】GitHub Actionsでソースからアプリ（IPA）をビルドする ← Mac不要・ブラウザだけ
   ↓
【Part 2】Windows PCにApple製ソフト+AltServerを入れる（初回のみ・約30分）
   ↓
【Part 3】iPhoneにAltStoreアプリを入れる（初回のみ）
   ↓
【Part 4】AltStoreでIPAをインストール
   ↓
【Part 5】7日ごとの再署名（家のWi-Fiで自動）
   ↓
【Part 6】アプリを更新するとき
```

## 制約（先に理解しておくこと）

| 制約 | 内容 |
|---|---|
| 7日で署名失効 | 期限が切れるとアプリが起動できなくなる（**データは消えない**）。AltServer起動中のPCと同じWi-Fiにいれば自動更新される |
| 同時3アプリまで | 無料Apple IDでサイドロードできるアプリは同時に3つまで（AltStore自身も1つ分を消費） |
| 週10 App IDまで | 1週間に新規登録できるアプリIDは10個まで（通常の使い方では問題にならない） |

---

## Part 0: 必要なもの

### ハードウェア
- [ ] Windows PC（Windows 10以降）
- [ ] iPhone本体
- [ ] USBケーブル（iPhoneとPCを接続できるもの。初回のみ使用）

### アカウント（すべて無料）
- [ ] **GitHubアカウント** … https://github.com/signup で作成。ソースのビルドに使う
  - リポジトリ `hrswTaka/platform-business` は公開されているので、閲覧・Fork に権限は不要
  - **Actionsを実行するには自分のアカウントにForkする**（後述）か、リポジトリ所有者に共同編集者（Collaborator）として招待してもらう
- [ ] **Apple ID** … iPhoneで使っているものでOK（二要素認証が有効であること）。心配なら専用のサブIDを新規作成してもよい

### Windowsに入れるソフト（Part 2で詳述）
- [ ] iTunes（Apple公式サイト版）
- [ ] iCloud（Apple公式サイト版）
- [ ] AltServer

> 開発（コード修正）までWindowsでやりたい場合は、追加で Git・Node.js が必要。付録Aを参照。**使うだけなら不要**。

---

## Part 1: GitHubのソースからIPAをビルドする（Mac不要）

iPhoneアプリのビルドには本来Macが必要だが、GitHubの「Actions」機能がクラウド上のMacを無料で貸してくれる（公開リポジトリは無料枠）。リポジトリにはビルド用ワークフロー `.github/workflows/build-ios-ipa.yml` が用意済みなので、**ブラウザ操作だけでIPAが手に入る**。

> このワークフローは動作確認済み（約9分で 13MB の `physique.ipa` が生成される）。

### 1-1. リポジトリを開く

- リポジトリ所有者本人の場合: https://github.com/hrswTaka/platform-business をそのまま使う
- 共同創業者・テスターの場合: 上記ページ右上の「**Fork**」を押して自分のアカウントにコピーする（Forkした側のリポジトリでActionsを実行する。初回はActionsタブで「I understand my workflows, go ahead and enable them」を押して有効化）

### 1-2. ワークフローを実行

1. リポジトリの「**Actions**」タブを開く
2. 左のリストから「**Build iOS IPA (unsigned, for AltStore)**」を選択
3. 右側の「**Run workflow**」ボタン → ブランチ `main` のまま「Run workflow」
4. 15〜25分待つ（ページを更新すると進行状況が見える。緑のチェックになったら完了）

### 1-3. IPAをダウンロード

1. 完了した実行（緑チェックの行）をクリック
2. ページ下部の「**Artifacts**」にある `physique-ipa` をクリックしてダウンロード
3. ZIPを解凍すると `physique.ipa` が出てくる

### 1-4. IPAをiPhoneに送る

`physique.ipa` をiPhoneの「ファイル」アプリに保存できればどんな方法でもよい。例:

- OneDrive / Googleドライブに上げて、iPhoneの対応アプリから「ファイルに保存」
- LINEの「Keep」やメール添付で自分宛てに送り、iPhoneで開いて「ファイルに保存」

> このIPAは**未署名**。Part 4でAltStoreがあなたのApple IDで署名し直すので、このままでよい。

---

## Part 2: Windows PCの準備（初回のみ）

### 2-1. iTunes をインストール

- **必ずApple公式サイト版を使うこと。Microsoft Store版は不可**（AltServerが認識できない）
- ダウンロード: https://support.apple.com/ja-jp/108351 の「Windows用iTunes」→「Apple の Web サイトから入手」
- すでにMicrosoft Store版が入っている場合は、アンインストールしてから公式サイト版を入れ直す

### 2-2. iCloud をインストール

- こちらも **Apple公式サイト版**（Microsoft Store版は不可）
- ダウンロード: https://support.apple.com/ja-jp/103232 内の「Windows 用 iCloud」（apple.com 直配布のインストーラ）

### 2-3. AltServer をインストール

1. https://altstore.io/ を開く
2. 「Download AltServer (Windows)」でZIPをダウンロード
3. 解凍して `setup.exe` を実行
4. インストール後、スタートメニューから **AltServer** を起動（タスクトレイに菱形のアイコンが常駐する）

### 2-4. Apple IDの「App用パスワード」を発行（推奨）

AltServerにApple IDのパスワードを直接入れたくない場合に使う。

1. https://account.apple.com/ にサインイン
2. 「サインインとセキュリティ」→「App用パスワード」→「＋」
3. 名前（例: AltStore）を付けて発行された `xxxx-xxxx-xxxx-xxxx` を控える
4. 以後、AltServerのパスワード欄にはこれを入力する

> パスワードはAltServerからAppleに直接送られ、AltStoreの開発元サーバーには送信されない設計だが、心配ならサブのApple IDを作って使ってもよい（その場合3アプリ制限はそのIDに紐づく）。

---

## Part 3: iPhoneにAltStoreを入れる（初回のみ）

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

## Part 4: PHYSIQUEをインストール

1. iPhoneで **AltStore** を開く
2. 「My Apps」タブ → 左上の「＋」
3. ファイルアプリから `physique.ipa` を選択
4. Apple IDのサインインを求められたら入力
5. 1〜2分でホーム画面に **PHYSIQUE** が追加される

以後は普通のアプリとして起動できる。**オフラインでも動作**し、体重・写真データはすべて端末内（SQLite + アプリ専用フォルダ）に保存される。サーバーには一切送信されない。

---

## Part 5: 7日ごとの再署名（維持）

- **自動**: PCでAltServerが起動していて、iPhoneが同じWi-Fiにいれば、AltStoreがバックグラウンドで自動更新する
  - PCは常時起動が理想だが、週1回AltServerを起動した状態でiPhoneと同じWi-Fiにしばらくいればよい
- **手動**: AltStore → My Apps → PHYSIQUEの「**7 DAYS**」表示をタップで即時更新
- **期限切れになったら**: アプリが起動しなくなるが**データは無事**。上記の手動更新で復活する

外出先での利用: 一度インストールすれば**iPhone単体でどこでも動く**（PC・Wi-Fi不要）。7日以内に自宅Wi-Fiに戻る生活なら実用上問題ない。

---

## Part 6: アプリを更新するとき

ソースが更新されたら:

1. Forkして使っている場合: 自分のリポジトリの「Sync fork」ボタンで最新を取り込む
2. Part 1 と同じ手順でワークフローを再実行 → 新しい `physique.ipa` をダウンロード
3. AltStoreで新IPAをインストール（同じアプリIDなので**上書き更新**され、記録データはそのまま残る）

---

## トラブルシューティング

| 症状 | 対処 |
|---|---|
| Actionsタブにワークフローが出ない | Forkの場合は初回にActionsの有効化ボタンを押す。`main`ブランチに `.github/workflows/build-ios-ipa.yml` があるか確認 |
| ワークフローが赤×で失敗 | 実行ログを開いてエラー行を確認。依存関係の問題なら再実行（Re-run jobs）で直ることもある |
| AltServerがiPhoneを認識しない | iTunes/iCloudがMicrosoft Store版になっていないか確認。公式サイト版に入れ替える |
| Wi-Fi経由で更新されない | iTunesの「Wi-Fi経由でこのiPhoneと同期」が有効か確認。PCのファイアウォールでAltServerを許可 |
| インストール時に `Maximum App ID` エラー | 週10個の新規App ID制限。7日待つか、既存のサイドロードアプリを削除 |
| 「信頼されていないデベロッパ」で起動しない | 設定 → 一般 → VPNとデバイス管理 → プロファイルを信頼 |
| iOS 16+で起動しない | デベロッパモードがオンか確認（設定 → プライバシーとセキュリティ） |

---

## 付録A: Windowsで開発もしたい場合（使うだけなら不要）

コードを修正して動作確認するための環境。

1. **Git** をインストール: https://git-scm.com/download/win
2. **Node.js**（LTS版）をインストール: https://nodejs.org/ja
3. ソースを取得:
   ```
   git clone https://github.com/hrswTaka/platform-business.git
   cd platform-business\body-photo-app
   npm install
   ```
4. 開発サーバー起動: `npx expo start` → iPhoneの **Expo Go** アプリ（App Storeから無料入手）でQRを読むと、ビルドなしで即動作確認できる（同じWi-Fi内のみ）
5. 修正をコミット・プッシュしたら、Part 1の手順でIPAを作り直す

## 付録B: 手間を減らしたくなったら

- **SideStore**（AltStore派生）: 初回設定後はPCなしで再署名できるが、セットアップ難度が高い
- **Apple Developer Program（¥14,900/年）**: 7日制限・3アプリ制限が消え、TestFlightで配布可能に。ビルド・提出もEASクラウドで完結する。本気で使い続けるならこちらへの移行が最終的にはラク
