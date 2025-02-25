import axios from 'axios';
import { config } from '../config/config.js';
import logger from '../utils/logger.js';

// Dify API クライアントの設定
const difyClient = axios.create({
  baseURL: config.dify.baseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.dify.secretKey}`,
  },
});

// エラーハンドリング
difyClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      logger.error('Dify API エラー', {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      logger.error('Dify API リクエストエラー', { request: error.request });
    } else {
      logger.error('Dify API 未知のエラー', { message: error.message });
    }
    return Promise.reject(error);
  }
);

// Dify サービス
const difyService = {
  /**
   * チャットメッセージを送信する
   */
  async sendChatMessage(params: {
    inputs?: Record<string, any>;
    query: string;
    response_mode: 'streaming' | 'blocking';
    conversation_id?: string;
    user: string;
  }) {
    try {
      logger.debug('Dify チャットメッセージを送信します', { params });
      
      const response = await difyClient.post('/chat-messages', params);
      
      logger.debug('Dify チャットレスポンスを受信しました', {
        status: response.status,
        data: response.data,
      });
      
      return response.data;
    } catch (error) {
      logger.error('Dify チャットメッセージの送信に失敗しました', { error });
      throw error;
    }
  },

  /**
   * 知識ベースにクエリを送信する
   */
  async queryKnowledgeBase(
    query: string,
    knowledgeBaseId: string,
    conversationId?: string
  ) {
    try {
      logger.debug('Dify 知識ベースにクエリを送信します', {
        query,
        knowledgeBaseId,
        conversationId,
      });
      
      // 知識ベースへのクエリは通常のチャットメッセージと同じエンドポイントを使用
      // ただし、知識ベースIDを指定する必要がある
      const response = await difyClient.post('/chat-messages', {
        inputs: { knowledge_base_id: knowledgeBaseId },
        query,
        response_mode: 'blocking',
        conversation_id: conversationId,
        user: 'default',
      });
      
      logger.debug('Dify 知識ベースレスポンスを受信しました', {
        status: response.status,
        data: response.data,
      });
      
      return response.data;
    } catch (error) {
      logger.error('Dify 知識ベースクエリの送信に失敗しました', { error });
      throw error;
    }
  },
};

export default difyService;
