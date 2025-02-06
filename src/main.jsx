import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './assets/styles/index.css';
import 'react-toastify/dist/ReactToastify.css';

// 在开发环境中禁用 React.StrictMode 以避免重复的副作用
const StrictModeWrapper = process.env.NODE_ENV === 'development' 
  ? React.Fragment 
  : React.StrictMode;

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictModeWrapper>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictModeWrapper>
);