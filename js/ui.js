export function createUI() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('gameWrapper');

  const elements = {
    canvas,
    ctx,
    container,
    nameEntryScreen: document.getElementById('nameEntryScreen'),
    storyScreen: document.getElementById('storyScreen'),
    startScreen: document.getElementById('startScreen'),
    gameOverScreen: document.getElementById('gameOverScreen'),
    diagnosticOverlay: document.getElementById('diagnosticOverlay'),
    adminOverlay: document.getElementById('adminOverlay'),
    scoreBoard: document.getElementById('scoreBoard'),
    comboText: document.getElementById('comboText'),
    finalScoreDisplay: document.getElementById('finalScore'),
    repairBar: document.getElementById('repairBarContainer'),
    repairFill: document.getElementById('repairBarFill'),
    startLeaderboard: document.getElementById('startLeaderboard'),
    initialNameInput: document.getElementById('initialNameInput'),
    driverBadge: document.getElementById('driverBadge'),
    welcomeText: document.getElementById('welcomeText'),
    gameOverLeaderboard: document.getElementById('gameOverLeaderboard'),
    gameOverLeaderboardList: document.getElementById('gameOverLeaderboardList'),
    submittingScoreText: document.getElementById('submittingScoreText'),
    powerupDisplay: document.getElementById('powerupDisplay'),
    powerupIcon: document.getElementById('powerupIcon'),
    powerupTimer: document.getElementById('powerupTimer'),
    adminPassInput: document.getElementById('adminPassInput'),
    adminLoginView: document.getElementById('adminLoginView'),
    adminDataView: document.getElementById('adminDataView'),
    adminList: document.getElementById('adminList'),
    adminCloseBtn: document.getElementById('adminCloseBtn'),
    diagContainer: document.getElementById('diagContainer'),
    bootSequenceDiv: document.getElementById('bootSequence'),
    bootTextDiv: document.getElementById('bootText'),
    diagQuestionText: document.getElementById('diagQuestionText'),
    diagOptionsList: document.getElementById('diagOptionsList'),
    updateBanner: document.getElementById('updateBanner'),
    gameOverTitle: document.getElementById('gameOverTitle'),
    statRepairs: document.getElementById('statRepairs'),
    statMissed: document.getElementById('statMissed'),
    statDodged: document.getElementById('statDodged'),
    statAMDs: document.getElementById('statAMDs'),
    toast: document.getElementById('toast')
  };

  return {
    elements,
    showNameEntry() {
      elements.nameEntryScreen.style.display = 'flex';
      elements.startScreen.style.display = 'none';
      elements.storyScreen.style.display = 'none';
      elements.initialNameInput.focus();
    },
    showStoryScreen() {
      elements.nameEntryScreen.style.display = 'none';
      elements.storyScreen.style.display = 'flex';
    },
    showStartScreen() {
      elements.nameEntryScreen.style.display = 'none';
      elements.storyScreen.style.display = 'none';
      elements.startScreen.style.display = 'flex';
    },
    showGameOver() {
      elements.gameOverScreen.style.display = 'flex';
    },
    hideGameOver() {
      elements.gameOverScreen.style.display = 'none';
    },
    showDiagnosticOverlay() {
      elements.diagnosticOverlay.style.display = 'flex';
    },
    hideDiagnosticOverlay() {
      elements.diagnosticOverlay.style.display = 'none';
    },
    showDiagnosticBoot() {
      elements.bootSequenceDiv.style.display = 'block';
      elements.diagContainer.style.display = 'none';
    },
    showDiagnosticQuestion() {
      elements.bootSequenceDiv.style.display = 'none';
      elements.diagContainer.style.display = 'block';
    },
    showAdminLogin() {
      elements.adminOverlay.style.display = 'flex';
      elements.adminLoginView.style.display = 'block';
      elements.adminDataView.style.display = 'none';
      elements.adminPassInput.value = '';
      elements.adminCloseBtn.style.display = 'block';
    },
    showAdminDataView() {
      elements.adminLoginView.style.display = 'none';
      elements.adminDataView.style.display = 'flex';
      elements.adminCloseBtn.style.display = 'none';
    },
    hideAdmin() {
      elements.adminOverlay.style.display = 'none';
    },
    updateWelcomeText(name) {
      elements.welcomeText.textContent = `Hallo, ${name}!`;
    },
    updateNameBadge(value) {
      elements.driverBadge.textContent = value;
      if (value.trim().length > 0) {
        elements.driverBadge.classList.add('visible');
      } else {
        elements.driverBadge.classList.remove('visible');
      }
    },
    renderLeaderboard(data, target) {
      if (!data || data.length === 0) {
        target.innerHTML = '<div style="text-align:center; padding:10px; color:#64748b">Keine Daten</div>';
        return;
      }
      let html = '';
      data.forEach((entry, index) => {
        html += `
          <div class="leaderboard-item">
            <span class="rank">#${index + 1}</span>
            <span class="name">${entry.name || entry.member}</span>
            <span class="score">${entry.score}</span>
          </div>
        `;
      });
      target.innerHTML = html;
    },
    renderAdminList(data, onDelete) {
      if (!data || data.length === 0) {
        elements.adminList.innerHTML = '<div style="color:#94a3b8; text-align:center;">Keine Einträge</div>';
        return;
      }
      elements.adminList.innerHTML = '';
      data.forEach((entry) => {
        const name = entry.name || entry.member;
        const row = document.createElement('div');
        row.className = 'admin-item';
        const label = document.createElement('span');
        label.textContent = `${name} (${entry.score})`;
        const button = document.createElement('button');
        button.className = 'delete-btn';
        button.type = 'button';
        button.textContent = '🗑️';
        button.addEventListener('click', () => onDelete(name));
        row.appendChild(label);
        row.appendChild(button);
        elements.adminList.appendChild(row);
      });
    },
    renderDiagOptions(options, selectedIndex, onSelect) {
      elements.diagOptionsList.innerHTML = '';
      options.forEach((opt, idx) => {
        const el = document.createElement('div');
        el.className = `diag-option ${idx === selectedIndex ? 'selected' : ''}`;
        el.innerHTML = `<span class="diag-option-key">${idx + 1}</span> ${opt}`;
        el.addEventListener('click', () => onSelect(idx));
        elements.diagOptionsList.appendChild(el);
      });
    },
    typeLine(text) {
      return new Promise((resolve) => {
        const p = document.createElement('div');
        elements.bootTextDiv.appendChild(p);
        let i = 0;
        const interval = setInterval(() => {
          p.textContent += text.charAt(i);
          i += 1;
          if (i >= text.length) {
            clearInterval(interval);
            resolve();
          }
        }, 30);
      });
    },
    showToast(message, type = 'info', duration = 3000) {
      const toast = elements.toast;

      let icon = '📡';
      if (type === 'online') {
        icon = '✅';
        toast.className = 'toast online';
      } else if (type === 'offline') {
        icon = '⚠️';
        toast.className = 'toast offline';
      } else {
        toast.className = 'toast';
      }

      toast.innerHTML = `<span class="toast-icon">${icon}</span>${message}`;
      toast.classList.add('show');

      setTimeout(() => {
        toast.classList.remove('show');
      }, duration);
    }
  };
}
