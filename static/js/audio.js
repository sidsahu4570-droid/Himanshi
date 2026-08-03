/* ==========================================================================
   A LETTER FOR HIMANSHI - Bulletproof Mobile Audio Controller & Synthesizer
   Instrumental "Until I Found You" Piano & Strings Ballad
   ========================================================================== */

class RomanticPianoAudio {
  constructor() {
    this.audio = null;
    this.audioCtx = null;
    this.mediaSource = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.isUnlocked = false;
    this.targetVolume = 0.14; // 14% volume (soft reading level)
    this.fadeInterval = null;
    this.src = '/static/audio/until_i_found_you.wav';
  }

  logDiagnosticReport(stage, details = {}) {
    const report = {
      timestamp: new Date().toISOString(),
      stage: stage,
      audioFileLoaded: this.audio ? (this.audio.readyState >= 2) : false,
      audioContextState: this.audioCtx ? this.audioCtx.state : 'uninitialized',
      userInteractionDetected: this.isUnlocked,
      playbackState: {
        paused: this.audio ? this.audio.paused : true,
        muted: this.audio ? this.audio.muted : false,
        currentTime: this.audio ? Math.round(this.audio.currentTime * 100) / 100 : 0,
        volume: this.audio ? Math.round(this.audio.volume * 100) / 100 : 0,
        readyState: this.audio ? this.audio.readyState : 0,
        networkState: this.audio ? this.audio.networkState : 0,
        src: this.src
      },
      details: details
    };
    console.log(`[AUDIO DIAGNOSTIC] ${stage}:`, report);
  }

  init() {
    if (this.audio) return;

    // Create HTML5 Audio element
    this.audio = new Audio();
    this.audio.src = this.src;
    this.audio.loop = true;
    this.audio.preload = 'auto';
    this.audio.volume = 0.0001; // Start at 0 for 3s fade-in
    this.audio.setAttribute('playsinline', '');
    this.audio.setAttribute('webkit-playsinline', '');

    // Web Audio API Routing for smooth gain curve & iOS session claim
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      try {
        this.audioCtx = new AudioContext();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);
        
        this.mediaSource = this.audioCtx.createMediaElementSource(this.audio);
        this.mediaSource.connect(this.masterGain);
        this.masterGain.connect(this.audioCtx.destination);
      } catch (e) {
        console.warn('[AUDIO] Web Audio API gain routing fallback to HTML5 Audio volume:', e);
      }
    }

    // Network & Loading Diagnostic Event Listeners
    this.audio.addEventListener('loadstart', () => {
      this.logDiagnosticReport('✓ Audio file loading initiated', { path: this.src });
    });

    this.audio.addEventListener('canplaythrough', () => {
      this.logDiagnosticReport('✓ Audio file loaded cleanly (canplaythrough)', {
        canPlayTypeWav: this.audio.canPlayType('audio/wav'),
        canPlayTypeXWav: this.audio.canPlayType('audio/x-wav')
      });
    });

    this.audio.addEventListener('error', (e) => {
      const err = this.audio.error || e;
      this.logDiagnosticReport('❌ Audio file load error', {
        errorCode: err ? err.code : 'unknown',
        errorMessage: err ? err.message : 'failed to load'
      });
    });

    this.setupUnlockListeners();
  }

  setupUnlockListeners() {
    const events = ['touchstart', 'touchend', 'pointerdown', 'click'];

    const unlockHandler = (e) => {
      this.logDiagnosticReport('✓ User interaction detected', { eventType: e.type });
      this.unlockAndPlay();
      if (this.isUnlocked) {
        events.forEach(evt => window.removeEventListener(evt, unlockHandler, { capture: true }));
      }
    };

    events.forEach(evt => {
      window.addEventListener(evt, unlockHandler, { capture: true, passive: true });
    });
  }

  unlockAndPlay() {
    this.init();

    // 1. Resume AudioContext synchronously
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().then(() => {
        this.logDiagnosticReport('✓ AudioContext resumed', { state: this.audioCtx.state });
      }).catch(err => {
        this.logDiagnosticReport('⚠️ AudioContext resume warning', { error: err.message });
      });
    }

    // 2. Play HTML5 Audio element
    if (this.audio) {
      this.audio.muted = false;
      const playPromise = this.audio.play();

      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isUnlocked = true;
          this.isPlaying = true;
          this.logDiagnosticReport('✓ play() executed successfully & resolved', {
            currentState: 'PLAYING'
          });
          this.fadeIn();
          this.updateUIButton(true);
        }).catch(err => {
          this.logDiagnosticReport('❌ play() promise rejected by browser autoplay policy', {
            name: err.name,
            message: err.message
          });
        });
      }
    }
  }

  fadeIn() {
    if (!this.audio) return;
    const duration = 3000; // 3-second fade in
    const steps = 30;
    const stepTime = duration / steps;
    let step = 0;

    if (this.fadeInterval) clearInterval(this.fadeInterval);

    if (this.masterGain && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value || 0.0001, now);
      this.masterGain.gain.linearRampToValueAtTime(this.targetVolume, now + 3.0);
    }

    this.fadeInterval = setInterval(() => {
      step++;
      const currentVol = (step / steps) * this.targetVolume;
      this.audio.volume = Math.min(this.targetVolume, currentVol);
      if (step >= steps) {
        clearInterval(this.fadeInterval);
        this.audio.volume = this.targetVolume;
      }
    }, stepTime);
  }

  fadeOut(onComplete) {
    if (!this.audio) return;
    const duration = 3000; // 3-second fade out
    const steps = 30;
    const stepTime = duration / steps;
    let step = 0;
    const startVol = this.audio.volume;

    if (this.fadeInterval) clearInterval(this.fadeInterval);

    if (this.masterGain && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 3.0);
    }

    this.fadeInterval = setInterval(() => {
      step++;
      const currentVol = startVol * (1 - (step / steps));
      this.audio.volume = Math.max(0, currentVol);
      if (step >= steps) {
        clearInterval(this.fadeInterval);
        this.audio.volume = 0;
        if (onComplete) onComplete();
      }
    }, stepTime);
  }

  start() {
    this.unlockAndPlay();
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.fadeOut(() => {
      if (this.audio) {
        this.audio.pause();
        this.logDiagnosticReport('✓ Audio paused after fade-out', { currentState: 'PAUSED' });
      }
    });
    this.updateUIButton(false);
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

  updateUIButton(isPlaying) {
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
      audioBtn.style.color = isPlaying ? '#ffd700' : 'rgba(255, 255, 255, 0.4)';
    }
  }
}

window.romanticAudio = new RomanticPianoAudio();
