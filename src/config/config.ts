import dotenv from 'dotenv';
import logger from '../utils/logger.js';

// .envファイルの読み込み
dotenv.config();

// 環境変数の設定
export const config = {
  dify: {
    baseUrl: process.env.DIFY_BASE_URL || 'https://api.dify.ai/v1',
    secretKey: process.env.DIFY_SECRET_KEY || '',
  },
  server: {
    port: parseInt(process.env.SERVER_PORT || '3034', 10),
    env: process.env.NODE_ENV || 'development',
  },
};

// 設定の検証
export function validateConfig() {
  if (!config.dify.secretKey) {
    throw new Error('DIFY_SECRET_KEY環境変数が設定されていません');
  }

  logger.debug('設定を読み込みました', { config });
}
