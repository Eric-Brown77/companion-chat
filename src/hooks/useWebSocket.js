import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectCount, setReconnectCount] = useState(0);
  const wsRef = useRef(null);
  const messageHandlers = useRef(new Map());

  // 建立WebSocket连接
  const connect = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('未登录或token已过期');
      return;
    }

    wsRef.current = new WebSocket(`ws://localhost:5000?token=${token}`);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setReconnectCount(0);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      
      // 重连逻辑
      if (reconnectCount < 5) {
        setTimeout(() => {
          setReconnectCount(prev => prev + 1);
          connect();
        }, 3000); // 3秒后重连
      } else {
        toast.error('连接失败，请刷新页面重试');
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('连接发生错误');
    };

    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const handler = messageHandlers.current.get(message.type);
        if (handler) {
          handler(message);
        } else {
          console.log('Unhandled message type:', message.type);
        }
      } catch (error) {
        console.error('Message parsing error:', error);
      }
    };
  }, [reconnectCount]);

  // 注册消息处理器
  const addMessageHandler = useCallback((type, handler) => {
    messageHandlers.current.set(type, handler);
  }, []);

  // 移除消息处理器
  const removeMessageHandler = useCallback((type) => {
    messageHandlers.current.delete(type);
  }, []);

  // 发送消息
  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    toast.error('连接已断开，请稍后重试');
    return false;
  }, []);

  // 发送聊天消息
  const sendChatMessage = useCallback((content) => {
    return sendMessage({
      type: 'chat',
      content
    });
  }, [sendMessage]);

  // 发送位置更新
  const sendPosition = useCallback((position) => {
    return sendMessage({
      type: 'position_update',
      position
    });
  }, [sendMessage]);

  // 发送私聊消息
  const sendPrivateMessage = useCallback((recipientId, content) => {
    return sendMessage({
      type: 'private_message',
      recipientId,
      content
    });
  }, [sendMessage]);

  // 组件卸载时清理连接
  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    sendMessage,
    sendChatMessage,
    sendPosition,
    sendPrivateMessage,
    addMessageHandler,
    removeMessageHandler
  };
};

export default useWebSocket;