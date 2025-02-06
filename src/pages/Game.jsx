import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser, setUser } from '../store/slices/authSlice';
import Header from '../components/layout/Header';
import Character from '../components/game/Character';

const Game = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [players, setPlayers] = useState(new Map());
  const [position, setPosition] = useState(user?.position || { x: 0, y: 0 });
  const [pressedKeys, setPressedKeys] = useState(new Set());

  // 更新位置的函数
  const updatePosition = useCallback(() => {
    if (pressedKeys.size === 0) return;

    const moveSpeed = 5; // 降低单次移动速度，但通过requestAnimationFrame提高更新频率
    let deltaX = 0;
    let deltaY = 0;

    // 同时处理多个按键
    if (pressedKeys.has('ArrowUp') || pressedKeys.has('w')) deltaY -= moveSpeed;
    if (pressedKeys.has('ArrowDown') || pressedKeys.has('s')) deltaY += moveSpeed;
    if (pressedKeys.has('ArrowLeft') || pressedKeys.has('a')) deltaX -= moveSpeed;
    if (pressedKeys.has('ArrowRight') || pressedKeys.has('d')) deltaX += moveSpeed;

    // 如果是斜向移动，调整速度以保持一致的移动速度
    if (deltaX !== 0 && deltaY !== 0) {
      deltaX *= 0.707; // Math.sqrt(2)/2
      deltaY *= 0.707;
    }

    const newPosition = {
      x: position.x + deltaX,
      y: position.y + deltaY
    };

    setPosition(newPosition);
    
    // 更新用户状态
    const updatedUser = {
      ...user,
      position: newPosition
    };
    dispatch(setUser(updatedUser));
  }, [position, pressedKeys, user, dispatch]);

  // 使用 requestAnimationFrame 进行平滑更新
  useEffect(() => {
    let animationFrameId;
    
    const animate = () => {
      updatePosition();
      animationFrameId = requestAnimationFrame(animate);
    };

    if (pressedKeys.size > 0) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [updatePosition, pressedKeys]);

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
        e.preventDefault(); // 防止页面滚动
        setPressedKeys(prev => new Set(prev).add(key));
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.clear();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      
      {/* 游戏主区域 */}
      <div className="flex-1 relative bg-gray-100 overflow-hidden">
        {/* 地图背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200">
          {/* 网格背景 */}
          <div className="absolute inset-0" 
               style={{
                 backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)',
                 backgroundSize: '50px 50px'
               }}
          />
        </div>

        {/* 当前玩家 */}
        <Character
          user={user}
          position={position}
          isCurrentPlayer={true}
        />

        {/* 其他玩家 */}
        {Array.from(players.values()).map(player => (
          <Character
            key={player.id}
            user={player}
            position={player.position}
            isCurrentPlayer={false}
          />
        ))}

        {/* 调试信息 */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
          位置: ({Math.round(position.x)}, {Math.round(position.y)})
        </div>

        {/* 聊天输入框占位 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-96">
          {/* TODO: 添加聊天输入组件 */}
        </div>
      </div>
    </div>
  );
};

export default Game;