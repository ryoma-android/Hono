# Notion Clone

Notionのようなドキュメント管理アプリケーションです。Hono、Bun.js、Next.js 19、React 19を使用して構築されています。

## 機能

- 🔐 ユーザー認証（セッション管理）
- 📄 ドキュメント作成・編集・削除
- 📁 フォルダ管理
- 🎨 モダンなUI（Tailwind CSS）
- 📱 レスポンシブデザイン
- ⚡ 高速なAPI（Hono + Bun.js）

## 技術スタック

- **フロントエンド**: Next.js 19 + React 19 + App Router
- **バックエンド**: Hono + Bun.js
- **スタイリング**: Tailwind CSS
- **状態管理**: Zustand
- **認証**: セッション管理
- **言語**: TypeScript

## セットアップ

### 前提条件

- Node.js 18+ または Bun
- npm または yarn

### インストール

1. 依存関係をインストール:
```bash
npm install
```

2. 開発サーバーを起動:
```bash
# フロントエンド（Next.js）
npm run dev

# バックエンド（Hono API）
npm run api
```

3. ブラウザで http://localhost:3000 を開く

## プロジェクト構造

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # グローバルスタイル
│   ├── layout.tsx      # ルートレイアウト
│   └── page.tsx        # メインページ
├── api/                 # Hono API
│   ├── index.ts        # APIサーバー
│   └── routes/         # APIルート
├── components/          # Reactコンポーネント
│   ├── auth/           # 認証コンポーネント
│   └── providers.tsx   # プロバイダー
├── hooks/               # カスタムフック
├── lib/                 # ユーティリティ
└── types/               # TypeScript型定義
```

## 使用方法

1. **新規登録**: アカウントを作成
2. **ログイン**: 作成したアカウントでログイン
3. **ドキュメント作成**: 新しいドキュメントを作成
4. **フォルダ管理**: ドキュメントを整理するためのフォルダを作成
5. **編集**: ドキュメントの内容を編集

## 開発

### スクリプト

- `npm run dev` - フロントエンド開発サーバー
- `npm run api` - バックエンドAPIサーバー
- `npm run build` - プロダクションビルド
- `npm run start` - プロダクションサーバー
- `npm run lint` - ESLintチェック

### 環境変数

`.env.local` ファイルを作成して以下の環境変数を設定:

```env
PORT=3001
NODE_ENV=development
```

## ライセンス

MIT 