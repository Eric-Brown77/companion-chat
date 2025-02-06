import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 左侧标题 */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Companion Chat
            </h1>
          </div>

          {/* 右侧用户信息 */}
          <div className="flex items-center">
            {user && (
              <>
                <div className="flex items-center space-x-4 mr-4">
                  <span className="text-sm text-gray-700">
                    Level {user.level}
                  </span>
                  <div className="h-4 w-px bg-gray-300" />
                  <span className="text-sm text-gray-700">
                    Exp {user.experience || 0}
                  </span>
                </div>
                <div className="relative">
                  <button
                    onClick={onLogout}
                    className="ml-4 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    退出登录
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;