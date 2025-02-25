#!/bin/bash

# 現在のディレクトリに移動
cd "$(dirname "$0")"

# TypeScriptのコンパイル
echo "TypeScriptをコンパイルしています..."
npm run build

# 実行権限の付与
chmod +x dist/index.js

echo "ビルドが完了しました"
