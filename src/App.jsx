import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyToken } from './store/slices/authSlice';

// 页面组件
import Login from './pages/Login';
import Register from './pages/Register';
import Game from './pages/Game';
import Loading from './components/common/Loading';

// 私有路由组件
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  if (loading) {
    return <Loading fullScreen />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// 公开路由组件（已登录用户不能访问）
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  if (loading) {
    return <Loading fullScreen />;
  }
  
  return !isAuthenticated ? children : <Navigate to="/game" />;
};

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);

  // 在应用启动时验证token
  useEffect(() => {
    dispatch(verifyToken());
  }, [dispatch]);

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* 公开路由 */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />

          {/* 私有路由 */}
          <Route 
            path="/game" 
            element={
              <PrivateRoute>
                <Game />
              </PrivateRoute>
            } 
          />

          {/* 默认重定向 */}
          <Route 
            path="/" 
            element={<Navigate to="/game" replace />} 
          />

          {/* 404页面 */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800">404</h1>
                  <p className="text-gray-600 mt-2">页面不存在</p>
                  <button
                    className="mt-4 text-blue-600 hover:text-blue-800"
                    onClick={() => window.history.back()}
                  >
                    返回上一页
                  </button>
                </div>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;