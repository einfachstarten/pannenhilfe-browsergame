const CACHE_NAME = 'strassenwacht-v5';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/privacy.html'
];

// Install Event
self.addEventListener('install', event => {
  console.log('[SW] Install Event');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting(); // Sofort aktivieren
});

// Activate Event
self.addEventListener('activate', event => {
  console.log('[SW] Activate Event');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => {
          console.log('[SW] Deleting old cache:', key);
          return caches.delete(key);
        })
      )
    )
  );
  return self.clients.claim(); // Übernimmt sofort Kontrolle
});

// Fetch Event
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // API Requests nicht cachen
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // Cache-First Strategie
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then(response => {
        // Nur erfolgreiche GET Requests cachen
        if (request.method === 'GET' && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      });
    })
  );
});

// Background Sync Event - Score Submission Retry
self.addEventListener('sync', (event) => {
  console.log('[SW] Sync event:', event.tag);

  if (event.tag === 'sync-scores') {
    event.waitUntil(syncPendingScores());
  }
});

async function syncPendingScores() {
  console.log('[SW] Syncing pending scores...');

  try {
    const db = await openIndexedDB();
    const scores = await getAllPendingScores(db);

    console.log(`[SW] Found ${scores.length} pending scores`);

    for (const scoreData of scores) {
      try {
        const response = await fetch('/api/submit-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: scoreData.name,
            score: scoreData.score
          })
        });

        if (response.ok) {
          console.log('[SW] Score synced successfully:', scoreData.name, scoreData.score);
          await deletePendingScoreFromDB(db, scoreData.timestamp);
        } else {
          console.error('[SW] Score sync failed with status:', response.status);
        }
      } catch (error) {
        console.error('[SW] Score sync error:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync pending scores failed:', error);
    throw error;
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('straconDB', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingScores')) {
        db.createObjectStore('pendingScores', { keyPath: 'timestamp' });
      }
    };
  });
}

function getAllPendingScores(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingScores'], 'readonly');
    const store = transaction.objectStore('pendingScores');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deletePendingScoreFromDB(db, timestamp) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingScores'], 'readwrite');
    const store = transaction.objectStore('pendingScores');
    const request = store.delete(timestamp);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Periodic Background Sync Event - Leaderboard Update
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync event:', event.tag);

  if (event.tag === 'update-leaderboard') {
    event.waitUntil(updateLeaderboardCache());
  }
});

async function updateLeaderboardCache() {
  console.log('[SW] Updating leaderboard cache...');

  try {
    const response = await fetch('/api/highscores');

    if (!response.ok) {
      throw new Error('Leaderboard fetch failed');
    }

    const data = await response.json();

    const cache = await caches.open('leaderboard-cache-v1');
    await cache.put('/api/highscores', new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    }));

    console.log('[SW] Leaderboard cache updated successfully');

    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(client => {
      client.postMessage({
        type: 'LEADERBOARD_UPDATED',
        data: data
      });
    });
  } catch (error) {
    console.error('[SW] Leaderboard update failed:', error);
  }
}
