/* ==========================================================================
   A LETTER FOR HIMANSHI - Main Application Controller (GSAP Documentary)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  initCursor();
  initLandingSequence();
  initAudioToggle();
  initDocumentaryChapters();
  initFinalDocumentaryChapter();
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

  function typeSubtitle() {
    if (charIdx < phrase.length) {
      subtitleEl.textContent += phrase.charAt(charIdx);
      charIdx++;
      setTimeout(typeSubtitle, 70);
    } else {
      setTimeout(() => {
        titleEl.classList.add('show');
        setTimeout(() => {
          btnEl.classList.add('show');
        }, 800);
      }, 500);
    }
  }

  setTimeout(typeSubtitle, 600);

  btnEl.addEventListener('click', () => {
    if (window.romanticAudio) {
      window.romanticAudio.start();
    }
    if (audioBtn) {
      audioBtn.classList.add('visible');
    }

    landingScreen.classList.add('fade-out');

    setTimeout(() => {
      document.getElementById('chap-1').scrollIntoView({ behavior: 'smooth' });
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
   4. DOCUMENTARY CHAPTERS SCROLL & 3D TILT
   ========================================================================== */
function initDocumentaryChapters() {
  const chapters = document.querySelectorAll('.doc-chapter');

  chapters.forEach((chap) => {
    const card = chap.querySelector('.chap-card');
    const badge = chap.querySelector('.chap-badge');
    const title = chap.querySelector('.chap-title');

    if (badge) {
      gsap.from(badge, {
        scrollTrigger: {
          trigger: chap,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: 'back.out(1.7)'
      });
    }

    if (title) {
      gsap.from(title, {
        scrollTrigger: {
          trigger: chap,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: -30,
        duration: 1,
        delay: 0.15,
        ease: 'power3.out'
      });
    }

    if (card) {
      gsap.from(card, {
        scrollTrigger: {
          trigger: chap,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 1.2,
        delay: 0.3,
        ease: 'power3.out'
      });

      // 3D Card Hover Tilt
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `perspective(1000px) rotateX(${-(y / rect.height) * 8}deg) rotateY(${(x / rect.width) * 8}deg) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    }
  });
}

/* ==========================================================================
   5. FINAL DOCUMENTARY CHAPTER & TYPING LETTER
   ========================================================================== */
function initFinalDocumentaryChapter() {
  const finalCard = document.getElementById('chap-final');
  const typedTextEl = document.getElementById('final-typed-doc');
  const signatureEl = document.getElementById('final-doc-signature');
  let finalTriggered = false;

  if (!finalCard || !typedTextEl || !signatureEl) return;

  ScrollTrigger.create({
    trigger: finalCard,
    start: 'top 65%',
    onEnter: () => {
      if (finalTriggered) return;
      finalTriggered = true;

      // Soften piano background audio
      if (window.romanticAudio && window.romanticAudio.masterGain && window.romanticAudio.audioCtx) {
        try {
          window.romanticAudio.masterGain.gain.linearRampToValueAtTime(0.05, window.romanticAudio.audioCtx.currentTime + 5);
        } catch (e) {}
      }

      // Enable canvas cinematic visual enhancements
      if (window.bgEngine && typeof window.bgEngine.enableCinematicEnding === 'function') {
        window.bgEngine.enableCinematicEnding();
      }

      const letter = `Thank you for every conversation,
every dream,
every memory,
and every moment we shared.

I don't know what tomorrow holds.

I only wanted to tell you that I'm genuinely sorry.

Whatever you choose,
I'll respect it.

Thank you for reading this.`;

      let charIdx = 0;

      function typeLetter() {
        if (charIdx < letter.length) {
          typedTextEl.textContent += letter.charAt(charIdx);
          charIdx++;
          setTimeout(typeLetter, 45);
        } else {
          // Reveal signature after letter finishes typing
          setTimeout(() => {
            signatureEl.classList.add('show');
          }, 1000);
        }
      }

      typeLetter();
    }
  });
}
