/* ==========================================================================
   A LETTER FOR HIMANSHI - Main Application Controller (GSAP + Interactions)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  initCursor();
  initCinematicIntroSequence();
  initAudioToggle();
  initScrollAnimations();
  initCinematicApologyScene();
  initPolaroids();
  initFinalButton();
});

/* ==========================================================================
   1. CUSTOM CURSOR
   ========================================================================== */
function initCursor() {
  const glow = document.querySelector('.cursor-glow');
  const dot = document.querySelector('.cursor-dot');

  if (!glow || !dot) return;

  window.addEventListener('mousemove', (e) => {
    gsap.to(glow, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.6,
      ease: 'power2.out'
    });
    gsap.to(dot, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: 'power2.out'
    });
  });
}

/* ==========================================================================
   2. LANDING SCREEN SEQUENCE
   ========================================================================== */
/* ==========================================================================
   2. CINEMATIC MOVIE INTRODUCTION SEQUENCE
   ========================================================================== */
function initCinematicIntroSequence() {
  const startBtn = document.getElementById('intro-start-btn');
  const startOverlay = document.getElementById('intro-start-overlay');
  const audioBtn = document.getElementById('audio-toggle-btn');

  const scene2 = document.getElementById('intro-scene-2');
  const planeWrap = document.querySelector('.intro-airplane-wrap');
  const s2Heading = document.querySelector('.intro-script-heading');

  const scene3 = document.getElementById('intro-scene-3');
  const s3Line1 = document.getElementById('s3-line1');
  const s3Line2 = document.getElementById('s3-line2');
  const s3Line3 = document.getElementById('s3-line3');

  const scene4 = document.getElementById('intro-scene-4');
  const parchment = document.getElementById('parchment-paper');
  const inkBody = document.getElementById('ink-content');

  const introCanvasEngine = initIntroCanvas();

  if (!startBtn) return;

  startBtn.addEventListener('click', () => {
    if (window.romanticAudio) {
      window.romanticAudio.start();
    }
    if (audioBtn) {
      audioBtn.classList.add('visible');
    }

    gsap.to(startOverlay, {
      opacity: 0,
      duration: 1.2,
      onComplete: () => {
        startOverlay.style.display = 'none';
        
        // SCENE 1: Moon rises, starry night, fireflies. 5 Seconds NO text.
        if (introCanvasEngine && introCanvasEngine.startMoonRise) {
          introCanvasEngine.startMoonRise();
        }

        setTimeout(() => {
          playScene2();
        }, 5000);
      }
    });
  });

  // SCENE 2: Paper Airplane & Handwritten Text
  function playScene2() {
    scene2.style.display = 'flex';

    gsap.fromTo(planeWrap, 
      { x: '-10vw', y: '60vh', opacity: 0, rotate: -15 },
      { x: '110vw', y: '20vh', opacity: 1, rotate: 10, duration: 4.5, ease: 'power1.inOut' }
    );

    gsap.fromTo(s2Heading,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.8, delay: 1.0, ease: 'power2.out',
        onComplete: () => {
          setTimeout(() => {
            gsap.to(scene2, {
              opacity: 0,
              duration: 1.5,
              onComplete: () => {
                scene2.style.display = 'none';
                playScene3();
              }
            });
          }, 3500);
        }
      }
    );
  }

  // SCENE 3: Moonlight Water Reflection & Typewriter
  function playScene3() {
    scene3.style.display = 'flex';
    const waterLayer = document.getElementById('intro-water-layer');
    if (waterLayer) waterLayer.classList.add('active');

    const lines = [
      { el: s3Line1, text: "This isn't a request." },
      { el: s3Line2, text: "It's simply a story I never got to finish." },
      { el: s3Line3, text: "And it begins with you..." }
    ];

    function typeScene3Line(idx) {
      if (idx < lines.length) {
        const item = lines[idx];
        let charIdx = 0;
        function typeChar() {
          if (charIdx < item.text.length) {
            item.el.textContent += item.text.charAt(charIdx);
            charIdx++;
            setTimeout(typeChar, 45);
          } else {
            const pause = (idx === lines.length - 1) ? 2200 : 1200;
            setTimeout(() => {
              typeScene3Line(idx + 1);
            }, pause);
          }
        }
        typeChar();
      } else {
        gsap.to(scene3, {
          opacity: 0,
          duration: 1.5,
          onComplete: () => {
            scene3.style.display = 'none';
            playScene4();
          }
        });
      }
    }

    typeScene3Line(0);
  }

  // SCENE 4: Vintage Unfolding Paper & Natural Ink Writing
  function playScene4() {
    scene4.style.display = 'flex';

    gsap.fromTo(parchment,
      { opacity: 0, scale: 0.6, rotate: -4 },
      { opacity: 1, scale: 1, rotate: 0, duration: 1.6, ease: 'back.out(1.4)',
        onComplete: () => {
          const letterLines = [
            "I don't know why we're here today.",
            "",
            "But if you're reading this,",
            "thank you for giving these few minutes a chance."
          ];

          let lineIdx = 0;
          function writeNextLine() {
            if (lineIdx < letterLines.length) {
              const lineText = letterLines[lineIdx];
              const p = document.createElement('p');
              p.className = 'ink-line';
              inkBody.appendChild(p);

              if (lineText === "") {
                p.style.minHeight = "1em";
                lineIdx++;
                setTimeout(writeNextLine, 300);
                return;
              }

              let charIdx = 0;
              function writeChar() {
                if (charIdx < lineText.length) {
                  p.textContent += lineText.charAt(charIdx);
                  charIdx++;
                  setTimeout(writeChar, 38);
                } else {
                  lineIdx++;
                  setTimeout(writeNextLine, 400);
                }
              }
              writeChar();
            } else {
              setTimeout(() => {
                const nextTarget = document.getElementById('page-2') || document.getElementById('storybook-section');
                if (nextTarget) {
                  nextTarget.scrollIntoView({ behavior: 'smooth' });
                }
              }, 3000);
            }
          }

          writeNextLine();
        }
      }
    );
  }
}

// Intro Canvas Engine (Moon Rising, Stars, Fireflies)
function initIntroCanvas() {
  const canvas = document.getElementById('intro-canvas');
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let moonY = canvas.height + 80;
  let targetMoonY = canvas.height * 0.28;
  let moonRising = false;

  const stars = [];
  for (let i = 0; i < 160; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      vAlpha: (Math.random() - 0.5) * 0.01
    });
  }

  const fireflies = [];
  for (let i = 0; i < 35; i++) {
    fireflies.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.8 + 0.2,
      color: Math.random() > 0.5 ? '#ffb7c5' : '#ffd700'
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (moonRising && moonY > targetMoonY) {
      moonY -= 0.6;
    }

    ctx.save();
    ctx.shadowBlur = 60;
    ctx.shadowColor = 'rgba(255, 246, 214, 0.8)';
    const moonGrad = ctx.createRadialGradient(canvas.width / 2, moonY, 10, canvas.width / 2, moonY, 50);
    moonGrad.addColorStop(0, '#ffffff');
    moonGrad.addColorStop(0.6, '#fff6d6');
    moonGrad.addColorStop(1, '#ffd700');
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, moonY, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    stars.forEach(s => {
      s.alpha += s.vAlpha;
      if (s.alpha > 0.9 || s.alpha < 0.2) s.vAlpha = -s.vAlpha;
      ctx.save();
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    fireflies.forEach(f => {
      f.x += f.vx;
      f.y += f.vy;
      if (f.x < 0) f.x = canvas.width;
      if (f.x > canvas.width) f.x = 0;
      if (f.y < 0) f.y = canvas.height;
      if (f.y > canvas.height) f.y = 0;

      ctx.save();
      ctx.globalAlpha = Math.max(0, f.alpha);
      ctx.fillStyle = f.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = f.color;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }
  animate();

  return {
    startMoonRise: () => {
      moonRising = true;
    }
  };
}


/* ==========================================================================
   5. GSAP SCROLLTRIGGER ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  // Page 2: Timeline cards sequential fade-in
  const timelineCards = document.querySelectorAll('.timeline-card-wrapper');
  timelineCards.forEach((card, idx) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: idx * 0.2,
      ease: 'power3.out'
    });
  });

  // Page 3: Sincere Card Fade
  gsap.from('#page-3 .sincere-card', {
    scrollTrigger: {
      trigger: '#page-3',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    scale: 0.9,
    duration: 1.2,
    ease: 'power3.out'
  });

  // Page 5: Promises blooming sequential reveal
  const promiseCards = document.querySelectorAll('.promise-card');
  promiseCards.forEach((card, idx) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 40,
      scale: 0.85,
      duration: 0.9,
      delay: idx * 0.25,
      ease: 'back.out(1.7)'
    });
  });

  // Page 8: Apology letter fade in
  gsap.from('#page-8 .vintage-letter', {
    scrollTrigger: {
      trigger: '#page-8',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 50,
    duration: 1.2,
    ease: 'power3.out'
  });
}

/* ==========================================================================
   6. POLAROID 3D TILT & HOVER EFFECT
   ========================================================================== */
function initPolaroids() {
  const polaroids = document.querySelectorAll('.polaroid-frame');
  polaroids.forEach(p => {
    p.addEventListener('mousemove', (e) => {
      const rect = p.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const tiltX = (y / rect.height) * 15;
      const tiltY = -(x / rect.width) * 15;

      p.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.06)`;
    });

    p.addEventListener('mouseleave', () => {
      p.style.transform = '';
    });
  });
}

/* ==========================================================================
   7. FINAL PAGE BUTTON - HEART SHOWER EXPLOSION
   ========================================================================== */
function initFinalButton() {
  const finalBtn = document.getElementById('final-heart-btn');
  if (!finalBtn) return;

  finalBtn.addEventListener('click', () => {
    if (typeof window.triggerHeartShower === 'function') {
      window.triggerHeartShower();
    }
  });
}

/* ==========================================================================
   8. CINEMATIC APOLOGY SCENE ENGINE
   ========================================================================== */
function initCinematicApologyScene() {
  const section = document.getElementById('cinematic-apology-scene');
  const card = document.getElementById('cinematic-card');
  const reliveOverlay = document.getElementById('relive-moment-overlay');
  const relivePart1 = document.getElementById('relive-part1');
  const relivePart2 = document.getElementById('relive-part2');

  if (!section || !card) return;

  initCinematicCanvas();

  const sentences = [
    { id: 'line-1', text: "I've replayed that moment in my mind many times." },
    { id: 'line-2', text: "I wish I had chosen patience instead of anger." },
    { id: 'line-3', text: "You deserved kindness." },
    { id: 'line-4', text: "Not raised voices." },
    { id: 'line-5', text: "I'm deeply sorry." }
  ];

  let hasStarted = false;

  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    onEnter: () => {
      if (hasStarted) return;
      hasStarted = true;

      // Card Fades in while gently floating
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 1.6,
        ease: 'power3.out',
        onComplete: () => {
          playSentenceSequence(0);
        }
      });
    }
  });

  function playSentenceSequence(index) {
    if (index < sentences.length) {
      const item = sentences[index];
      const el = document.getElementById(item.id);
      if (!el) return;

      let charIdx = 0;
      function typeChar() {
        if (charIdx < item.text.length) {
          el.textContent += item.text.charAt(charIdx);
          charIdx++;
          setTimeout(typeChar, 42);
        } else {
          // Pause between sentences
          const pauseDuration = (index === sentences.length - 1) ? 2400 : 1200;
          setTimeout(() => {
            playSentenceSequence(index + 1);
          }, pauseDuration);
        }
      }
      typeChar();
    } else {
      // Card slowly fades away after final sentence
      gsap.to(card, {
        opacity: 0,
        scale: 0.95,
        duration: 1.6,
        ease: 'power2.inOut',
        onComplete: () => {
          card.style.display = 'none';
          playReliveOverlay();
        }
      });
    }
  }

  function playReliveOverlay() {
    reliveOverlay.style.display = 'flex';

    // Sentence Part 1: "If I could relive one moment..."
    gsap.to(relivePart1, {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: 'power2.out',
      onComplete: () => {
        // Pause 2 seconds
        setTimeout(() => {
          // Sentence Part 2: "...it would be that one."
          gsap.to(relivePart2, {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: 'power2.out',
            onComplete: () => {
              // Pause 3 seconds, then smooth scroll to next section
              setTimeout(() => {
                const nextSection = document.getElementById('page-5');
                if (nextSection) {
                  nextSection.scrollIntoView({ behavior: 'smooth' });
                }
              }, 3000);
            }
          });
        }, 2000);
      }
    });
  }
}

// Canvas engine for moonlight, tiny stars, fireflies, and light fog
function initCinematicCanvas() {
  const canvas = document.getElementById('cinematic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Tiny Stars
  const stars = [];
  for (let i = 0; i < 140; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      vAlpha: (Math.random() - 0.5) * 0.01
    });
  }

  // Fireflies
  const fireflies = [];
  for (let i = 0; i < 28; i++) {
    fireflies.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      color: '#e6e6fa'
    });
  }

  // Moving Fog particles near bottom
  const fog = [];
  for (let i = 0; i < 18; i++) {
    fog.push({
      x: Math.random() * canvas.width,
      y: canvas.height * 0.82 + Math.random() * (canvas.height * 0.18),
      radius: Math.random() * 60 + 40,
      vx: Math.random() * 0.3 + 0.1,
      alpha: Math.random() * 0.15 + 0.05
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stars
    stars.forEach(s => {
      s.alpha += s.vAlpha;
      if (s.alpha > 0.9 || s.alpha < 0.2) s.vAlpha = -s.vAlpha;
      ctx.save();
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Fireflies
    fireflies.forEach(f => {
      f.x += f.vx;
      f.y += f.vy;
      if (f.x < 0) f.x = canvas.width;
      if (f.x > canvas.width) f.x = 0;
      if (f.y < 0) f.y = canvas.height;
      if (f.y > canvas.height) f.y = 0;

      ctx.save();
      ctx.globalAlpha = Math.max(0, f.alpha);
      ctx.fillStyle = f.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#c084fc';
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Drifting Fog
    fog.forEach(fg => {
      fg.x += fg.vx;
      if (fg.x - fg.radius > canvas.width) {
        fg.x = -fg.radius;
      }
      ctx.save();
      ctx.globalAlpha = fg.alpha;
      ctx.fillStyle = 'rgba(230, 230, 250, 0.1)';
      ctx.shadowBlur = 40;
      ctx.shadowColor = 'rgba(230, 230, 250, 0.2)';
      ctx.beginPath();
      ctx.arc(fg.x, fg.y, fg.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

