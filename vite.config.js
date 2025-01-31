import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    
    // 路径别名
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@services': resolve(__dirname, 'src/services'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@store': resolve(__dirname, 'src/store')
      }
    },

    // 服务器配置
    server: {
      port: parseInt(env.VITE_DEV_SERVER_PORT || 3000),
      host: env.VITE_DEV_SERVER_HOST || 'localhost',
      
      // API 代理配置
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/ws': {
          target: env.VITE_WS_URL,
          ws: true,
          changeOrigin: true
        }
      }
    },

    // 构建配置
    build: {
      // 输出目录
      outDir: 'dist',
      
      // 生产环境移除 console
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      
      // 分块策略
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
            'game-vendor': ['pixi.js']  // 如果使用了游戏引擎
          }
        }
      },
      
      // 资源文件处理
      assetsDir: 'assets',
      chunkSizeWarningLimit: 1500
    },

    // CSS 配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/variables.scss";'
        }
      },
      
      // PostCSS 配置已在 postcss.config.js 中设置
      modules: {
        scopeBehaviour: 'local',
        generateScopedName: mode === 'production' 
          ? '[hash:base64:8]' 
          : '[name]__[local]__[hash:base64:5]'
      }
    },

    // 性能优化
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit', 'react-redux']
    },

    // 预览配置
    preview: {
      port: 8080,
      open: true
    },

    // 环境变量前缀
    envPrefix: 'VITE_'
  };
});