#!/bin/bash

# スクリプトのディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# .envファイルのパス
ENV_FILE="${SCRIPT_DIR}/.env"

# .envファイルから環境変数を読み込む
if [ -f "${ENV_FILE}" ]; then
  # .envファイルから環境変数を読み込む
  source "${ENV_FILE}"
else
  # デフォルト値を設定
  DIFY_BASE_URL="https://api.dify.ai/v1"
  DIFY_SECRET_KEY="YOUR_DIFY_SECRET_KEY"
  NODE_ENV="production"
  LOG_LEVEL="info"
fi

# 環境変数を設定してサーバーを実行
exec env DIFY_BASE_URL="${DIFY_BASE_URL}" DIFY_SECRET_KEY="${DIFY_SECRET_KEY}" NODE_ENV="${NODE_ENV}" LOG_LEVEL="${LOG_LEVEL}" node "${SCRIPT_DIR}/dist/index.js"
