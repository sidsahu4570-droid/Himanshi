/* ==========================================================================
   A LETTER FOR HIMANSHI - Interactive Sky Constellation Engine (H ❤️ S)
   ========================================================================== */

class InteractiveSky {
  constructor() {
    this.canvas = document.getElementById('sky-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.stars = [];
    this.connected = false;
    this.clickCount = 0;
    this.targetClicks = 6;
    
    this.init();
    this.bindEvents();
    this.animate();
  }

  init() {
    this.width = this.canvas.width = this.canvas.parentElement.clientWidth;
    this.height = this.canvas.height = this.canvas.parentElement.clientHeight;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.init());

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.addStar(x, y);
    });
  }

  addStar(x, y) {
    this.clickCount++;
    this.stars.push({
      x: x,
      y: y,
      radius: Math.random() * 3 + 4,
      alpha: 1,
      glow: 15,
      pulse: 0.05
    });

    const hint = document.getElementById('sky-hint-text');
    if (hint) {
      if (!this.connected) {
        const remaining = Math.max(0, this.targetClicks - this.clickCount);
        if (remaining > 0) {
          hint.innerText = `Click ${remaining} more time${remaining > 1 ? 's' : ''} to unveil the secret constellation...`;
        } else {
          hint.innerText = `Constellation Forming... ✨`;
          this.revealConstellation();
        }
      }
    }
  }

  revealConstellation() {
    if (this.connected) return;
    this.connected = true;

    // Define "H ❤️ S" predefined constellation points overlaid on canvas center
    const cx = this.width / 2;
    const cy = this.height / 2;

    this.constellationPoints = [
      // H
      { x: cx - 180, y: cy - 60 }, { x: cx - 180, y: cy + 60 },
      { x: cx - 180, y: cy }, { x: cx - 120, y: cy },
      { x: cx - 120, y: cy - 60 }, { x: cx - 120, y: cy + 60 },

      // ❤️ (Heart)
      { x: cx, y: cy + 40 },
      { x: cx - 35, y: cy - 20 },
      { x: cx - 20, y: cy - 50 },
      { x: cx, y: cy - 30 },
      { x: cx + 20, y: cy - 50 },
      { x: cx + 35, y: cy - 20 },

      // S
      { x: cx + 180, y: cy - 50 },
      { x: cx + 130, y: cy - 60 },
      { x: cx + 120, y: cy - 20 },
      { x: cx + 180, y: cy + 20 },
      { x: cx + 170, y: cy + 60 },
      { x: cx + 120, y: cy + 50 }
    ];

    // Smooth transition: replace clicked stars with constellation points
    this.stars = this.constellationPoints.map(p => ({
      x: p.x,
      y: p.y,
      radius: 5,
      alpha: 1,
      glow: 20,
      pulse: 0.08
    }));

    const instructions = document.querySelector('.sky-instructions');
    if (instructions) {
      instructions.classList.add('constellation-active');
    }

    const hint = document.getElementById('sky-hint-text');
    if (hint) {
      hint.innerHTML = `<span style="color: #ffb7c5; font-family: var(--font-script); font-size: 1.8rem; text-shadow: 0 0 20px rgba(255, 183, 197, 0.8);">Himanshi ❤️ Siddharth</span>`;
    }
  }


  drawLines() {
    if (!this.connected || this.stars.length === 0) return;

    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(255, 183, 197, 0.7)';
    this.ctx.lineWidth = 2;
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = '#ff6b8b';

    // Connect H
    this.drawLine(this.stars[0], this.stars[1]);
    this.drawLine(this.stars[2], this.stars[3]);
    this.drawLine(this.stars[4], this.stars[5]);

    // Connect Heart
    this.drawLine(this.stars[6], this.stars[7]);
    this.drawLine(this.stars[7], this.stars[8]);
    this.drawLine(this.stars[8], this.stars[9]);
    this.drawLine(this.stars[9], this.stars[10]);
    this.drawLine(this.stars[10], this.stars[11]);
    this.drawLine(this.stars[11], this.stars[6]);

    // Connect S
    this.drawLine(this.stars[12], this.stars[13]);
    this.drawLine(this.stars[13], this.stars[14]);
    this.drawLine(this.stars[14], this.stars[15]);
    this.drawLine(this.stars[15], this.stars[16]);
    this.drawLine(this.stars[16], this.stars[17]);

    this.ctx.restore();
  }

  drawLine(p1, p2) {
    if (!p1 || !p2) return;
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.stroke();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.drawLines();

    // Draw Stars
    this.stars.forEach(s => {
      s.glow += s.pulse;
      if (s.glow > 25 || s.glow < 10) s.pulse = -s.pulse;

      this.ctx.save();
      this.ctx.globalAlpha = s.alpha;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowBlur = s.glow;
      this.ctx.shadowColor = '#ffd700';

      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.interactiveSky = new InteractiveSky();
});
