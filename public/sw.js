const CACHE_NAME = 'clathon-v1.0.0';
const urlsToCache = [
  '/',
  '/manifest.json'
  // 외부 리소스와 존재하지 않는 파일 제거
];

// 설치 이벤트 - 오류 처리 추가
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        // 각 URL을 개별적으로 캐시 (오류 방지)
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(error => {
              console.warn('Failed to cache:', url, error);
              return null;
            })
          )
        );
      })
      .catch(error => {
        console.error('Cache installation failed:', error);
      })
  );
});

// 요청 이벤트 - 네트워크 우선 전략 (개발용)
self.addEventListener('fetch', function(event) {
  // 개발 환경에서는 항상 네트워크 우선
  if (event.request.url.includes('localhost')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // 캐시에서 발견된 경우 캐시 반환
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // 유효한 응답인지 확인
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 응답 복제 (스트림은 한 번만 사용 가능)
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              })
              .catch(error => {
                console.warn('Failed to update cache:', error);
              });

            return response;
          }
        ).catch(error => {
          console.warn('Fetch failed:', error);
          return caches.match('/'); // 오프라인 폴백
        });
      })
    );
});

// 활성화 이벤트 - 오래된 캐시 정리
self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 