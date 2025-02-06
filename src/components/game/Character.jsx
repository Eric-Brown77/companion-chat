import React from 'react';

const Character = ({ user, isCurrentPlayer, position }) => {
  // 添加 CSS transform 和 transition 来实现平滑移动
  const style = {
    transform: `translate(${position?.x || 0}px, ${position?.y || 0}px)`,
    transition: 'transform 0.1s linear' // 添加平滑过渡效果
  };

  return (
    <div 
      className="absolute will-change-transform" 
      style={style}
    >
      {/* 角色主体 */}
      <div
        className={`
          w-12 h-12 rounded-full flex items-center justify-center
          ${isCurrentPlayer ? 'bg-blue-500' : 'bg-gray-500'}
          text-white font-bold shadow-lg
          border-2 border-white
        `}
      >
        {user.username?.[0]?.toUpperCase()}
      </div>

      {/* 玩家名称 */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className="px-2 py-1 bg-black bg-opacity-50 rounded text-white text-sm">
          {user.username}
        </span>
      </div>

      {/* 等级标识 */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className="px-2 py-1 bg-green-500 rounded text-white text-xs">
          Lv.{user.level}
        </span>
      </div>
    </div>
  );
};

export default Character;