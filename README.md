# Dify MCP Server

Dify APIと連携するModel Context Protocol (MCP) サーバー。

## 概要

このMCPサーバーは、Dify APIと連携して、チャットアプリケーションにクエリを送信し、結果を取得する機能を提供します。

## 機能

- **dify-chat**: Difyチャットアプリにクエリを送信し、応答を取得します
- **knowledge-base-query**: Difyの知識ベースにクエリを送信し、応答を取得します

## セットアップ

### 前提条件

- Node.js (v16以上)
- npm
- Dify APIキー

### インストール

1. 依存関係をインストールします:

```bash
npm install
```

2. TypeScriptコードをコンパイルします:

```bash
./build.sh
```

### 設定

以下の環境変数を設定する必要があります:

- `DIFY_BASE_URL`: Dify APIのベースURL（デフォルト: https://api.dify.ai/v1）
- `DIFY_SECRET_KEY`: Dify APIキー（必須）
- `NODE_ENV`: 実行環境（development/production）
- `LOG_LEVEL`: ログレベル（debug/info/warn/error）

これらの環境変数は、`.env`ファイルで設定できます:

1. `.env.example`ファイルを`.env`にコピーします:

```bash
cp .env.example .env
```

2. `.env`ファイルを編集して、実際のDify APIキーを設定します:

```
# Dify API設定
DIFY_BASE_URL=https://api.dify.ai/v1
DIFY_SECRET_KEY=your_actual_dify_secret_key_here

# サーバー設定
NODE_ENV=production
LOG_LEVEL=info
```

スクリプト（`start-mcp.sh`と`run-mcp.sh`）は自動的に`.env`ファイルから環境変数を読み込みます。

### 実行

サーバーを起動するには:

```bash
./start-mcp.sh
```

## MCPサーバーの設定

Clineで使用するには、MCPサーバー設定ファイルに以下を追加します:

```json
{
  "mcpServers": {
    "dify-mcp4": {
      "command": "/bin/bash",
      "args": ["/Users/kawashimariku/Desktop/dify-mcp4/run-mcp.sh"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

この設定では、`run-mcp.sh`スクリプトが`.env`ファイルから環境変数を読み込むため、MCPサーバー設定ファイルに直接APIキーを記述する必要はありません。

## 使用例

MCPサーバーが設定されると、以下のようなコマンドでDifyにクエリを送信できます:

```
dify-chat "こんにちは、今日の天気は？"
```

または知識ベースにクエリを送信:

```
knowledge-base-query "製品の特徴について教えてください" "knowledge_base_id_here"
```
