import { createMockFn, mockResolve } from './mockFactory.js';

const MOCK_BOT_REPLIES = [
  '您好，我是智能问答助手，请问有什么可以帮您？',
  '已收到您的消息，正在为您分析处理，请稍候。',
  '根据您提供的信息，建议进一步补充业务背景以便精准解答。',
  '如需上传资料，可直接粘贴截图或点击附件按钮上传文件。'
];

function pickBotReply(content) {
  if (!content || !content.trim()) {
    return '已收到您发送的附件，正在为您解析处理。';
  }
  const index = Math.abs(content.length) % MOCK_BOT_REPLIES.length;
  return MOCK_BOT_REPLIES[index];
}

/** 获取历史会话列表 */
export function getSessionList() {
  return mockResolve([], { message: '获取会话列表成功' });
}

/** 获取指定会话聊天记录 */
export function getChatHistory(sessionId) {
  return mockResolve([], { message: '获取聊天记录成功', sessionId });
}

/** 发送消息 */
export function sendChatMessage(params) {
  const { sessionId, content, fj } = params || {};
  const botMessage = {
    user: '机器人',
    content: pickBotReply(content),
    fj: [],
    createTime: Date.now()
  };
  const userMessage = {
    userName: 'admin',
    content: content || '',
    fj: Array.isArray(fj) ? fj : [],
    createTime: Date.now() - 1
  };
  return mockResolve([userMessage, botMessage], {
    message: '发送成功',
    sessionId
  });
}

/** 删除会话 */
export function deleteSession(sessionId) {
  return mockResolve({ sessionId }, { message: '删除成功' });
}

/** 更新会话标题 */
export function updateSessionTitle(params) {
  return mockResolve(params, { message: '更新成功' });
}

/** 上传附件（模拟） */
export function uploadAttachment() {
  return createMockFn({})();
}
