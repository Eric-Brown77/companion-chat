import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const Header = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and title */}
          <div className="flex items-center">
            <div className="text-xl font-bold text-blue-600 cursor-pointer" 
                 onClick={() => navigate('/')}>
              Companion Chat
            </div>
          </div>

          {/* User info and navigation */}
          <div className="flex items-center">
            {user ? (
              <div className="relative ml-3">
                {/* User stats */}
                <div className="flex items-center space-x-4">
                  <div className="text-gray-600">
                    Level: {user.level}
                  </div>
                  <div className="h-4 w-px bg-gray-300" />
                  <div className="text-gray-600">
                    Exp: {user.experience}
                  </div>
                </div>

                {/* User menu button */}
                <div>
                  <button
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
                    onClick={toggleDropdown}
                  >
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.avatar || '/default-avatar.png'}
                      alt="User avatar"
                    />
                    <span className="text-gray-700">{user.username}</span>
                  </button>

                  {/* Dropdown menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => navigate('/profile')}
                        >
                          个人资料
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => navigate('/settings')}
                        >
                          设置
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={onLogout}
                        >
                          退出登录
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => navigate('/login')}
                >
                  登录
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => navigate('/register')}
                >
                  注册
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;