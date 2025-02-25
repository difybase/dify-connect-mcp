// MCP ツールの定義
const tools = [
  {
    name: 'dify-chat',
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
  {
    name: 'knowledge-base-query',
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
];

export default tools;
