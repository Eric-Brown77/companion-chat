import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // token过期处理
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

// API请求方法
const apiService = {
  // 认证相关
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    verifyToken: () => api.post('/auth/verify-token')
  },

  // 用户相关
  user: {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    updatePosition: (position) => api.put('/users/position', position),
    getStatus: () => api.get('/users/status'),
    updateStatus: (status) => api.put('/users/status', { status }),
    search: (query) => api.get('/users/search', { params: { query } })
  },

  // 好友相关
  friends: {
    getFriendList: () => api.get('/friends'),
    sendRequest: (userId) => api.post('/friends/request', { userId }),
    acceptRequest: (requestId) => api.post('/friends/accept', { requestId }),
    rejectRequest: (requestId) => api.post('/friends/reject', { requestId }),
    removeFriend: (friendId) => api.delete(`/friends/${friendId}`)
  },

  // 背包相关
  inventory: {
    getItems: () => api.get('/inventory'),
    useItem: (itemId) => api.post(`/inventory/use/${itemId}`),
    dropItem: (itemId, quantity) => api.post(`/inventory/drop/${itemId}`, { quantity }),
    moveItem: (fromSlot, toSlot) => api.post('/inventory/move', { fromSlot, toSlot })
  },

  // 游戏世界相关
  game: {
    getNearbyPlayers: (position) => api.get('/game/nearby-players', { params: position }),
    getWorldState: () => api.get('/game/world-state'),
    sendAction: (action) => api.post('/game/action', action)
  },

  // 错误处理函数
  handleError: (error) => {
    console.error('API Error:', error);
    return {
      success: false,
      message: error.message || '请求失败，请稍后重试'
    };
  }
};

export default apiService;