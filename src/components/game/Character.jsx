import React, { useEffect, useState } from 'react';

const Character = ({
  username,
  level,
  position,
  isCurrentUser = false,
  status = 'idle',
  direction = 'down',
  onMove
}) => {
  const [isMoving, setIsMoving] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  // 处理角色动画
  useEffect(() => {
    let animationFrame;
    if (isMoving) {
      const animate = () => {
        setCurrentFrame(prev => (prev + 1) % 4); // 4帧动画
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isMoving]);

  // 获取角色颜色
  const getCharacterColor = () => {
    if (isCurrentUser) return 'bg-green-500';
    if (status === 'online') return 'bg-blue-500';
    return 'bg-gray-400';
  };

  return (
    <div
      className={`
        absolute transition-transform duration-200
        ${isMoving ? 'scale-105' : 'scale-100'}
      `}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
    >
      {/* 角色本体 */}
      <div className="relative">
        {/* 角色头像 */}
        <div 
          className={`
            w-12 h-12 rounded-full
            ${getCharacterColor()}
            flex items-center justify-center
            text-white font-bold text-lg
            shadow-lg
            transition-all duration-200
          `}
        >
          {username.charAt(0).toUpperCase()}
        </div>

        {/* 等级标签 */}
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-xs text-white px-1 rounded-full">
          Lv.{level}
        </div>

        {/* 用户名 */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <span className="bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-full">
            {username}
          </span>
        </div>

        {/* 状态指示器 */}
        <div 
          className={`
            absolute bottom-0 right-0 w-3 h-3 rounded-full
            ${status === 'online' ? 'bg-green-400' : 'bg-gray-400'}
            border-2 border-white
          `}
        />
      </div>

      {/* 移动效果 */}
      {isMoving && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce w-2 h-2 bg-gray-400 rounded-full" />
        </div>
      )}

      {/* 交互区域 */}
      {isCurrentUser && (
        <div 
          className="absolute inset-0 cursor-move"
          onMouseDown={() => setIsMoving(true)}
          onMouseUp={() => setIsMoving(false)}
          onMouseLeave={() => setIsMoving(false)}
        />
      )}
    </div>
  );
};

// 添加动作枚举
Character.Actions = {
  IDLE: 'idle',
  WALK: 'walk',
  RUN: 'run'
};

// 添加方向枚举
Character.Directions = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
};

export default Character;