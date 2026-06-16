/* ============================================================
   SymposiON — Service Worker v1
   Strategy: Cache-first for shell, Network-first for pages,
   bypass all Firebase / external API traffic.
   ============================================================ */

const CACHE = 'symposion-v15';

const PRECACHE = [
  '/',
  '/index.html',
  '/css/main.css',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-maskable.svg',
];

/* ── Install: pre-cache the app shell ── */
self.addEventListener('install', function(event) {
  /* Skip caching on localhost dev server — always use network-fresh files */
  if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
    return self.skipWaiting();
  }
  event.waitUntil(
    caches.open(CACHE)
      .then(function(cache) {
        /* addAll fails if any resource 404s — cache individually so missing
           icons don't abort the whole install */
        return Promise.allSettled(PRECACHE.map(function(url) {
          return cache.add(url).catch(function(e) {
            console.warn('[SW] PRECACHE skipped:', url, e.message);
          });
        }));
      })
      .then(function() { return self.skipWaiting(); })
  );
});

/* ── Activate: remove old caches ── */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k)   { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

/* ── Fetch ── */
self.addEventListener('fetch', function(event) {
  var req = event.request;

  if (req.method !== 'GET') return;
  if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') return;

  var url = req.url;

  /* Bypass: Firebase, Firestore, Google APIs, CDN fonts */
  if (
    url.includes('firebaseio.com')       ||
    url.includes('firestore.googleapis') ||
    url.includes('firebase.googleapis')  ||
    url.includes('identitytoolkit')      ||
    url.includes('gstatic.com')          ||
    url.includes('googleapis.com')       ||
    url.includes('cdnjs.cloudflare.com') ||
    url.includes('cloudfunctions.net')   ||
    !url.startsWith(self.location.origin)
  ) return;

  /* ── Strategy 1: Network-first for HTML navigation ──────────────
     Always fetch index.html fresh so CSS/JS version params are
     up-to-date. Falls back to cache only when offline.            */
  if (req.mode === 'navigate' ||
      req.headers.get('accept') && req.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then(function(response) {
          if (response && response.status === 200) {
            caches.open(CACHE).then(function(c) { c.put(req, response.clone()); });
          }
          return response;
        })
        .catch(function() {
          return caches.match(req).then(function(cached) {
            return cached || caches.match('/index.html');
          });
        })
    );
    return;
  }

  /* ── Strategy 2: Cache-first for versioned assets (?v= in URL) ──
     These URLs are immutable — the version param changes when the
     file changes, so serving from cache is always safe.           */
  if (url.includes('?v=') || url.includes('&v=')) {
    event.respondWith(
      caches.open(CACHE).then(function(cache) {
        return cache.match(req).then(function(cached) {
          if (cached) return cached;
          return fetch(req).then(function(response) {
            if (response && response.status === 200 && response.type !== 'opaque') {
              cache.put(req, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  /* ── Strategy 3: Network-first for unversioned CSS/JS ───────────
     Unversioned assets (e.g. admin-atlas.css, new files) always
     go to network first so changes are visible on next load.      */
  if (url.match(/\.(css|js)(\?|$)/)) {
    event.respondWith(
      fetch(req)
        .then(function(response) {
          if (response && response.status === 200 && response.type !== 'opaque') {
            caches.open(CACHE).then(function(c) { c.put(req, response.clone()); });
          }
          return response;
        })
        .catch(function() { return caches.match(req); })
    );
    return;
  }

  /* ── Strategy 4: Stale-while-revalidate for everything else ───── */
  event.respondWith(
    caches.open(CACHE).then(function(cache) {
      return cache.match(req).then(function(cached) {
        var networkFetch = fetch(req).then(function(response) {
          if (response && response.status === 200 && response.type !== 'opaque') {
            cache.put(req, response.clone());
          }
          return response;
        }).catch(function() { return null; });
        return cached || networkFetch;
      });
    })
  );
});
