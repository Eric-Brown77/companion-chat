import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';

const Game = () => {
  const navigate = useNavigate();
  const gameRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [players, setPlayers] = useState(new Map());
  const [chatBubbles, setChatBubbles] = useState(new Map());
  const [wsConnection, setWsConnection] = useState(null);

  // 初始化游戏和WebSocket连接
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    // 建立WebSocket连接
    const ws = new WebSocket(`ws://localhost:5000?token=${token}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setWsConnection(ws);
    };

    ws.onmessage = handleWebSocketMessage;

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // 处理WebSocket消息
  const handleWebSocketMessage = (event) => {
    const message = JSON.parse(event.data);

    switch (message.type) {
      case 'player_join':
        handlePlayerJoin(message.player);
        break;
      case 'player_leave':
        handlePlayerLeave(message.playerId);
        break;
      case 'chat_bubble':
        handleChatBubble(message);
        break;
      case 'player_move':
        handlePlayerMove(message);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  };

  // 处理玩家加入
  const handlePlayerJoin = (player) => {
    setPlayers(prev => new Map(prev).set(player.id, player));
  };

  // 处理玩家离开
  const handlePlayerLeave = (playerId) => {
    setPlayers(prev => {
      const newPlayers = new Map(prev);
      newPlayers.delete(playerId);
      return newPlayers;
    });
  };

  // 处理聊天气泡
  const handleChatBubble = (message) => {
    const bubbleId = Date.now();
    setChatBubbles(prev => new Map(prev).set(bubbleId, {
      playerId: message.playerId,
      content: message.content,
      position: message.position
    }));

    // 5秒后移除气泡
    setTimeout(() => {
      setChatBubbles(prev => {
        const newBubbles = new Map(prev);
        newBubbles.delete(bubbleId);
        return newBubbles;
      });
    }, 5000);
  };

  // 处理玩家移动
  const handlePlayerMove = (message) => {
    setPlayers(prev => {
      const newPlayers = new Map(prev);
      const player = newPlayers.get(message.playerId);
      if (player) {
        player.position = message.position;
        newPlayers.set(message.playerId, { ...player });
      }
      return newPlayers;
    });
  };

  // 发送聊天消息
  const handleChat = (content) => {
    if (!wsConnection) return;

    wsConnection.send(JSON.stringify({
      type: 'chat',
      content
    }));
  };

  // 处理键盘移动
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!user || !wsConnection) return;

      let deltaX = 0;
      let deltaY = 0;
      const moveSpeed = 10;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          deltaY = -moveSpeed;
          break;
        case 'ArrowDown':
        case 's':
          deltaY = moveSpeed;
          break;
        case 'ArrowLeft':
        case 'a':
          deltaX = -moveSpeed;
          break;
        case 'ArrowRight':
        case 'd':
          deltaX = moveSpeed;
          break;
        default:
          return;
      }

      const newPosition = {
        x: user.position.x + deltaX,
        y: user.position.y + deltaY
      };

      wsConnection.send(JSON.stringify({
        type: 'move',
        position: newPosition
      }));

      setUser(prev => ({
        ...prev,
        position: newPosition
      }));
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [user, wsConnection]);

  return (
    <div className="h-screen flex flex-col">
      <Header 
        user={user} 
        onLogout={() => {
          localStorage.clear();
          navigate('/login');
        }}
      />

      <div className="flex-1 relative overflow-hidden" ref={gameRef}>
        {/* 游戏世界 */}
        <div className="absolute inset-0 bg-gray-100">
          {/* 渲染其他玩家 */}
          {Array.from(players.values()).map(player => (
            <div
              key={player.id}
              className="absolute transition-all duration-200"
              style={{
                transform: `translate(${player.position.x}px, ${player.position.y}px)`
              }}
            >
              <div className="relative">
                {/* 玩家角色 */}
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {player.username.charAt(0)}
                </div>
                
                {/* 玩家名称 */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm">
                  {player.username}
                </div>

                {/* 聊天气泡 */}
                {Array.from(chatBubbles.values())
                  .filter(bubble => bubble.playerId === player.id)
                  .map((bubble, index) => (
                    <ChatBubble
                      key={index}
                      content={bubble.content}
                      position={bubble.position}
                    />
                  ))
                }
              </div>
            </div>
          ))}

          {/* 渲染当前玩家 */}
          {user && (
            <div
              className="absolute transition-all duration-200"
              style={{
                transform: `translate(${user.position.x}px, ${user.position.y}px)`
              }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                  {user.username.charAt(0)}
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm">
                  {user.username}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 聊天输入框 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-96">
          <ChatInput onSend={handleChat} />
        </div>
      </div>

      {/* 侧边栏 */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        friendList={Array.from(players.values())}
      />

      {/* 侧边栏开关按钮 */}
      <button
        className="fixed right-4 top-20 z-50 bg-white p-2 rounded-full shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isSidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          )}
        </svg>
      </button>
    </div>
  );
};

export default Game;