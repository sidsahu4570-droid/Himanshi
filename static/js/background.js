/* ==========================================================================
   A LETTER FOR HIMANSHI - Dynamic Canvas Particle & Visual Effects Engine
   ========================================================================== */

class BackgroundEngine {
  constructor() {
    this.canvas = document.getElementById('global-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.fireflies = [];
    this.stars = [];
    this.petals = [];
    this.snowflakes = [];
    
    this.currentSection = 'landing';
    this.initCanvas();
    this.createElements();
    this.bindEvents();
    this.animate();
  }

  initCanvas() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.initCanvas();
    });
  }

  createElements() {
    // Create Fireflies
    this.fireflies = [];
    for (let i = 0; i < 40; i++) {
      this.fireflies.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2.5 + 1,
        alpha: Math.random(),
        speedAlpha: Math.random() * 0.02 + 0.005,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        color: Math.random() > 0.5 ? '#ffb7c5' : '#ffd700'
      });
    }

    // Create Twinkling Stars
    this.stars = [];
    for (let i = 0; i < 80; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        speedAlpha: Math.random() * 0.015 + 0.005
      });
    }

    // Create Falling Flower Petals
    this.petals = [];
    for (let i = 0; i < 25; i++) {
      this.petals.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height - this.height,
        size: Math.random() * 8 + 6,
        vy: Math.random() * 1.2 + 0.6,
        vx: Math.random() * 0.6 - 0.3,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.5 + 0.5
      });
    }

    // Create Snowflakes
    this.snowflakes = [];
    for (let i = 0; i < 60; i++) {
      this.snowflakes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2 + 1,
        vy: Math.random() * 0.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.7 + 0.3
      });
    }
  }

  drawFireflies() {
    this.fireflies.forEach(f => {
      f.x += f.vx;
      f.y += f.vy;

      if (f.x < 0) f.x = this.width;
      if (f.x > this.width) f.x = 0;
      if (f.y < 0) f.y = this.height;
      if (f.y > this.height) f.y = 0;

      f.alpha += f.speedAlpha;
      if (f.alpha > 1 || f.alpha < 0.2) f.speedAlpha = -f.speedAlpha;

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, f.alpha);
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = f.color;
      this.ctx.fillStyle = f.color;
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  drawStars() {
    this.stars.forEach(s => {
      s.alpha += s.speedAlpha;
      if (s.alpha > 1 || s.alpha < 0.1) s.speedAlpha = -s.speedAlpha;

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, s.alpha);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  drawPetals() {
    this.petals.forEach(p => {
      p.y += p.vy;
      p.x += Math.sin(p.y * 0.01) * 0.8 + p.vx;
      p.rotation += p.vRot;

      if (p.y > this.height) {
        p.y = -20;
        p.x = Math.random() * this.width;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = '#ffb7c5';

      // Petal shape
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.bezierCurveTo(-p.size, -p.size, -p.size, p.size, 0, p.size * 1.5);
      this.ctx.bezierCurveTo(p.size, p.size, p.size, -p.size, 0, 0);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  drawSnow() {
    this.snowflakes.forEach(s => {
      s.y += s.vy;
      s.x += s.vx;

      if (s.y > this.height) {
        s.y = -10;
        s.x = Math.random() * this.width;
      }

      this.ctx.save();
      this.ctx.globalAlpha = s.alpha;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  enableCinematicEnding() {
    this.stars.forEach(s => {
      s.radius = Math.min(3, s.radius * 1.5);
      s.alpha = 0.9;
    });

    // Add extra fireflies
    for (let i = 0; i < 20; i++) {
      this.fireflies.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 3 + 1.5,
        alpha: Math.random() * 0.8 + 0.2,
        speedAlpha: Math.random() * 0.03 + 0.01,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        color: Math.random() > 0.5 ? '#ffd700' : '#ffb7c5'
      });
    }

    // Add extra soft floating rose petals
    for (let i = 0; i < 15; i++) {
      this.petals.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height - this.height,
        size: Math.random() * 10 + 8,
        vy: Math.random() * 0.8 + 0.4,
        vx: Math.random() * 0.5 - 0.25,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.6 + 0.4
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawStars();
    this.drawFireflies();
    this.drawPetals();
    this.drawSnow();

    requestAnimationFrame(() => this.animate());
  }
}


// Heart & Star Shower Explosion for Final Page
window.triggerHeartShower = function() {
  const canvas = document.getElementById('heart-shower-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const count = 90;

  for (let i = 0; i < count; i++) {
    const isHeart = Math.random() > 0.4;
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 + 100,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.8) * 16,
      size: Math.random() * 16 + 10,
      alpha: 1,
      decay: Math.random() * 0.015 + 0.008,
      color: isHeart ? '#ff6b8b' : '#ffd700',
      isHeart: isHeart,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 6
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    particles.forEach(p => {
      if (p.alpha > 0) {
        active = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.alpha -= p.decay;
        p.rotation += p.vRot;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;

        if (p.isHeart) {
          // Draw Heart shape
          ctx.beginPath();
          const topCurveHeight = p.size * 0.3;
          ctx.moveTo(0, topCurveHeight);
          ctx.bezierCurveTo(0, 0, -p.size / 2, 0, -p.size / 2, topCurveHeight);
          ctx.bezierCurveTo(-p.size / 2, (p.size + topCurveHeight) / 2, 0, p.size, 0, p.size);
          ctx.bezierCurveTo(0, p.size, p.size / 2, (p.size + topCurveHeight) / 2, p.size / 2, topCurveHeight);
          ctx.bezierCurveTo(p.size / 2, 0, 0, 0, 0, topCurveHeight);
          ctx.fill();
        } else {
          // Draw Star shape
          ctx.beginPath();
          for (let j = 0; j < 5; j++) {
            ctx.lineTo(Math.cos((18 + j * 72) * Math.PI / 180) * p.size, -Math.sin((18 + j * 72) * Math.PI / 180) * p.size);
            ctx.lineTo(Math.cos((54 + j * 72) * Math.PI / 180) * (p.size / 2), -Math.sin((54 + j * 72) * Math.PI / 180) * (p.size / 2));
          }
          ctx.fill();
        }
        ctx.restore();
      }
    });

    if (active) {
      requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  render();
};

document.addEventListener('DOMContentLoaded', () => {
  window.bgEngine = new BackgroundEngine();
});
