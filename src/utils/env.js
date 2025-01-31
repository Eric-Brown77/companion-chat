// 环境变量工具类
class EnvConfig {
  constructor() {
    this.env = import.meta.env;
  }

  // 获取API基础URL
  get apiBaseUrl() {
    return this.env.VITE_API_BASE_URL;
  }

  // 获取WebSocket URL
  get wsUrl() {
    return this.env.VITE_WS_URL;
  }

  // 是否是生产环境
  get isProd() {
    return this.env.PROD;
  }

  // 是否是开发环境
  get isDev() {
    return this.env.DEV;
  }

  // 获取应用标题
  get appTitle() {
    return this.env.VITE_APP_TITLE;
  }

  // 获取应用描述
  get appDescription() {
    return this.env.VITE_APP_DESCRIPTION;
  }

  // 获取聊天历史最大数量
  get maxChatHistory() {
    return parseInt(this.env.VITE_MAX_CHAT_HISTORY);
  }

  // 获取聊天气泡持续时间
  get chatBubbleDuration() {
    return parseInt(this.env.VITE_CHAT_BUBBLE_DURATION);
  }

  // 获取地图大小
  get mapSize() {
    return parseInt(this.env.VITE_MAP_SIZE);
  }

  // 是否启用开发者工具
  get enableDevTools() {
    return this.env.VITE_ENABLE_DEVTOOLS === 'true';
  }

  // 是否启用日志
  get enableLogger() {
    return this.env.VITE_ENABLE_LOGGER === 'true';
  }

  // 获取缓存配置
  get cacheConfig() {
    if (!this.isProd) return null;
    
    return {
      maxAge: parseInt(this.env.VITE_CACHE_MAX_AGE),
      strategy: this.env.VITE_CACHE_STRATEGY
    };
  }

  // 获取开发服务器配置
  get devServerConfig() {
    if (!this.isDev) return null;

    return {
      port: parseInt(this.env.VITE_DEV_SERVER_PORT),
      host: this.env.VITE_DEV_SERVER_HOST
    };
  }

  // 检查必需的环境变量
  validate() {
    const required = [
      'VITE_API_BASE_URL',
      'VITE_WS_URL',
      'VITE_APP_TITLE'
    ];

    const missing = required.filter(key => !this.env[key]);

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
}

// 创建并验证环境配置
const envConfig = new EnvConfig();
envConfig.validate();

export default envConfig;