import React, { useState, useEffect } from 'react';

const ChatBubble = ({ content, position, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 设置淡出动画定时器
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 500); // 提前500ms开始淡出动画

    // 设置移除定时器
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        absolute -top-16 left-1/2 transform -translate-x-1/2 
        max-w-xs bg-white rounded-lg shadow-lg p-2
        transition-opacity duration-500
        ${fadeOut ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* 气泡尾巴 */}
      <div
        className="
          absolute -bottom-2 left-1/2 transform -translate-x-1/2
          w-4 h-4 bg-white
          rotate-45
        "
      />

      {/* 消息内容 */}
      <div className="relative z-10 text-sm text-gray-800 break-words">
        {content}
      </div>
    </div>
  );
};

export default ChatBubble;