import api from './api';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  // 获取当前token
  getToken() {
    return this.token;
  }

  // 获取当前用户
  getCurrentUser() {
    return this.user;
  }

  // 检查是否已登录
  isAuthenticated() {
    return !!this.token;
  }

  // 登录
  async login(username, password) {
    try {
      const response = await api.auth.login({ username, password });
      
      if (response.success) {
        this.token = response.token;
        this.user = response.user;
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      return api.handleError(error);
    }
  }

  // 注册
  async register(userData) {
    try {
      const response = await api.auth.register(userData);
      
      if (response.success) {
        this.token = response.token;
        this.user = response.user;
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      return api.handleError(error);
    }
  }

  // 登出
  async logout() {
    try {
      await api.auth.logout();
      
      this.token = null;
      this.user = null;
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return { success: true };
    } catch (error) {
      return api.handleError(error);
    }
  }

  // 验证token
  async verifyToken() {
    try {
      if (!this.token) {
        return { success: false };
      }

      const response = await api.auth.verifyToken();
      
      if (!response.success) {
        this.logout();
      }
      
      return response;
    } catch (error) {
      this.logout();
      return api.handleError(error);
    }
  }

  // 更新用户信息
  async updateUser(userData) {
    try {
      const response = await api.user.updateProfile(userData);
      
      if (response.success) {
        this.user = { ...this.user, ...response.user };
        localStorage.setItem('user', JSON.stringify(this.user));
      }
      
      return response;
    } catch (error) {
      return api.handleError(error);
    }
  }

  // 更新用户状态
  async updateStatus(status) {
    try {
      const response = await api.user.updateStatus(status);
      
      if (response.success) {
        this.user = { ...this.user, status };
        localStorage.setItem('user', JSON.stringify(this.user));
      }
      
      return response;
    } catch (error) {
      return api.handleError(error);
    }
  }
}

export default new AuthService();