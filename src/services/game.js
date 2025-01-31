import api from './api';
import wsService from './websocket';

class GameService {
  constructor() {
    this.gameState = {
      players: new Map(),
      chatBubbles: new Map(),
      inventory: [],
      position: { x: 0, y: 0 },
      worldState: null
    };
    
    this.eventHandlers = new Map();
    this.setupWebSocketHandlers();
  }

  // 设置WebSocket事件处理
  setupWebSocketHandlers() {
    // 处理玩家更新
    wsService.on('players', (message) => {
      switch (message.type) {
        case 'player_join':
          this.addPlayer(message.player);
          break;
        case 'player_leave':
          this.removePlayer(message.playerId);
          break;
      }
    });

    // 处理位置更新
    wsService.on('position', (message) => {
      this.updatePlayerPosition(message.playerId, message.position);
    });

    // 处理聊天消息
    wsService.on('chat', (message) => {
      this.addChatBubble(message.playerId, message.content);
    });

    // 处理背包更新
    wsService.on('inventory', (message) => {
      this.updateInventory(message.inventory);
    });
  }

  // 初始化游戏
  async initialize() {
    try {
      // 获取世界状态
      const worldState = await api.game.getWorldState();
      this.gameState.worldState = worldState;

      // 获取在线玩家
      const nearbyPlayers = await api.game.getNearbyPlayers(this.gameState.position);
      nearbyPlayers.forEach(player => this.addPlayer(player));

      // 获取背包数据
      const inventory = await api.inventory.getItems();
      this.gameState.inventory = inventory;

      return { success: true };
    } catch (error) {
      return api.handleError(error);
    }
  }

  // 添加玩家
  addPlayer(player) {
    this.gameState.players.set(player.id, player);
    this.emit('playerUpdate', {
      type: 'add',
      player
    });
  }

  // 移除玩家
  removePlayer(playerId) {
    this.gameState.players.delete(playerId);
    this.emit('playerUpdate', {
      type: 'remove',
      playerId
    });
  }

  // 更新玩家位置
  updatePlayerPosition(playerId, position) {
    const player = this.gameState.players.get(playerId);
    if (player) {
      player.position = position;
      this.gameState.players.set(playerId, { ...player });
      
      this.emit('playerUpdate', {
        type: 'move',
        playerId,
        position
      });
    }
  }

  // 添加聊天气泡
  addChatBubble(playerId, content) {
    const bubbleId = Date.now();
    this.gameState.chatBubbles.set(bubbleId, {
      playerId,
      content,
      timestamp: Date.now()
    });

    this.emit('chatBubble', {
      bubbleId,
      playerId,
      content
    });

    // 5秒后移除气泡
    setTimeout(() => {
      this.removeChatBubble(bubbleId);
    }, 5000);
  }

  // 移除聊天气泡
  removeChatBubble(bubbleId) {
    this.gameState.chatBubbles.delete(bubbleId);
    this.emit('chatBubble', {
      type: 'remove',
      bubbleId
    });
  }

  // 更新背包
  updateInventory(inventory) {
    this.gameState.inventory = inventory;
    this.emit('inventory', inventory);
  }

  // 使用物品
  async useItem(itemId) {
    try {
      const response = await api.inventory.useItem(itemId);
      if (response.success) {
        this.updateInventory(response.inventory);
      }
      return response;
    } catch (error) {
      return api.handleError(error);
    }
  }

  // 丢弃物品
  async dropItem(itemId, quantity) {
    try {
      const response = await api.inventory.dropItem(itemId, quantity);
      if (response.success) {
        this.updateInventory(response.inventory);
      }
      return response;
    } catch (error) {
      return api.handleError(error);
    }
  }

  // 移动
  move(direction) {
    const moveSpeed = 10;
    let deltaX = 0;
    let deltaY = 0;

    switch (direction) {
      case 'up':
        deltaY = -moveSpeed;
        break;
      case 'down':
        deltaY = moveSpeed;
        break;
      case 'left':
        deltaX = -moveSpeed;
        break;
      case 'right':
        deltaX = moveSpeed;
        break;
    }

    const newPosition = {
      x: this.gameState.position.x + deltaX,
      y: this.gameState.position.y + deltaY
    };

    // 发送位置更新
    wsService.sendPosition(newPosition);
    this.gameState.position = newPosition;
  }

  // 注册事件处理器
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event).add(handler);
  }

  // 移除事件处理器
  off(event, handler) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  // 触发事件
  emit(event, data) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error('Event handler error:', error);
        }
      });
    }
  }

  // 清理游戏状态
  cleanup() {
    this.gameState.players.clear();
    this.gameState.chatBubbles.clear();
    this.gameState.inventory = [];
    this.gameState.position = { x: 0, y: 0 };
    this.gameState.worldState = null;
    this.eventHandlers.clear();
  }
}

export default new GameService();