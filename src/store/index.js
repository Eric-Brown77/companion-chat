import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import gameReducer from './slices/gameSlice';
import chatReducer from './slices/chatSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    chat: chatReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略这些 action 和 path 的序列化检查
        ignoredActions: ['game/updatePlayers', 'chat/addMessage'],
        ignoredPaths: ['game.players', 'chat.messages']
      }
    })
});

export default store;