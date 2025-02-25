import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';

// 404エラーハンドラー
export const notFoundHandler = (req: Request, res: Response) => {
  logger.warn(`リクエストされたパスが見つかりません: ${req.originalUrl}`);
  res.status(404).json({
    error: 'Not Found',
    message: 'リクエストされたリソースが見つかりません',
  });
};

// グローバルエラーハンドラー
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('サーバーエラー', { error: err.message, stack: err.stack });
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'サーバー内部でエラーが発生しました'
      : err.message,
  });
};
