import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 🔄 강력한 캐시 클리어 및 버전 체크 시스템
const clearAllCaches = async () => {
  try {
    // Service Worker 캐시 클리어
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('🗑️ 모든 캐시 클리어 완료');
    }
  } catch (e) {
    console.log('캐시 클리어 실패:', e);
  }
};

const checkForUpdates = async () => {
  try {
    // 캐시 완전 우회
    const response = await fetch('/version.json?nocache=' + Date.now() + Math.random(), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) return;
    
    const data = await response.json();
    const storedVersion = localStorage.getItem('app_version');
    
    console.log('📦 현재 버전:', storedVersion, '서버 버전:', data.version);
    
    if (storedVersion && storedVersion !== data.version) {
      console.log('🔄 새 버전 감지! 캐시 클리어 후 새로고침...');
      localStorage.setItem('app_version', data.version);
      
      // 캐시 클리어 후 강제 새로고침
      await clearAllCaches();
      
      // 강제 새로고침 (캐시 무시)
      window.location.href = window.location.href.split('?')[0] + '?v=' + Date.now();
    } else if (!storedVersion) {
      localStorage.setItem('app_version', data.version);
    }
  } catch (error) {
    console.log('버전 체크 스킵');
  }
};

// 페이지 로드 시 버전 체크
checkForUpdates();

// 3분마다 버전 체크 (더 자주)
setInterval(checkForUpdates, 3 * 60 * 1000);

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
