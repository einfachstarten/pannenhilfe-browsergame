import {
  baseSpeed,
  diagnosticQuestions,
  fallbackLeaderboard,
  powerupDurationMs,
  repairDuration
} from './config.js';
import { Car, FloatingSign, createPlayer } from './entities.js';
import * as api from './api.js';

export function createGame(ui) {
  const { elements } = ui;
  const state = {
    canvas: elements.canvas,
    ctx: elements.ctx,
    container: elements.container,
    gameState: 'INIT',
    score: 0,
    roadOffset: 0,
    baseSpeed,
    gameSpeed: baseSpeed,
    currentLeaderboard: [],
    repairsCount: 0,
    missedRepairs: 0,
    dodgedCars: 0,
    solvedAMDs: 0,
    currentPlayerName: null,
    combo: 0,
    currentDiagQuestion: null,
    diagSelectedIndex: 0,
    shieldActive: false,
    magnetActive: false,
    powerupEndTime: 0,
    nextPowerupType: 'shield',
    repairTimer: 0,
    currentTarget: null,
    player: createPlayer(),
    cars: [],
    particles: [],
    floatingTexts: [],
    touchX: null
  };

  let adminPassword = '';

  function resizeCanvas() {
    state.canvas.width = state.container.clientWidth;
    state.canvas.height = state.container.clientHeight;
  }

  function showNameEntry() {
    ui.showNameEntry();
  }

  function showStoryScreen() {
    ui.showStoryScreen();
  }

  function showStartScreen() {
    ui.showStartScreen();
    state.gameState = 'START';
    fetchLeaderboard();
  }

  function initGame() {
    const storedName = localStorage.getItem('pannenfahrerName');

    if (storedName) {
      state.currentPlayerName = storedName;
      ui.updateWelcomeText(state.currentPlayerName);
      showStartScreen();
    } else {
      showNameEntry();
    }
  }

  function updateNameBadge() {
    const val = elements.initialNameInput.value;
    ui.updateNameBadge(val);
  }

  function saveNameAndStart() {
    const name = elements.initialNameInput.value.trim();
    if (!name) return;

    const cleanName = name.charAt(0).toUpperCase() + name.slice(1);

    localStorage.setItem('pannenfahrerName', cleanName);
    state.currentPlayerName = cleanName;
    ui.updateWelcomeText(state.currentPlayerName);
    showStoryScreen();
  }

  function finishStory() {
    showStartScreen();
  }

  function logout() {
    localStorage.removeItem('pannenfahrerName');
    state.currentPlayerName = null;
    elements.initialNameInput.value = '';
    ui.updateNameBadge('');
    initGame();
  }

  async function fetchLeaderboard() {
    try {
      const data = await api.fetchLeaderboard();
      state.currentLeaderboard = data;
      ui.renderLeaderboard(data, elements.startLeaderboard);
    } catch (e) {
      if (state.currentLeaderboard.length === 0) {
        ui.renderLeaderboard(fallbackLeaderboard, elements.startLeaderboard);
      }
    }
  }

  async function autoSubmitScore() {
    if (!state.currentPlayerName || state.score <= 0) {
      elements.gameOverLeaderboard.style.display = 'block';
      ui.renderLeaderboard(state.currentLeaderboard, elements.gameOverLeaderboardList);
      return;
    }

    elements.submittingScoreText.style.display = 'block';

    const existingEntry = state.currentLeaderboard.find(
      (entry) => (entry.name || entry.member) === state.currentPlayerName
    );
    if (existingEntry && existingEntry.score >= state.score) {
      elements.submittingScoreText.textContent = `> Dein Rekord (${existingEntry.score}) bleibt bestehen.`;
      elements.gameOverLeaderboard.style.display = 'block';
      ui.renderLeaderboard(state.currentLeaderboard, elements.gameOverLeaderboardList);
      return;
    }

    try {
      const res = await api.submitScore(state.currentPlayerName, state.score);
      if (res.queued) {
        elements.submittingScoreText.textContent = '> SCORE IN WARTESCHLANGE. WIRD GESENDET.';
        elements.submittingScoreText.style.color = '#f59e0b';
        elements.gameOverLeaderboard.style.display = 'block';
        ui.renderLeaderboard(state.currentLeaderboard, elements.gameOverLeaderboardList);
      } else if (res.ok) {
        elements.submittingScoreText.textContent = '> DATEN ÜBERTRAGEN. HIGHSCORE!';
        elements.submittingScoreText.style.color = 'var(--success-color)';

        const newData = await api.fetchLeaderboard();
        state.currentLeaderboard = newData;

        elements.gameOverLeaderboard.style.display = 'block';
        ui.renderLeaderboard(newData, elements.gameOverLeaderboardList);
      } else {
        elements.submittingScoreText.textContent = '> FEHLER BEI DER ÜBERTRAGUNG.';
      }
    } catch (e) {
      console.error(e);
      elements.submittingScoreText.textContent = '> OFFLINE MODUS.';
      elements.gameOverLeaderboard.style.display = 'block';
      ui.renderLeaderboard(state.currentLeaderboard, elements.gameOverLeaderboardList);
    }
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'LEADERBOARD_UPDATED') {
        console.log('[Game] Leaderboard updated from background sync');

        state.currentLeaderboard = event.data.data;

        if (elements.startScreen.style.display === 'flex') {
          ui.renderLeaderboard(event.data.data, elements.startLeaderboard);
        }
      }
    });
  }

  function toggleAdmin() {
    ui.showAdminLogin();
  }

  function closeAdmin() {
    ui.hideAdmin();
  }

  async function adminLogin() {
    const pwd = elements.adminPassInput.value;
    if (!pwd) return;
    adminPassword = pwd;

    try {
      const data = await api.adminLogin(adminPassword);
      ui.renderAdminList(data, adminDelete);
      ui.showAdminDataView();
    } catch (e) {
      console.error(e);
      alert('ZUGRIFF VERWEIGERT.');
    }
  }

  async function adminDelete(member) {
    if (!confirm(`${member} wirklich löschen?`)) return;

    try {
      await api.adminDeleteScore(adminPassword, member);
      const data = await api.adminLogin(adminPassword);
      ui.renderAdminList(data, adminDelete);
      fetchLeaderboard();
    } catch (e) {
      console.error(e);
      alert('Löschen fehlgeschlagen.');
    }
  }

  async function adminResetAll() {
    if (!confirm('WARNUNG: ALLE HIGHSCORES WERDEN UNWIDERRUFLICH GELÖSCHT!')) return;

    try {
      await api.adminResetScores(adminPassword);
      alert('DATENBANK BEREINIGT.');
      elements.adminList.innerHTML = '';
      fetchLeaderboard();
    } catch (e) {
      console.error(e);
    }
  }

  async function triggerDiagnosticMode() {
    state.gameState = 'BOOTING';
    ui.showDiagnosticOverlay();
    ui.showDiagnosticBoot();

    const lines = [
      '> ESTABLISHING SECURE CONNECTION...',
      '> VERBINDUNG HERGESTELLT.',
      '> INITIALISIERE AMD...',
      '> FEHLERCODES ERKANNT.',
      '> BITTE DIAGNOSTIZIEREN SIE!'
    ];

    elements.bootTextDiv.innerHTML = '';
    for (const line of lines) {
      await ui.typeLine(line);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    ui.showDiagnosticQuestion();
    state.gameState = 'DIAGNOSING';

    state.currentDiagQuestion =
      diagnosticQuestions[Math.floor(Math.random() * diagnosticQuestions.length)];
    state.diagSelectedIndex = 0;

    elements.diagQuestionText.textContent = state.currentDiagQuestion.scenario;
    renderDiagOptions();
  }

  function renderDiagOptions() {
    ui.renderDiagOptions(state.currentDiagQuestion.options, state.diagSelectedIndex, (idx) => {
      state.diagSelectedIndex = idx;
      renderDiagOptions();
    });
  }

  function resolveDiagnostic() {
    const isCorrect = state.diagSelectedIndex === state.currentDiagQuestion.correct;

    ui.hideDiagnosticOverlay();

    if (isCorrect) {
      state.score += 50;
      state.solvedAMDs += 1;
      state.floatingTexts.push(
        new FloatingSign(state.player.x, state.player.y - 60, 'SYSTEM OK! +50', '#10b981', state.ctx)
      );
      activatePowerup();
    } else {
      state.score -= 50;
      state.floatingTexts.push(
        new FloatingSign(
          state.player.x,
          state.player.y - 60,
          'SYSTEM FAILURE! -50',
          '#ef4444',
          state.ctx
        )
      );
    }

    elements.scoreBoard.textContent = state.score;

    state.gameState = 'PLAYING';
    spawnCar();
  }

  function activatePowerup() {
    state.powerupEndTime = Date.now() + powerupDurationMs;

    if (state.nextPowerupType === 'shield') {
      state.shieldActive = true;
      state.magnetActive = false;
      elements.powerupIcon.innerText = '🛡️';
      elements.powerupDisplay.style.color = 'var(--shield-color)';
      state.nextPowerupType = 'magnet';
      state.floatingTexts.push(
        new FloatingSign(
          state.player.x,
          state.player.y - 90,
          'Unfallschild!!',
          'var(--shield-color)',
          state.ctx
        )
      );
    } else {
      state.magnetActive = true;
      state.shieldActive = false;
      elements.powerupIcon.innerText = '🧲';
      elements.powerupDisplay.style.color = 'var(--magnet-color)';
      state.nextPowerupType = 'shield';
      state.floatingTexts.push(
        new FloatingSign(
          state.player.x,
          state.player.y - 90,
          'Connectivity Magnet!!',
          'var(--magnet-color)',
          state.ctx
        )
      );
    }

    elements.powerupDisplay.style.display = 'flex';
  }

  function drawVehicle(x, y, w, h, color, type, blinkerOn) {
    const ctx = state.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(x + 8, y + 8, w, h);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);

    if (type === 'towtruck') {
      ctx.fillStyle = '#e6b800';
      ctx.fillRect(x, y, w, h * 0.35);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(x + 4, y + h * 0.4, w - 8, h * 0.55);
      ctx.fillStyle = '#ffdb4d';
      ctx.fillRect(x + 5, y + 5, w - 10, 4);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 5, y + 10, w - 10, 10);

      if (state.gameState === 'REPAIRING') {
        const time = Date.now() / 100;
        const alpha = (Math.sin(time * 5) + 1) / 2 * 0.6 + 0.4;
        const cx = x + w / 2;
        const cy = y + 7;
        const g = ctx.createRadialGradient(cx, cy, 5, cx, cy, 50);
        g.addColorStop(0, `rgba(255, 205, 0, ${alpha})`);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffcd00';
        ctx.fillStyle = '#ffe680';
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (state.shieldActive) {
        const time = Date.now() / 200;
        const pulse = (Math.sin(time) + 1) / 2 * 0.4 + 0.3;

        ctx.strokeStyle = 'var(--shield-color)';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'var(--shield-color)';

        ctx.globalAlpha = pulse;
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, 60, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      }

      if (state.magnetActive) {
        const time = Date.now() / 150;
        ctx.strokeStyle = 'var(--magnet-color)';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'var(--magnet-color)';

        for (let i = 0; i < 3; i += 1) {
          const offset = (time + i * 10) % 40;
          const alpha = 1 - offset / 40;
          const radius = 40 + offset;

          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(x + w / 2, y + h / 2, radius, Math.PI, 2 * Math.PI);
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      }
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x + 4, y + 12, w - 8, 10);
      ctx.fillRect(x + 4, y + h - 18, w - 8, 8);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(x + 6, y + 20, w - 12, h - 35);
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(x + 2, y + h - 5, 8, 4);
      ctx.fillRect(x + w - 10, y + h - 5, 8, 4);
    }

    if (blinkerOn) {
      ctx.fillStyle = '#f97316';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ea580c';
      ctx.fillRect(x - 4, y, 8, 8);
      ctx.fillRect(x + w - 4, y, 8, 8);
      ctx.fillRect(x - 4, y + h - 8, 8, 8);
      ctx.fillRect(x + w - 4, y + h - 8, 8, 8);
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  }

  function spawnCar() {
    if (state.gameState !== 'PLAYING') return;
    state.cars.push(new Car(Math.random() < 0.35, state));

    const difficultyFactor = Math.min(0.5, state.repairsCount * 0.02);
    const minTime = 700 * (1 - difficultyFactor);
    const variance = 900 * (1 - difficultyFactor);
    setTimeout(spawnCar, Math.random() * variance + minTime);
  }

  function handleInput(type, code) {
    if (elements.adminOverlay.style.display === 'flex' && type === 'keydown') {
      if (code === 'Enter') adminLogin();
      if (code === 'Escape') closeAdmin();
      return;
    }

    if ((state.gameState === 'DIAGNOSING' || state.gameState === 'BOOTING') && type === 'keydown') {
      if (state.gameState === 'BOOTING') return;
      if (code === 'ArrowUp') {
        state.diagSelectedIndex = Math.max(0, state.diagSelectedIndex - 1);
        renderDiagOptions();
      } else if (code === 'ArrowDown') {
        state.diagSelectedIndex = Math.min(3, state.diagSelectedIndex + 1);
        renderDiagOptions();
      } else if (code === 'Enter' || code === 'Space') {
        resolveDiagnostic();
      }
      return;
    }

    if (type === 'keydown') {
      if (state.gameState === 'GAMEOVER' && code === 'Space') {
        if (document.activeElement.tagName === 'INPUT') return;
        resetGame();
      }

      if (state.gameState === 'START' && (code === 'Space' || code === 'Enter')) {
        startGame();
      }

      if (elements.nameEntryScreen.style.display === 'flex' && code === 'Enter') {
        saveNameAndStart();
      }

      if (code === 'ArrowLeft' || code === 'KeyA') state.player.moveLeft = true;
      if (code === 'ArrowRight' || code === 'KeyD') state.player.moveRight = true;
    }
    if (type === 'keyup') {
      if (code === 'ArrowLeft' || code === 'KeyA') state.player.moveLeft = false;
      if (code === 'ArrowRight' || code === 'KeyD') state.player.moveRight = false;
    }
  }

  function handleTouchStart(event) {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'BUTTON') return;
    state.touchX = event.touches[0].clientX;
    if (event.cancelable && state.gameState === 'PLAYING') event.preventDefault();
  }

  function handleTouchMove(event) {
    if (state.touchX !== null && state.gameState === 'PLAYING') {
      const diff = event.touches[0].clientX - state.touchX;
      state.player.x += diff * 1.5;
      if (state.player.x < 0) state.player.x = 0;
      if (state.player.x > state.canvas.width - state.player.width) {
        state.player.x = state.canvas.width - state.player.width;
      }
    }
    state.touchX = event.touches[0].clientX;
    if (event.cancelable && state.gameState === 'PLAYING') event.preventDefault();
  }

  function startGame() {
    state.gameState = 'PLAYING';
    elements.startScreen.style.display = 'none';
    state.player.x = state.canvas.width / 2 - state.player.width / 2;
    state.player.y = state.canvas.height - 130;
    state.cars = [];
    state.particles = [];
    state.floatingTexts = [];
    state.score = 0;
    state.repairsCount = 0;
    state.missedRepairs = 0;
    state.dodgedCars = 0;
    state.solvedAMDs = 0;
    state.gameSpeed = state.baseSpeed;
    state.combo = 0;
    state.shieldActive = false;
    state.magnetActive = false;
    state.powerupEndTime = 0;
    elements.powerupDisplay.style.display = 'none';
    elements.scoreBoard.textContent = 0;
    elements.scoreBoard.style.color = '#fff';
    elements.comboText.style.display = 'none';
    spawnCar();
    animate();
  }

  function resetGame() {
    ui.hideGameOver();
    ui.hideDiagnosticOverlay();
    fetchLeaderboard();
    elements.startScreen.style.display = 'flex';
    state.gameState = 'START';
  }

  function startRepair(targetCar) {
    state.gameState = 'REPAIRING';
    state.currentTarget = targetCar;
    state.repairTimer = 0;
    elements.repairBar.style.display = 'block';
    elements.repairBar.style.left = `${state.player.x - 8}px`;
    elements.repairBar.style.top = `${state.player.y - 20}px`;
  }

  function finishRepair() {
    state.combo += 1;
    const points = 10 + state.combo * 2;
    state.score += points;
    state.repairsCount += 1;

    let comboMsg = `+${points}`;
    if (state.combo > 1) {
      comboMsg += ` (Combo x${state.combo})`;
      elements.comboText.style.display = 'block';
      elements.comboText.textContent = `COMBO x${state.combo}`;
      elements.comboText.style.transform = `scale(${1 + Math.min(0.5, state.combo * 0.1)})`;
    }

    elements.repairBar.style.display = 'none';
    if (state.currentTarget) {
      state.currentTarget.repaired = true;
      state.currentTarget.isBroken = false;
      state.currentTarget.color = '#10b981';
      state.currentTarget.speed = 6;
    }
    state.currentTarget = null;
    elements.scoreBoard.textContent = state.score;

    if (state.repairsCount % 5 === 0) {
      state.gameSpeed = Math.min(12, state.baseSpeed + (state.repairsCount / 5) * 0.5);
      state.floatingTexts.push(
        new FloatingSign(state.player.x, state.player.y - 80, 'LEVEL UP! FASTER!', '#f59e0b', state.ctx)
      );
    }

    if (state.repairsCount > 0 && state.repairsCount % 20 === 0) {
      triggerDiagnosticMode();
    } else {
      state.gameState = 'PLAYING';
      state.floatingTexts.push(
        new FloatingSign(state.player.x, state.player.y - 40, comboMsg, '#10b981', state.ctx)
      );
      spawnCar();
    }
  }

  function crash(reason) {
    state.gameState = 'GAMEOVER';
    elements.finalScoreDisplay.textContent = state.score;
    if (elements.gameOverTitle) elements.gameOverTitle.textContent = reason || 'Unfall!';

    elements.statRepairs.textContent = state.repairsCount;
    elements.statMissed.textContent = state.missedRepairs;
    elements.statDodged.textContent = state.dodgedCars;
    elements.statAMDs.textContent = state.solvedAMDs;

    autoSubmitScore();

    ui.showGameOver();
    elements.repairBar.style.display = 'none';
    ui.hideDiagnosticOverlay();
  }

  function update() {
    state.particles.forEach((p, i) => {
      p.update();
      if (p.alpha <= 0) state.particles.splice(i, 1);
    });
    state.floatingTexts.forEach((ft, i) => {
      ft.update();
      if (ft.life <= 0) state.floatingTexts.splice(i, 1);
    });

    if (state.shieldActive || state.magnetActive) {
      const remaining = Math.ceil((state.powerupEndTime - Date.now()) / 1000);
      if (remaining <= 0) {
        state.shieldActive = false;
        state.magnetActive = false;
        elements.powerupDisplay.style.display = 'none';
        state.floatingTexts.push(
          new FloatingSign(state.player.x, state.player.y - 60, 'POWERUP ABGELAUFEN', '#ef4444', state.ctx)
        );
      } else {
        elements.powerupTimer.innerText = `${remaining}s`;
      }
    }

    if (state.gameState === 'PLAYING') {
      state.roadOffset += state.gameSpeed;
      if (state.roadOffset > 40) state.roadOffset = 0;
      if (state.player.moveLeft && state.player.x > 0) state.player.x -= state.player.speed;
      if (state.player.moveRight && state.player.x < state.canvas.width - state.player.width) {
        state.player.x += state.player.speed;
      }

      state.cars.forEach((car, index) => {
        car.update();
        let padding = 6;

        if (state.magnetActive && car.isBroken && !car.repaired) {
          padding = -60;
        }

        if (
          state.player.x + padding < car.x + car.width - padding &&
          state.player.x + state.player.width - padding > car.x + padding &&
          state.player.y + padding < car.y + car.height - padding &&
          state.player.y + state.player.height - padding > car.y + padding
        ) {
          if (car.isBroken && !car.repaired) {
            startRepair(car);
          } else if (!car.isBroken && !car.repaired) {
            if (!state.shieldActive) {
              crash('Unfall!');
            } else if (!car.hitByShield) {
              state.floatingTexts.push(
                new FloatingSign(car.x + car.width / 2, car.y, 'ABGEWEHRT!', '#06b6d4', state.ctx)
              );
              car.hitByShield = true;
            }
          }
        }
        if (car.y > state.canvas.height + 50) {
          if (car.isBroken && !car.repaired) {
            state.score -= 5;
            state.missedRepairs += 1;
            elements.scoreBoard.textContent = state.score;
            state.floatingTexts.push(
              new FloatingSign(car.x + car.width / 2 - 10, state.canvas.height - 40, '-5', '#ef4444', state.ctx)
            );

            if (state.combo > 0) {
              state.floatingTexts.push(
                new FloatingSign(
                  state.player.x,
                  state.player.y - 80,
                  'C-C-C-Combo breaker!!!!',
                  '#ef4444',
                  state.ctx
                )
              );
              state.combo = 0;
              elements.comboText.style.display = 'none';
            }

            elements.scoreBoard.style.color = '#ef4444';
            if (state.score < 0) {
              crash('Pannenquote!');
            } else {
              setTimeout(() => {
                if (state.gameState === 'PLAYING') elements.scoreBoard.style.color = '#fff';
              }, 300);
            }
          } else if (!car.isBroken) {
            state.dodgedCars += 1;
          }
          state.cars.splice(index, 1);
        }
      });
    } else if (state.gameState === 'REPAIRING') {
      state.repairTimer += 1;
      const pct = (state.repairTimer / repairDuration) * 100;
      elements.repairFill.style.width = `${pct}%`;
      elements.repairBar.style.left = `${state.player.x - 8}px`;
      if (state.repairTimer >= repairDuration) finishRepair();
    }
  }

  function draw() {
    const ctx = state.ctx;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.setLineDash([30, 40]);
    ctx.lineDashOffset = -state.roadOffset;
    ctx.beginPath();
    ctx.moveTo(state.canvas.width / 2, -50);
    ctx.lineTo(state.canvas.width / 2, state.canvas.height + 50);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(10, state.canvas.height);
    ctx.moveTo(state.canvas.width - 10, 0);
    ctx.lineTo(state.canvas.width - 10, state.canvas.height);
    ctx.stroke();

    state.cars.forEach((car) => drawVehicle(car.x, car.y, car.width, car.height, car.color, 'car', car.blinkerState));
    state.player.y = state.canvas.height - 130;
    drawVehicle(state.player.x, state.player.y, state.player.width, state.player.height, state.player.color, 'towtruck', false);
    state.particles.forEach((p) => p.draw());
    state.floatingTexts.forEach((ft) => ft.draw());
  }

  function animate() {
    if (state.gameState !== 'GAMEOVER') {
      update();
      draw();
      requestAnimationFrame(animate);
    }
  }

  function init() {
    resizeCanvas();
    state.player.y = state.canvas.height - 130;
    state.player.x = state.canvas.width / 2 - 22;
    draw();
    initGame();
  }

  return {
    init,
    resizeCanvas,
    updateNameBadge,
    saveNameAndStart,
    finishStory,
    startGame,
    resetGame,
    logout,
    toggleAdmin,
    closeAdmin,
    adminLogin,
    adminResetAll,
    triggerDiagnosticMode,
    resolveDiagnostic,
    handleInput,
    handleTouchStart,
    handleTouchMove
  };
}
