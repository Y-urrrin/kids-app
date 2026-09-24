const CACHE_NAME = "kids-app-v1";

const STATIC_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// 基本ファイルをキャッシュ
self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_FILES);
    })
  );
});

// 古いキャッシュを削除
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// HTML・CSS・JSは新しいものを優先
// 画像・音声などは一度読み込んだら自動キャッシュ
self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") {
    return;
  }

  const request = event.request;

  // ページ・CSS・JS → ネットを優先
  if (
    request.mode === "navigate" ||
    request.destination === "style" ||
    request.destination === "script"
  ) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, copy);
          });

          return response;
        })
        .catch(() => caches.match(request))
    );

    return;
  }

  // 画像・音声など → キャッシュを優先
  event.respondWith(
    caches.match(request).then(cachedResponse => {

      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then(networkResponse => {

        if (
          networkResponse &&
          networkResponse.status === 200
        ) {
          const copy = networkResponse.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, copy);
          });
        }

        return networkResponse;
      });
    })
  );
});
