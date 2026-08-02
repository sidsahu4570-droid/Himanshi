/* ==========================================================================
   A LETTER FOR HIMANSHI - Main Application Controller (GSAP + Interactions)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  initCursor();
  initLandingSequence();
  initAudioToggle();
  initPage1Typing();
  initScrollAnimations();
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
function initLandingSequence() {
  const subtitleEl = document.getElementById('landing-subtitle-text');
  const titleEl = document.getElementById('landing-title');
  const btnEl = document.getElementById('open-btn');
  const landingScreen = document.getElementById('landing-screen');
  const audioBtn = document.getElementById('audio-toggle-btn');

  const phrase = "For Someone Very Special...";
  let charIdx = 0;

  // Type letter-by-letter
  function typeSubtitle() {
    if (charIdx < phrase.length) {
      subtitleEl.textContent += phrase.charAt(charIdx);
      charIdx++;
      setTimeout(typeSubtitle, 70);
    } else {
      // Reveal Title "Himanshi ❤️"
      setTimeout(() => {
        titleEl.classList.add('show');
        setTimeout(() => {
          btnEl.classList.add('show');
        }, 800);
      }, 500);
    }
  }

  setTimeout(typeSubtitle, 600);

  // Click "Please Open This"
  btnEl.addEventListener('click', () => {
    // Start Audio
    if (window.romanticAudio) {
      window.romanticAudio.start();
    }
    if (audioBtn) {
      audioBtn.classList.add('visible');
    }

    // Fade out Landing Screen
    landingScreen.classList.add('fade-out');

    // Scroll to Page 1
    setTimeout(() => {
      document.getElementById('page-1').scrollIntoView({ behavior: 'smooth' });
    }, 400);
  });
}

/* ==========================================================================
   3. AUDIO TOGGLE BUTTON
   ========================================================================== */
function initAudioToggle() {
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    if (window.romanticAudio) {
      const playing = window.romanticAudio.toggle();
      audioBtn.style.color = playing ? '#ffd700' : 'rgba(255,255,255,0.4)';
    }
  });
}

/* ==========================================================================
   4. PAGE 1: TYPING EFFECT FOR HANDWRITTEN LETTER
   ========================================================================== */
function initPage1Typing() {
  const letterTextContainer = document.getElementById('page1-typed-letter');
  if (!letterTextContainer) return;

  const letterText = `Dear Himanshi,

I don't know why you're upset with me, but I can feel the distance between us.

Maybe I made mistakes that hurt you.
Maybe I didn't understand your feelings.

Whatever the reason is...
I genuinely want to understand.

If I hurt you...
I'm truly sorry.`;

  let typedIndex = 0;
  let hasTyped = false;

  ScrollTrigger.create({
    trigger: '#page-1',
    start: 'top 60%',
    onEnter: () => {
      if (hasTyped) return;
      hasTyped = true;

      function typeNextChar() {
        if (typedIndex < letterText.length) {
          letterTextContainer.textContent += letterText.charAt(typedIndex);
          typedIndex++;
          setTimeout(typeNextChar, 35);
        }
      }
      typeNextChar();
    }
  });
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
