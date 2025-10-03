# Dify AI Platform - Next.js 15

Next.js 15とDify APIを統合した、ワークフローとチャットフロー対応のAIプラットフォームです。

## 🚀 特徴

### ワークフロー機能
- **ブロッキングモード**: 完全な応答を一度に受け取る同期処理
- **ストリーミングモード**: リアルタイムで応答を受け取る非同期処理
- **履歴管理**: LocalStorageを使用した会話履歴の保存・管理

### チャットフロー機能
- **リアルタイム会話**: ストリーミングAPIを使用した対話型AI
- **会話コンテキスト保持**: Dify conversation IDによる会話の継続
- **履歴管理**: 会話の保存と再開が可能

### UI/UX
- **Next.js 15最適化**: Turbopack、React 19、最新の機能を活用
- **高品質デザイン**: Tailwind CSS v4とRadix UIコンポーネント
- **レスポンシブ対応**: モバイル・デスクトップの両方に最適化
- **ダークモード対応**: システム設定に応じた自動切り替え

## 📋 前提条件

- Node.js 18.17以降
- npm または yarn、pnpm、bun
- Dify APIキーとエンドポイント

## 🛠️ セットアップ

### 1. リポジトリをクローン

```bash
git clone <repository-url>
cd dify-nextjs-sample
```

### 2. 依存関係をインストール

```bash
npm install
# または
yarn install
# または
pnpm install
```

### 3. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定:

```env
DIFY_API_KEY=your-dify-api-key
DIFY_API_URL=https://your-dify-instance.com/v1
```

### 4. 開発サーバーを起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認できます。

## 📂 プロジェクト構造

```
src/
├── app/
│   ├── api/                    # APIルート
│   │   ├── chatflow-streaming/ # チャットフローストリーミングAPI
│   │   ├── chatflow-blocking/  # チャットフローブロッキングAPI
│   │   ├── workflow-streaming/ # ワークフローストリーミングAPI
│   │   └── workflow-block/     # ワークフローブロッキングAPI
│   ├── (public)/               # 公開ページ
│   │   └── workflow/           # ワークフローページ
│   ├── chatflow/               # チャットフローページ
│   ├── history/                # 履歴ページ
│   ├── workflow/               # ワークフロー選択ページ
│   └── page.tsx                # ホームページ
├── components/
│   ├── ui/                     # Radix UI コンポーネント
│   ├── AppNav.tsx              # ナビゲーションメニュー
│   ├── ChatflowStreaming.tsx   # チャットフローコンポーネント
│   ├── WorkflowStreaming.tsx   # ワークフローストリーミング
│   └── WorkflowBlocking.tsx    # ワークフローブロッキング
└── lib/
    ├── history.ts              # 履歴管理ユーティリティ
    └── utils.ts                # 共通ユーティリティ
```

## 🎯 使用方法

### ワークフローの使用

1. ホームページから「ワークフロー」を選択
2. ブロッキングモードまたはストリーミングモードを選択
3. クエリを入力してAIの応答を取得
4. 「保存」ボタンで会話を保存

### チャットフローの使用

1. ホームページから「チャットフロー」を選択
2. メッセージを入力して会話を開始
3. 会話は自動的にコンテキストが保持される
4. 「保存」ボタンで会話を保存

### 履歴の確認

1. ナビゲーションメニューから「履歴」を選択
2. 過去の会話一覧を確認
3. フィルター機能でワークフロー/チャットフローを絞り込み
4. 会話を選択して再開または削除

## 🔧 技術スタック

- **フレームワーク**: Next.js 15.5.4 (App Router)
- **ランタイム**: React 19.1.0
- **スタイリング**: Tailwind CSS v4
- **UIコンポーネント**: Radix UI
- **アイコン**: Lucide React
- **TypeScript**: v5
- **ビルドツール**: Turbopack

## 🚀 最適化機能

### Next.js 15の活用
- Turbopack有効化による高速ビルド
- React 19の最新機能
- 画像最適化（AVIF/WebP対応）
- パッケージインポート最適化

### パフォーマンス
- Server Components活用
- Suspenseによるローディング最適化
- LocalStorageによる高速な履歴管理
- ストリーミングAPIによるリアルタイムレスポンス

### セキュリティ
- セキュリティヘッダーの設定
- XSS対策
- CSRF対策

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。
