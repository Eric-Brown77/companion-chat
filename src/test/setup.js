import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// 在每个测试后进行清理
afterEach(() => {
  cleanup();
});

// 模拟 localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
};

global.localStorage = localStorageMock;

// 模拟 WebSocket
class WebSocketMock {
  constructor(url) {
    this.url = url;
    this.readyState = WebSocket.CONNECTING;
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      this.onopen && this.onopen();
    }, 0);
  }

  send(data) {
    this.onmessage && this.onmessage({ data });
  }

  close() {
    this.readyState = WebSocket.CLOSED;
    this.onclose && this.onclose();
  }
}

global.WebSocket = WebSocketMock;