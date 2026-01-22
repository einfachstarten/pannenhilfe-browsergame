export async function fetchLeaderboard() {
  try {
    const signal =
      typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(10000) : undefined;
    const res = await fetch('/api/highscores', { signal });

    if (!res.ok) {
      if (res.status === 429) {
        throw new Error('Rate limit exceeded (429)');
      } else if (res.status >= 500) {
        throw new Error('Server error (500+)');
      }
      throw new Error(`API Error: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

export async function submitScore(name, score) {
  try {
    const res = await fetch('/api/submit-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score })
    });

    if (res.ok) {
      return res;
    }

    throw new Error('Submit failed');
  } catch (error) {
    if ('serviceWorker' in navigator && 'sync' in navigator.serviceWorker) {
      try {
        await saveToIndexedDB({ name, score, timestamp: Date.now() });

        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-scores');

        console.log('[API] Score queued for background sync');
        return { ok: true, queued: true };
      } catch (syncError) {
        console.error('[API] Background sync registration failed:', syncError);
        throw syncError;
      }
    }

    throw error;
  }
}

function openDB() {
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

async function saveToIndexedDB(scoreData) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingScores'], 'readwrite');
    const store = transaction.objectStore('pendingScores');
    const request = store.add(scoreData);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getPendingScores() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingScores'], 'readonly');
    const store = transaction.objectStore('pendingScores');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deletePendingScore(timestamp) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingScores'], 'readwrite');
    const store = transaction.objectStore('pendingScores');
    const request = store.delete(timestamp);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function adminLogin(password) {
  const res = await fetch('/api/admin/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });

  if (!res.ok) {
    throw new Error('ZUGRIFF VERWEIGERT');
  }

  return res.json();
}

export async function adminDeleteScore(password, member) {
  const res = await fetch('/api/admin/delete-score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, member })
  });

  if (!res.ok) {
    throw new Error('Löschen fehlgeschlagen');
  }

  return res;
}

export async function adminResetScores(password) {
  const res = await fetch('/api/admin/reset-highscores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });

  if (!res.ok) {
    throw new Error('Reset fehlgeschlagen');
  }

  return res;
}
