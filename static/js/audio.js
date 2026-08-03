/* ==========================================================================
   A LETTER FOR HIMANSHI - Background Audio Controller
   Track: Until I Found You - Stephen Sanchez
   ========================================================================== */

class UntilIFoundYouAudio {
  constructor() {
    this.primarySrc = '/assets/audio/until-i-found-you.mp3';
    this.fallbackSrc = '/static/music/until-i-found-you.mp3';
    this.audio = new Audio(this.primarySrc);
    this.audio.loop = true;
    this.audio.volume = 0;
    this.targetVolume = 0.22; // 22% soft emotional volume
    this.isPlaying = false;
    this.userPaused = false;
    this.fadeInterval = null;
    this.isInitialized = false;

    // Fallback handler if assets path fails
    this.audio.addEventListener('error', () => {
      if (this.audio.src.includes('/assets/')) {
        this.audio.src = this.fallbackSrc;
        if (this.isPlaying) {
          this.audio.play().catch(() => {});
        }
      }
    });

    this.setupUserGestureListener();
  }

  setupUserGestureListener() {
    const handleFirstGesture = () => {
      if (!this.isInitialized && !this.userPaused) {
        this.start();
      }
      document.removeEventListener('click', handleFirstGesture);
      document.removeEventListener('touchstart', handleFirstGesture);
      document.removeEventListener('keydown', handleFirstGesture);
    };

    document.addEventListener('click', handleFirstGesture, { once: true });
    document.addEventListener('touchstart', handleFirstGesture, { once: true });
    document.addEventListener('keydown', handleFirstGesture, { once: true });
  }

  fadeIn(duration = 2000) {
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    const steps = 40;
    const stepTime = duration / steps;
    const volumeStep = this.targetVolume / steps;

    this.audio.volume = 0;
    const playPromise = this.audio.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isPlaying = true;
        this.updateUI(true);

        this.fadeInterval = setInterval(() => {
          if (this.audio.volume + volumeStep < this.targetVolume) {
            this.audio.volume += volumeStep;
          } else {
            this.audio.volume = this.targetVolume;
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
          }
        }, stepTime);
      }).catch(err => {
        console.log("Autoplay policy prevented audio play:", err);
      });
    }
  }

  fadeOut(duration = 2000, callback) {
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    const steps = 40;
    const stepTime = duration / steps;
    const volumeStep = Math.max(0.005, this.audio.volume / steps);

    this.fadeInterval = setInterval(() => {
      if (this.audio.volume - volumeStep > 0.01) {
        this.audio.volume -= volumeStep;
      } else {
        this.audio.volume = 0;
        this.audio.pause();
        this.isPlaying = false;
        this.updateUI(false);
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        if (callback) callback();
      }
    }, stepTime);
  }

  start() {
    this.isInitialized = true;
    this.userPaused = false;
    this.fadeIn(2000);
  }

  stop() {
    this.userPaused = true;
    this.fadeOut(2000);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  updateUI(isPlaying) {
    const audioBtn = document.getElementById('audio-toggle-btn');
    const trackLabel = document.getElementById('audio-track-label');

    if (audioBtn) {
      audioBtn.style.color = isPlaying ? '#ffd700' : 'rgba(255,255,255,0.4)';
    }

    if (trackLabel) {
      trackLabel.style.opacity = '0';
      setTimeout(() => {
        if (isPlaying) {
          trackLabel.textContent = '♫ Until I Found You';
          trackLabel.style.color = 'var(--color-pink-soft)';
        } else {
          trackLabel.textContent = 'Music Paused';
          trackLabel.style.color = 'rgba(255, 255, 255, 0.55)';
        }
        trackLabel.style.opacity = '1';
      }, 200);
    }
  }
}

window.romanticAudio = new UntilIFoundYouAudio();
