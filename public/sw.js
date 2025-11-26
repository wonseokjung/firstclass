const CACHE_NAME = 'aicitybuilders-v1.1.0'; // Day 8 오픈 및 리팩토링 반영
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

// 요청 이벤트 - 네트워크 우선 전략 (개발용)
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
    // 외부 API는 Service Worker를 거치지 않고 직접 네트워크 요청
    return;
  }

  // POST, PUT, DELETE 요청은 캐시하지 않음
  if (event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // 캐시에서 발견된 경우 캐시 반환
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function (response) {
            // 유효한 응답인지 확인
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // GET 요청만 캐시에 저장
            if (event.request.method === 'GET') {
              // 응답 복제 (스트림은 한 번만 사용 가능)
              var responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then(function (cache) {
                  cache.put(event.request, responseToCache);
                })
                .catch(error => {
                  console.warn('Failed to update cache:', error);
                });
            }

            return response;
          }
        ).catch(error => {
          console.warn('Fetch failed:', error);
          return caches.match('/'); // 오프라인 폴백
        });
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