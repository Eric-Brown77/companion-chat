import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ onClose, isOpen, friendList = [] }) => {
  const [activeTab, setActiveTab] = useState('friends');
  const navigate = useLocation();
  
  const tabs = [
    { id: 'friends', label: '好友列表' },
    { id: 'inventory', label: '背包' },
    { id: 'messages', label: '消息' }
  ];

  // 标签样式
  const getTabStyle = (tabId) => {
    return `px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors
      ${activeTab === tabId 
        ? 'bg-blue-100 text-blue-700' 
        : 'text-gray-600 hover:bg-gray-100'
      }`;
  };

  return (
    <div 
      className={`
        fixed right-0 top-16 h-full w-64 bg-white shadow-lg transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      {/* Close button */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Tabs */}
      <div className="flex space-x-1 p-4 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={getTabStyle(tab.id)}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'friends' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">好友列表</h3>
              <span className="text-sm text-gray-500">
                {friendList.length} 位好友在线
              </span>
            </div>
            <div className="space-y-2">
              {friendList.map(friend => (
                <div
                  key={friend.id}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50"
                >
                  <div className="relative">
                    <img
                      src={friend.avatar || '/default-avatar.png'}
                      alt={friend.username}
                      className="h-8 w-8 rounded-full"
                    />
                    <span 
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white
                        ${friend.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}
                      `}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{friend.username}</div>
                    <div className="text-xs text-gray-500">
                      Level {friend.level}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">背包</h3>
            <div className="grid grid-cols-4 gap-2">
              {Array(16).fill(null).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center"
                >
                  <span className="text-gray-400 text-xs">空</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">消息</h3>
            <div className="text-sm text-gray-500 text-center py-4">
              暂无新消息
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;