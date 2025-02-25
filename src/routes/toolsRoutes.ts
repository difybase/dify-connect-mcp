import { Router, Request, Response } from 'express';
import difyService from '../services/difyService.js';
import logger from '../utils/logger.js';

const router = Router();

// ツール一覧を取得
router.get('/', (req: Request, res: Response) => {
  res.json({
    tools: [
      {
        name: 'dify-chat',
        description: 'Difyチャットアプリにクエリを送信し、応答を取得します',
      },
      {
        name: 'knowledge-base-query',
        description: 'Difyの知識ベースにクエリを送信し、応答を取得します',
      },
    ],
  });
});

interface DifyChatRequest {
  query: string;
  conversation_id?: string;
}

interface KnowledgeBaseRequest {
  query: string;
  knowledge_base_id: string;
  conversation_id?: string;
}

// Difyチャットツール
router.post('/dify-chat', async (req: Request<{}, any, DifyChatRequest>, res: Response) => {
  try {
    const { query, conversation_id } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'クエリパラメータが必要です',
      });
    }
    
    logger.info(`Difyチャットツールを実行: "${query}"`);
    
    const response = await difyService.sendChatMessage({
      inputs: {},
      query,
      response_mode: 'blocking',
      conversation_id,
      user: 'default',
    });
    
    res.json(response);
  } catch (error: any) {
    logger.error('Difyチャットツールの実行に失敗しました', { error });
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Difyチャットツールの実行中にエラーが発生しました',
    });
  }
});

// 知識ベースクエリツール
router.post('/knowledge-base-query', async (req: Request<{}, any, KnowledgeBaseRequest>, res: Response) => {
  try {
    const { query, knowledge_base_id, conversation_id } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'クエリパラメータが必要です',
      });
    }
    
    if (!knowledge_base_id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: '知識ベースIDが必要です',
      });
    }
    
    logger.info(`知識ベースクエリツールを実行: "${query}"`);
    
    const response = await difyService.queryKnowledgeBase(
      query,
      knowledge_base_id,
      conversation_id
    );
    
    res.json(response);
  } catch (error: any) {
    logger.error('知識ベースクエリツールの実行に失敗しました', { error });
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || '知識ベースクエリツールの実行中にエラーが発生しました',
    });
  }
});

export default router;
