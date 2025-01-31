import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  chatBubbles: new Map(),
  maxMessages: 100 // 最大消息历史数量
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload
      });

      // 保持消息历史在限制范围内
      if (state.messages.length > state.maxMessages) {
        state.messages = state.messages.slice(-state.maxMessages);
      }
    },

    addChatBubble: (state, action) => {
      const bubbleId = Date.now();
      state.chatBubbles.set(bubbleId, {
        id: bubbleId,
        timestamp: new Date().toISOString(),
        ...action.payload
      });
    },

    removeChatBubble: (state, action) => {
      state.chatBubbles.delete(action.payload);
    },

    clearMessages: (state) => {
      state.messages = [];
      state.chatBubbles.clear();
    },

    // 清除超过5秒的聊天气泡
    cleanupChatBubbles: (state) => {
      const now = Date.now();
      for (const [id, bubble] of state.chatBubbles.entries()) {
        if (now - new Date(bubble.timestamp).getTime() > 5000) {
          state.chatBubbles.delete(id);
        }
      }
    }
  }
});

export const {
  addMessage,
  addChatBubble,
  removeChatBubble,
  clearMessages,
  cleanupChatBubbles
} = chatSlice.actions;

// 选择器
export const selectMessages = (state) => state.chat.messages;
export const selectChatBubbles = (state) => state.chat.chatBubbles;

// Thunk：发送消息并创建聊天气泡
export const sendMessage = (message) => (dispatch) => {
  // 添加到消息历史
  dispatch(addMessage(message));

  // 如果是聊天气泡类型的消息，也添加到气泡列表
  if (message.type === 'chat') {
    dispatch(addChatBubble(message));

    // 5秒后移除气泡
    setTimeout(() => {
      dispatch(removeChatBubble(message.id));
    }, 5000);
  }
};

export default chatSlice.reducer;