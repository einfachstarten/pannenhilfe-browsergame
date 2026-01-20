export async function fetchLeaderboard() {
  const res = await fetch('/api/highscores');
  if (!res.ok) {
    throw new Error('API Offline');
  }
  return res.json();
}

export async function submitScore(name, score) {
  const res = await fetch('/api/submit-score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, score })
  });
  return res;
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
