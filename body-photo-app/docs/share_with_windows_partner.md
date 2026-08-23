# 共同創業者（Windows）にPHYSIQUEを使ってもらう方法

## 前提

| | 環境 | 役割 |
|---|---|---|
| 自分 | **Mac** | 開発・ビルド担当 |
| 相手 | **Windows + iPhone** | 使う人（開発はしない） |

ポイントは「**ビルドは全部こちら（Mac / GitHub Actions）でやり、相手にはファイルかURLを渡すだけにする**」こと。相手のWindows PCに開発環境は不要。

---

## 方法の比較

| 方法 | 費用 | 相手の手間 | 7日制限 | ネイティブ |
|---|---|---|---|---|
| **A. AltStore（IPA配布）** | 無料 | 大（初回30分・PC設定必要） | あり | ○ |
| **B. PWA（URL共有）** | 無料 | **極小（URL開いて追加のみ）** | なし | △ |
| **C. TestFlight** | ¥14,900/年 | 小（招待メール→アプリ入れるだけ） | なし | ○ |

---

## 【推奨】まずBで配り、必要になったらCへ

### 理由

- **Aは相手の負担が重すぎる**。Windows側でiTunes/iCloudの公式版インストール、AltServer設定、Apple IDパスワード入力、7日ごとの再署名維持…と、使う側にこれを求めるのは現実的でない。しかも相手のPCが起動していないと署名が切れてアプリが動かなくなる
- **Bなら相手の作業は実質2ステップ**（URLを開く→ホーム画面に追加）。WindowsもUSBケーブルも一切関係ない
- 相手が本気で使い込むフェーズになったら、**¥14,900を払ってCに移行**すれば、招待メール1通で済むうえ制限もなくなる

---

## 方法B（推奨）: PWAで配る手順

### こちら（Mac）でやること

```bash
cd body-photo-app
npm run build:web          # dist/ にWeb版を書き出す
```

生成された `dist/` を GitHub Pages（gh-pages ブランチ）にデプロイする。
※以前実施済みなので再開はすぐできる。GitHubリポジトリの Settings → Pages で
　Source を `gh-pages` / `(root)` にすれば公開される。

公開URL: `https://hrswtaka.github.io/platform-business/`

### 相手にやってもらうこと（1分）

1. **iPhoneのSafari**で上記URLを開く（Chromeではなく必ずSafari）
2. 下部の共有ボタン（□に↑）→ **「ホーム画面に追加」**
3. ホーム画面の「PHYSIQUE」アイコンから起動

これだけ。アドレスバーのない全画面アプリとして動き、オフラインでも使える。データは相手の端末内にのみ保存される。

### 相手に伝える注意点

- **必ずSafariで開く**（他ブラウザだとホーム画面追加が正しく機能しない）
- 大事な記録なので、**時々バックアップを取る**（設定画面のバックアップ機能を実装したら案内する）
- 数ヶ月まったく開かないとiOSがデータを消す可能性がある（毎日使うなら問題なし）

### 更新するとき

こちらで `npm run build:web` → gh-pages に再デプロイするだけ。相手は次にアプリを開いたときに自動で最新版になる（**相手の操作は不要**）。これがPWA最大の利点。

---

## 方法A: どうしてもネイティブを無料で使いたい場合

相手のWindows環境でAltStoreを使う。手順の詳細は [altstore_windows_guide.md](./altstore_windows_guide.md) を参照。

### 役割分担

| 誰が | 何を |
|---|---|
| **こちら（Mac）** | IPAをビルドして相手に渡す |
| **相手（Windows）** | iTunes/iCloud/AltServer導入 → AltStore導入 → IPAインストール → 7日ごとの再署名維持 |

### こちらでのIPAビルド方法（2通り）

**① GitHub Actions（推奨・Mac不要なので相手も自力でできる）**

1. GitHubリポジトリの **Actions** タブ
2. 「Build iOS IPA (unsigned, for AltStore)」→ **Run workflow**
3. 完了後、**Artifacts** から `physique-ipa` をダウンロード → 解凍して `physique.ipa`

**② ローカルのMacでビルド**

```bash
cd body-photo-app
npx expo prebuild --platform ios --no-install
npx pod-install ios
xcodebuild -workspace ios/PHYSIQUE.xcworkspace -scheme PHYSIQUE \
  -configuration Release -sdk iphoneos -derivedDataPath build \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO CODE_SIGN_IDENTITY=""
mkdir -p Payload && cp -R build/Build/Products/Release-iphoneos/PHYSIQUE.app Payload/
zip -qry physique.ipa Payload
```

IPAはOneDrive・Googleドライブ・LINEなどで相手に送る。未署名でよい（AltStoreが相手のApple IDで署名し直す）。

### 更新するとき

新しいIPAを作って渡し直す → 相手がAltStoreで上書きインストール（データは残る）。**毎回この往復が発生する**のが方法Bとの大きな差。

---

## 方法C: 本格運用するなら（有料）

こちらが **Apple Developer Program（¥14,900/年）** に加入すれば：

- こちらで `eas build` → `eas submit` （Macでの作業。相手の環境は無関係）
- App Store Connectで相手のメールアドレスを**内部テスターとして招待**
- 相手は届いたメールから **TestFlight** アプリを入れてインストールするだけ
- **7日制限なし・審査なし（内部テスター）・自動アップデート対応**

相手の手間は方法Bと同程度に軽く、体験は完全なネイティブアプリ。将来App Store公開に進む場合も同じ土台が使える。

---

## 結論

```
今すぐ  →  B（PWA）で配る。相手の負担ほぼゼロ、更新もこちら側だけで完結
   ↓
本気で使い込む・アプリの性能に不満が出る
   ↓
¥14,900/年を払って C（TestFlight）へ移行
```

**Aは「相手も開発に関わっていて、無料でネイティブを試したい」場合に限った選択肢**と考えるのがよい。
