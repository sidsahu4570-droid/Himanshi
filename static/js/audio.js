/* ==========================================================================
   A LETTER FOR HIMANSHI - Romantic Piano & Soft Strings Ambient Synthesizer
   Inspired by "Until I Found You" (Instrumental Ballad in 6/8, ~65 BPM)
   ========================================================================== */

class RomanticPianoAudio {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.isUnlocked = false;
    this.shouldPlayOnUnlock = false;
    this.masterGain = null;
    this.pianoGain = null;
    this.stringsGain = null;
    this.timerId = null;
    this.chordIndex = 0;
    this.targetVolume = 0.14; // 14% master volume (soft reading level)

    // Frequencies (Hz)
    this.notes = {
      C2: 65.41, E2: 82.41, F2: 87.31, G2: 98.00,
      C3: 130.81, E3: 164.81, F3: 174.61, G3: 196.00, Ab3: 207.65, A3: 220.00, B3: 246.94,
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, Ab4: 415.30, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99
    };

    // Progression: C -> Em -> F -> Fm (The iconic "Until I Found You" progression)
    this.progression = [
      {
        bass: 'C2',
        arpeggio: ['C3', 'G3', 'C4', 'E4', 'G4', 'C4'],
        pad: ['C3', 'G3', 'E4'],
        melody: [
          { note: 'G4', delay: 0.0 },
          { note: 'E4', delay: 0.9 },
          { note: 'G4', delay: 1.8 },
          { note: 'C5', delay: 2.7 },
          { note: 'E5', delay: 3.6 },
          { note: 'D5', delay: 4.5 }
        ]
      },
      {
        bass: 'E2',
        arpeggio: ['E3', 'B3', 'E4', 'G4', 'B4', 'E4'],
        pad: ['E3', 'B3', 'G4'],
        melody: [
          { note: 'B4', delay: 0.0 },
          { note: 'G4', delay: 0.9 },
          { note: 'E4', delay: 1.8 },
          { note: 'D4', delay: 2.7 },
          { note: 'B3', delay: 3.6 },
          { note: 'D4', delay: 4.5 }
        ]
      },
      {
        bass: 'F2',
        arpeggio: ['F3', 'C4', 'F4', 'A4', 'C5', 'F4'],
        pad: ['F3', 'C4', 'A4'],
        melody: [
          { note: 'A4', delay: 0.0 },
          { note: 'F4', delay: 0.9 },
          { note: 'C5', delay: 1.8 },
          { note: 'A4', delay: 2.7 },
          { note: 'F5', delay: 3.6 },
          { note: 'E5', delay: 4.5 }
        ]
      },
      {
        bass: 'F2',
        arpeggio: ['F3', 'C4', 'F4', 'Ab4', 'C5', 'F4'],
        pad: ['F3', 'C4', 'Ab4'], // Fm signature minor 4th chord!
        melody: [
          { note: 'Ab4', delay: 0.0 },
          { note: 'F4', delay: 0.9 },
          { note: 'C5', delay: 1.8 },
          { note: 'G4', delay: 2.7 },
          { note: 'E4', delay: 3.6 },
          { note: 'C4', delay: 4.5 }
        ]
      }
    ];
  }

  init() {
    if (this.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);

    this.pianoGain = this.audioCtx.createGain();
    this.pianoGain.gain.value = 0.85;

    this.stringsGain = this.audioCtx.createGain();
    this.stringsGain.gain.value = 0.25;

    this.pianoGain.connect(this.masterGain);
    this.stringsGain.connect(this.masterGain);
    this.masterGain.connect(this.audioCtx.destination);

    this.setupMobileUnlockListeners();
  }

  async resumeContext() {
    if (!this.audioCtx) this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      try {
        await this.audioCtx.resume();
      } catch (err) {
        console.warn('AudioContext resume failed:', err);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'running') {
      this.isUnlocked = true;
    }
    return this.isUnlocked;
  }

  setupMobileUnlockListeners() {
    const events = ['touchstart', 'pointerdown', 'click', 'scroll'];
    
    const unlockHandler = async () => {
      await this.resumeContext();
      if (this.isUnlocked) {
        if (!this.isPlaying && this.shouldPlayOnUnlock) {
          this.start();
        }
        events.forEach(evt => window.removeEventListener(evt, unlockHandler, { capture: true }));
      }
    };

    events.forEach(evt => {
      window.addEventListener(evt, unlockHandler, { capture: true, passive: true });
    });
  }

  async start() {
    this.shouldPlayOnUnlock = true;
    this.init();
    await this.resumeContext();

    if (this.isPlaying) return true;

    this.isPlaying = true;
    const now = this.audioCtx.currentTime;
    
    // 3-second soft linear fade-in to 14% volume
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value || 0.0001, now);
    this.masterGain.gain.linearRampToValueAtTime(this.targetVolume, now + 3.0);

    this.playMeasure();
    const measureDurationMs = 5400; // ~5.4s per measure (6/8 @ ~65 BPM)
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      if (this.isPlaying) {
        this.playMeasure();
      }
    }, measureDurationMs);

    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) audioBtn.style.color = '#ffd700';

    return true;
  }

  stop() {
    this.shouldPlayOnUnlock = false;
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.masterGain && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      // 3-second soft linear fade-out
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 3.0);
    }
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) audioBtn.style.color = 'rgba(255,255,255,0.4)';
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

  // Soft Acoustic Piano Voice
  playPianoNote(freq, delay = 0, duration = 4.0, velocity = 0.22) {
    if (!this.audioCtx || !this.isPlaying) return;
    const startTime = this.audioCtx.currentTime + delay;

    // Fundamental Sine Body
    const osc1 = this.audioCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Warm Overtone Triangle Hammer Strike
    const osc2 = this.audioCtx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    // Low Pass Filter for Warm felt acoustic tone
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, startTime);

    const noteGain = this.audioCtx.createGain();
    
    // Soft attack & exponential piano decay
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(velocity, startTime + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.pianoGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  // Soft Background Strings Pad Voice
  playStringPad(chordFreqs, delay = 0, duration = 5.2) {
    if (!this.audioCtx || !this.isPlaying) return;
    const startTime = this.audioCtx.currentTime + delay;

    chordFreqs.forEach((freq, i) => {
      const osc = this.audioCtx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);

      // Heavy lowpass filter for lush warm background strings pad
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380 + (i * 40), startTime);

      const padGain = this.audioCtx.createGain();
      
      // Slow swell attack and decay
      padGain.gain.setValueAtTime(0.0001, startTime);
      padGain.gain.linearRampToValueAtTime(0.035, startTime + 1.4);
      padGain.gain.linearRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(filter);
      filter.connect(padGain);
      padGain.connect(this.stringsGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  playMeasure() {
    const data = this.progression[this.chordIndex];
    if (!data) return;

    // 1. Bass Note
    if (data.bass && this.notes[data.bass]) {
      this.playPianoNote(this.notes[data.bass], 0.0, 4.8, 0.28);
    }

    // 2. 6/8 Arpeggiated Piano Texture
    data.arpeggio.forEach((noteName, idx) => {
      if (this.notes[noteName]) {
        const arpeggioDelay = idx * 0.45;
        this.playPianoNote(this.notes[noteName], arpeggioDelay, 3.8, 0.16);
      }
    });

    // 3. Soft Background Strings Pad
    const padFreqs = data.pad.map(name => this.notes[name]).filter(Boolean);
    if (padFreqs.length > 0) {
      this.playStringPad(padFreqs, 0.2, 5.0);
    }

    // 4. Romantic Melody Motif ("Until I Found You" inspiration)
    data.melody.forEach(m => {
      if (this.notes[m.note]) {
        this.playPianoNote(this.notes[m.note], m.delay, 3.6, 0.24);
      }
    });

    this.chordIndex = (this.chordIndex + 1) % this.progression.length;
  }
}

window.romanticAudio = new RomanticPianoAudio();
