import { carColors, colorFallbacks } from './config.js';

export function createPlayer() {
  return { x: 0, y: 0, width: 44, height: 75, speed: 8, color: '#ffcd00', type: 'towtruck' };
}

export class FloatingSign {
  constructor(x, y, text, color, ctx) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.ctx = ctx;
    this.life = 1.0;
    this.vy = -2;
    this.rotation = (Math.random() - 0.5) * 0.3;
    this.scale = 0;
  }

  update() {
    this.y += this.vy;
    this.life -= 0.015;
    if (this.scale < 1.2 && this.life > 0.8) {
      this.scale += 0.2;
    } else if (this.scale > 1.0) {
      this.scale -= 0.05;
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);
    ctx.globalAlpha = Math.max(0, this.life);

    let actualColor = this.color;
    if (this.color.startsWith('var')) {
      if (this.color.includes('shield')) actualColor = colorFallbacks.shield;
      else if (this.color.includes('magnet')) actualColor = colorFallbacks.magnet;
      else if (this.color.includes('success')) actualColor = colorFallbacks.success;
      else if (this.color.includes('danger')) actualColor = colorFallbacks.danger;
      else actualColor = colorFallbacks.default;
    }

    ctx.font = "bold 16px 'Courier New', monospace";
    const textWidth = ctx.measureText(this.text).width;
    const padding = 10;
    const boxWidth = textWidth + padding * 2;
    const boxHeight = 34;

    ctx.shadowColor = actualColor;
    ctx.shadowBlur = 15;

    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = actualColor;
    ctx.lineWidth = 2;

    ctx.beginPath();
    const x = -boxWidth / 2;
    const y = -boxHeight / 2;
    const w = boxWidth;
    const h = boxHeight;
    const r = 8;
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, 0, 0);

    ctx.restore();
  }
}

export class Smoke {
  constructor(x, y, ctx) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 6 + 3;
    this.alpha = 0.6;
    this.vy = -1 - Math.random() * 1.5;
    this.vx = (Math.random() - 0.5) * 3;
    this.ctx = ctx;
  }

  update() {
    this.y += this.vy;
    this.x += this.vx;
    this.alpha -= 0.03;
    this.size += 0.15;
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = `rgba(148, 163, 184, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export class Car {
  constructor(isBroken, state) {
    this.width = 40;
    this.height = 65;
    this.x = Math.random() * (state.canvas.width - 50);
    this.y = -100;
    this.isBroken = isBroken;
    this.speed = isBroken ? 0.5 : Math.random() * 2 + 3;
    this.color = isBroken ? '#64748b' : carColors[Math.floor(Math.random() * carColors.length)];
    this.repaired = false;
    this.blinkerState = false;
    this.blinkerTimer = 0;
    this.state = state;
  }

  update() {
    const { state } = this;
    if (state.gameState === 'PLAYING') {
      const moveSpeed = this.isBroken ? state.gameSpeed : state.gameSpeed + this.speed * 0.5;
      this.y += moveSpeed;
    }
    if (this.isBroken && !this.repaired) {
      this.blinkerTimer += 1;
      if (this.blinkerTimer > 8) {
        this.blinkerState = !this.blinkerState;
        this.blinkerTimer = 0;
      }
      if (Math.random() > 0.6) {
        state.particles.push(new Smoke(this.x + this.width / 2, this.y + 10, state.ctx));
      }
    }
  }
}
