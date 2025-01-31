class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = 3000;
    this.messageHandlers = new Map();
    this.isConnected = false;
  }

  // 初始化WebSocket连接
  init(token) {
    if (this.ws) {
      this.ws.close();
    }

    try {
      this.ws = new WebSocket(`ws://localhost:5000?token=${token}`);
      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket initialization error:', error);
      this.handleReconnect();
    }
  }

  // 设置事件监听器
  setupEventListeners() {
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connection', { status: 'connected' });
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
      this.handleReconnect();
      this.emit('connection', { status: 'disconnected' });
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Message parsing error:', error);
      }
    };
  }

  // 处理重连
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        const token = localStorage.getItem('token');
        if (token) {
          this.init(token);
        }
      }, this.reconnectTimeout * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('connection', { 
        status: 'failed',
        message: '连接失败，请刷新页面重试'
      });
    }
  }

  // 发送消息
  send(type, data) {
    if (!this.isConnected) {
      console.error('WebSocket is not connected');
      return false;
    }

    try {
      const message = JSON.stringify({
        type,
        ...data,
        timestamp: new Date().toISOString()
      });
      
      this.ws.send(message);
      return true;
    } catch (error) {
      console.error('Send message error:', error);
      return false;
    }
  }

  // 添加消息处理器
  on(type, handler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }
    this.messageHandlers.get(type).add(handler);
  }

  // 移除消息处理器
  off(type, handler) {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  // 触发消息处理器
  emit(type, data) {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error('Handler execution error:', error);
        }
      });
    }
  }

  // 处理接收到的消息
  handleMessage(message) {
    switch (message.type) {
      case 'chat':
        this.emit('chat', message);
        break;
      
      case 'player_join':
      case 'player_leave':
        this.emit('players', message);
        break;
      
      case 'position_update':
        this.emit('position', message);
        break;
      
      case 'inventory_update':
        this.emit('inventory', message);
        break;
      
      case 'friend_request':
      case 'friend_accept':
      case 'friend_reject':
        this.emit('friends', message);
        break;
      
      case 'error':
        this.emit('error', message);
        break;
      
      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  // 发送聊天消息
  sendChat(content) {
    return this.send('chat', { content });
  }

  // 发送位置更新
  sendPosition(position) {
    return this.send('position_update', { position });
  }

  // 发送物品操作
  sendItemAction(action, itemId, data = {}) {
    return this.send('inventory_action', {
      action,
      itemId,
      ...data
    });
  }

  // 关闭连接
  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
      this.messageHandlers.clear();
    }
  }
}

export default new WebSocketService();