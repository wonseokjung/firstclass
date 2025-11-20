const CACHE_NAME = 'aicitybuilders-v1.1.0'; // HTML 네트워크 우선 전략 적용
const urlsToCache = [
  '/',
  '/manifest.json',
  '/ai-building-course',
  '/ceo',
  '/faq',
  '/login',
  '/signup'
];

// 설치 이벤트 - 즉시 활성화
self.addEventListener('install', function (event) {
  console.log('🚀 Service Worker 설치 중... 버전:', CACHE_NAME);

  // skipWaiting()으로 즉시 활성화 (기존 SW 대체)
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('✅ 캐시 오픈:', CACHE_NAME);
        // 각 URL을 개별적으로 캐시 (오류 방지)
        return Promise.allSettled(
          urlsToCache.map(url =>
            cache.add(url).catch(error => {
              console.warn('⚠️ 캐시 실패:', url, error);
              return null;
            })
          )
        );
      })
      .catch(error => {
        console.error('❌ 캐시 설치 실패:', error);
      })
  );
});

// 요청 이벤트 - HTML은 네트워크 우선, 정적 자원은 캐시 우선
self.addEventListener('fetch', function (event) {
  // 개발 환경에서는 항상 네트워크 우선
  if (event.request.url.includes('localhost')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Azure Storage, Vimeo, YouTube 등 외부 API 요청은 Service Worker가 처리하지 않음
  if (
    event.request.url.includes('azure.com') ||
    event.request.url.includes('table.core.windows.net') ||
    event.request.url.includes('blob.core.windows.net') ||
    event.request.url.includes('vimeo.com') ||
    event.request.url.includes('youtube.com') ||
    event.request.url.includes('ytimg.com') ||
    event.request.url.includes('googleapis.com')
  ) {
    return;
  }

  // POST, PUT, DELETE 요청은 캐시하지 않음
  if (event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }

  // HTML 페이지 요청 (Navigation) -> 네트워크 우선 전략
  // 항상 서버에서 최신 버전을 가져오고, 실패시에만 캐시 사용
  if (event.request.mode === 'navigate' || event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(function (response) {
          // 네트워크 요청 성공 시 캐시 업데이트 후 응답 반환
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          var responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(function (cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        })
        .catch(function () {
          // 네트워크 실패 시 캐시 사용 (오프라인 모드)
          return caches.match(event.request)
            .then(function (response) {
              if (response) return response;
              return caches.match('/'); // 최후의 수단으로 홈 페이지 반환
            });
        })
    );
    return;
  }

  // 정적 자원 (이미지, CSS, JS) -> 캐시 우선 전략
  // 성능을 위해 캐시를 먼저 확인하고, 없으면 네트워크 요청
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function (response) {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function (cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// 활성화 이벤트 - 오래된 캐시 정리 및 즉시 제어
self.addEventListener('activate', function (event) {
  console.log('🔄 Service Worker 활성화 중... 버전:', CACHE_NAME);

  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('🗑️ 오래된 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function () {
      // 즉시 모든 클라이언트 제어
      console.log('✅ Service Worker 활성화 완료. 즉시 제어 시작');
      return self.clients.claim();
    }).then(function () {
      // 모든 클라이언트(열려있는 탭)에 새로고침 요청
      return self.clients.matchAll();
    }).then(function (clients) {
      clients.forEach(function (client) {
        console.log('📢 클라이언트에게 업데이트 알림:', client.url);
        client.postMessage({
          type: 'SW_UPDATED',
          version: CACHE_NAME,
          message: '새 버전이 설치되었습니다. 페이지를 새로고침합니다.'
        });
      });
    })
  );
});

// 메시지 이벤트 - 클라이언트로부터 명령 받기
self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏭️ skipWaiting 요청 받음');
    self.skipWaiting();
  }
});

// 새 버전 감지 시 자동 새로고침 메시지 전송
self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    console.log('⏭️ skipWaiting 호출됨. 즉시 활성화...');
    self.skipWaiting();
  }
}); 