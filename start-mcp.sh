#!/bin/bash

# 現在のディレクトリに移動
cd "$(dirname "$0")"

# .envファイルから環境変数を読み込む
if [ -f .env ]; then
  echo ".envファイルから環境変数を読み込んでいます..."
  export $(grep -v '^#' .env | xargs)
else
  echo "警告: .envファイルが見つかりません。デフォルト設定を使用します。"
  export DIFY_BASE_URL="https://api.dify.ai/v1"
  export DIFY_SECRET_KEY="YOUR_DIFY_SECRET_KEY"  # ここに実際のDify APIキーを設定してください
  export NODE_ENV=production
  export LOG_LEVEL=info
fi

# サーバーの起動
echo "Dify MCP サーバーを起動しています..."
node dist/index.js
