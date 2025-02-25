#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import logger from './utils/logger.js';
import tools from './config/tools.js';
import difyService from './services/difyService.js';
import { config, validateConfig } from './config/config.js';

// 設定の検証
try {
  validateConfig();
} catch (error: any) {
  logger.error(`設定エラー: ${error.message}`);
  process.exit(1);
}

class DifyMcpServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'dify-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {
            'dify-chat': {
              description: 'Difyチャットアプリにクエリを送信し、応答を取得します',
              parameters: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description: 'Difyに送信するクエリ',
                  },
                  conversation_id: {
                    type: 'string',
                    description: '会話ID（オプション）。会話を継続する場合に指定します。',
                  },
                },
                required: ['query'],
              },
            },
            'knowledge-base-query': {
              description: 'Difyの知識ベースにクエリを送信し、応答を取得します',
              parameters: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description: '知識ベースに送信するクエリ',
                  },
                  knowledge_base_id: {
                    type: 'string',
                    description: '知識ベースID',
                  },
                  conversation_id: {
                    type: 'string',
                    description: '会話ID（オプション）',
                  },
                },
                required: ['query', 'knowledge_base_id'],
              },
            },
          },
        },
      }
    );

    this.setupToolHandlers();
    
    // エラーハンドリング
    this.server.onerror = (error) => logger.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    // ListToolsRequestSchema ハンドラーは不要です。
    // MCPサーバーは capabilities に設定されたツールを自動的に公開します。

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        let response;
        
        switch (request.params.name) {
          case 'dify-chat':
            if (!request.params.arguments || typeof request.params.arguments.query !== 'string') {
              throw new McpError(
                ErrorCode.InvalidParams,
                'クエリパラメータが必要です'
              );
            }
            
            logger.info(`Difyチャットツールを実行: "${request.params.arguments.query}"`);
            
            const chatResponse = await difyService.sendChatMessage({
              inputs: {},
              query: request.params.arguments.query,
              response_mode: 'blocking',
              conversation_id: typeof request.params.arguments.conversation_id === 'string' 
                ? request.params.arguments.conversation_id 
                : undefined,
              user: 'default'
            });
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(chatResponse, null, 2),
                },
              ],
            };
            
          case 'knowledge-base-query':
            if (!request.params.arguments || typeof request.params.arguments.query !== 'string') {
              throw new McpError(
                ErrorCode.InvalidParams,
                'クエリパラメータが必要です'
              );
            }
            
            if (!request.params.arguments || typeof request.params.arguments.knowledge_base_id !== 'string') {
              throw new McpError(
                ErrorCode.InvalidParams,
                '知識ベースIDが必要です'
              );
            }
            
            logger.info(`知識ベースクエリツールを実行: "${request.params.arguments.query}"`);
            
            const kbResponse = await difyService.queryKnowledgeBase(
              request.params.arguments.query,
              request.params.arguments.knowledge_base_id,
              typeof request.params.arguments.conversation_id === 'string' 
                ? request.params.arguments.conversation_id 
                : undefined
            );
            
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(kbResponse, null, 2),
                },
              ],
            };
            
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `未知のツール: ${request.params.name}`
            );
        }
      } catch (error: any) {
        if (error instanceof McpError) {
          throw error;
        }
        
        logger.error(`ツール実行エラー: ${error.message}`, { error });
        
        return {
          content: [
            {
              type: 'text',
              text: `エラー: ${error.message || 'ツール実行中にエラーが発生しました'}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    logger.info('Dify MCP サーバーが起動しました');
    logger.info(`環境: ${config.server.env}`);
    logger.info('利用可能なツール:');
    tools.forEach(tool => {
      logger.info(`- ${tool.name}: ${tool.description}`);
    });
  }
}

const server = new DifyMcpServer();
server.run().catch(console.error);
