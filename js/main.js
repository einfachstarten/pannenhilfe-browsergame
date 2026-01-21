import { createUI } from './ui.js';
import { createGame } from './game.js';

const ui = createUI();
const game = createGame(ui);

const nameInput = document.getElementById('initialNameInput');
const saveNameBtn = document.getElementById('saveNameBtn');
const finishStoryBtn = document.getElementById('finishStoryBtn');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminResetBtn = document.getElementById('adminResetBtn');
const adminCloseBtn = document.getElementById('adminCloseBtn');
const adminCloseDataBtn = document.getElementById('adminCloseDataBtn');
const forceReloadBtn = document.getElementById('forceReloadBtn');
const applyUpdateBtn = document.getElementById('applyUpdateBtn');
const startGameBtn = document.getElementById('startGameBtn');
const logoutBtn = document.getElementById('logoutBtn');
const diagConfirmBtn = document.getElementById('diagConfirmBtn');
const resetGameBtn = document.getElementById('resetGameBtn');
const adminToggleBtn = document.getElementById('adminToggleBtn');

if (nameInput) {
  nameInput.addEventListener('input', () => game.updateNameBadge());
}
if (saveNameBtn) {
  saveNameBtn.addEventListener('click', () => game.saveNameAndStart());
}
if (finishStoryBtn) {
  finishStoryBtn.addEventListener('click', () => game.finishStory());
}
if (adminLoginBtn) {
  adminLoginBtn.addEventListener('click', () => game.adminLogin());
}
if (adminResetBtn) {
  adminResetBtn.addEventListener('click', () => game.adminResetAll());
}
if (adminCloseBtn) {
  adminCloseBtn.addEventListener('click', () => game.closeAdmin());
}
if (adminCloseDataBtn) {
  adminCloseDataBtn.addEventListener('click', () => game.closeAdmin());
}
if (startGameBtn) {
  startGameBtn.addEventListener('click', () => game.startGame());
}
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => game.logout());
}
if (diagConfirmBtn) {
  diagConfirmBtn.addEventListener('click', () => game.resolveDiagnostic());
}
if (resetGameBtn) {
  resetGameBtn.addEventListener('click', () => game.resetGame());
}
if (adminToggleBtn) {
  adminToggleBtn.addEventListener('click', () => game.toggleAdmin());
}

window.addEventListener('keydown', (event) => game.handleInput('keydown', event.code));
window.addEventListener('keyup', (event) => game.handleInput('keyup', event.code));
window.addEventListener('resize', () => game.resizeCanvas());

if (ui.elements.container) {
  ui.elements.container.addEventListener('touchstart', (event) => game.handleTouchStart(event));
  ui.elements.container.addEventListener('touchmove', (event) => game.handleTouchMove(event));
}

async function forceReload() {
  if (!confirm('PWA Cache leeren und Seite neu laden?')) return;

  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
  }

  if ('caches' in window) {
    const keys = await caches.keys();
    for (const key of keys) {
      await caches.delete(key);
    }
  }

  window.location.reload();
}

if (forceReloadBtn) {
  forceReloadBtn.addEventListener('click', () => forceReload());
}

function applyUpdate() {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
    });
    window.location.reload();
  });
}

if (applyUpdateBtn) {
  applyUpdateBtn.addEventListener('click', () => applyUpdate());
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(async (reg) => {
        console.log('SW registered');

        if ('periodicSync' in reg) {
          try {
            await reg.periodicSync.register('update-leaderboard', {
              minInterval: 24 * 60 * 60 * 1000
            });
            console.log('[Main] Periodic sync registered for leaderboard updates');
          } catch (error) {
            console.error('[Main] Periodic sync registration failed:', error);
          }
        }

        reg.onupdatefound = () => {
          const newWorker = reg.installing;
          newWorker.onstatechange = () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              ui.elements.updateBanner.style.display = 'flex';
            }
          };
        };
      })
      .catch((err) => console.log('SW failed', err));
  });
}

game.init();
