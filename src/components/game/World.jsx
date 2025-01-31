import React, { useRef, useEffect, useState } from 'react';
import Character from './Character';

const World = ({
  currentUser,
  players,
  chatBubbles,
  onPlayerMove,
  worldSize = { width: 2000, height: 2000 }
}) => {
  const worldRef = useRef(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // 处理视口跟随玩家
  useEffect(() => {
    if (!currentUser || !worldRef.current) return;

    const world = worldRef.current;
    const worldRect = world.getBoundingClientRect();

    // 计算新的视口位置，使玩家保持在中心
    const newViewport = {
      x: currentUser.position.x - worldRect.width / 2,
      y: currentUser.position.y - worldRect.height / 2
    };

    // 限制视口范围
    newViewport.x = Math.max(0, Math.min(newViewport.x, worldSize.width - worldRect.width));
    newViewport.y = Math.max(0, Math.min(newViewport.y, worldSize.height - worldRect.height));

    setViewport(newViewport);
  }, [currentUser?.position, worldSize]);

  // 处理鼠标拖动
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // 只响应左键
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setViewport(prev => ({
      x: Math.max(0, Math.min(prev.x - deltaX, worldSize.width - worldRef.current.clientWidth)),
      y: Math.max(0, Math.min(prev.y - deltaY, worldSize.height - worldRef.current.clientHeight))
    }));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 处理缩放
  const handleWheel = (e) => {
    e.preventDefault();
    // TODO: 实现地图缩放功能
  };

  return (
    <div 
      ref={worldRef}
      className="relative w-full h-full overflow-hidden bg-gray-100"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* 背景网格 */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          transform: `translate(${-viewport.x}px, ${-viewport.y}px)`,
          width: worldSize.width,
          height: worldSize.height
        }}
      />

      {/* 渲染其他玩家 */}
      {Array.from(players.values()).map(player => (
        <Character
          key={player.id}
          username={player.username}
          level={player.level}
          position={{
            x: player.position.x - viewport.x,
            y: player.position.y - viewport.y
          }}
          status={player.status}
        />
      ))}

      {/* 渲染当前玩家 */}
      {currentUser && (
        <Character
          username={currentUser.username}
          level={currentUser.level}
          position={{
            x: currentUser.position.x - viewport.x,
            y: currentUser.position.y - viewport.y
          }}
          isCurrentUser={true}
          onMove={onPlayerMove}
        />
      )}

      {/* 渲染聊天气泡 */}
      {Array.from(chatBubbles.values()).map(bubble => (
        <div
          key={bubble.id}
          className="absolute"
          style={{
            left: bubble.position.x - viewport.x,
            top: bubble.position.y - viewport.y
          }}
        >
          {bubble.content}
        </div>
      ))}

      {/* 小地图 */}
      <div className="absolute bottom-4 right-4 w-48 h-48 bg-white rounded-lg shadow-lg p-2">
        <div className="relative w-full h-full border border-gray-200">
          {/* 当前视口范围指示器 */}
          <div
            className="absolute border-2 border-blue-500"
            style={{
              left: (viewport.x / worldSize.width) * 100 + '%',
              top: (viewport.y / worldSize.height) * 100 + '%',
              width: (worldRef.current?.clientWidth / worldSize.width) * 100 + '%',
              height: (worldRef.current?.clientHeight / worldSize.height) * 100 + '%'
            }}
          />

          {/* 玩家位置指示 */}
          {currentUser && (
            <div
              className="absolute w-2 h-2 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: (currentUser.position.x / worldSize.width) * 100 + '%',
                top: (currentUser.position.y / worldSize.height) * 100 + '%'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default World;