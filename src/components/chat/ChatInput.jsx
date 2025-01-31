import React, { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);

  // 监听Enter键
  useEffect(() => {
    const handleKeyPress = (e) => {
      // 按Enter发送消息，按Esc关闭输入框
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      } else if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [message]);

  // 聚焦时展开
  const handleFocus = () => {
    setIsExpanded(true);
  };

  // 失去焦点时，如果没有内容则收起
  const handleBlur = () => {
    if (!message.trim()) {
      setIsExpanded(false);
    }
  };

  // 发送消息
  const handleSend = () => {
    if (!message.trim()) return;

    onSend(message.trim());
    setMessage('');
    setIsExpanded(false);
    inputRef.current?.blur();
  };

  return (
    <div
      className={`
        bg-white rounded-lg shadow-lg transition-all duration-300
        ${isExpanded ? 'p-4' : 'p-2'}
      `}
    >
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="按Enter发送消息..."
            className={`
              w-full px-3 py-2 rounded-lg border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              resize-none transition-all duration-300
              ${isExpanded ? 'h-24' : 'h-10'}
            `}
          />
        </div>

        <div className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            variant="primary"
            size="small"
            onClick={handleSend}
            disabled={!message.trim()}
          >
            发送
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2 text-xs text-gray-500 flex justify-between">
          <span>Enter 发送，Shift + Enter 换行</span>
          <span>Esc 关闭</span>
        </div>
      )}
    </div>
  );
};

export default ChatInput;