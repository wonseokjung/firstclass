import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 🔄 자동 버전 체크 - 새 버전이 있으면 자동 새로고침
const APP_VERSION = '2024-12-18-v1'; // 배포할 때마다 이 값 변경

const checkForUpdates = async () => {
  try {
    const response = await fetch('/version.json?t=' + Date.now(), {
      cache: 'no-store'
    });
    const data = await response.json();
    
    const storedVersion = localStorage.getItem('app_version');
    
    if (storedVersion && storedVersion !== data.version) {
      console.log('🔄 새 버전 감지! 페이지를 새로고침합니다...');
      localStorage.setItem('app_version', data.version);
      window.location.reload();
    } else if (!storedVersion) {
      localStorage.setItem('app_version', data.version);
    }
  } catch (error) {
    console.log('버전 체크 스킵');
  }
};

// 페이지 로드 시 버전 체크
checkForUpdates();

// 5분마다 버전 체크 (백그라운드)
setInterval(checkForUpdates, 5 * 60 * 1000);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
