/* ==========================================================================
   A LETTER FOR HIMANSHI - Web Audio API Ambient Romantic Piano Synthesizer
   ========================================================================== */

class RomanticPianoAudio {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.timerId = null;
    this.chordIndex = 0;

    // Romantic ambient progression: Fmaj7 -> Am7 -> Cmaj7 -> Gsus4
    this.chords = [
      [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
      [220.00, 261.63, 329.63, 392.00], // Am7 (A3, C4, E4, G4)
      [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
      [196.00, 246.94, 293.66, 349.23]  // G7/Gsus (G3, B3, D4, F4)
    ];
  }

  init() {
    if (this.audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
    this.masterGain.connect(this.audioCtx.destination);
  }

  start() {
    this.init();
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    if (this.isPlaying) return;

    this.isPlaying = true;
    // Fade in master volume softly (low volume cinematic piano)
    this.masterGain.gain.linearRampToValueAtTime(0.10, this.audioCtx.currentTime + 3);

    this.playNextChord();
    this.timerId = setInterval(() => {
      this.playNextChord();
    }, 4500);
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.timerId) clearInterval(this.timerId);
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.5);
    }
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

  playNote(freq, delay = 0, duration = 4.0) {
    if (!this.audioCtx || !this.isPlaying) return;

    const osc = this.audioCtx.createOscillator();
    const noteGain = this.audioCtx.createGain();
    
    // Low pass filter for soft warm piano warmth
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.audioCtx.currentTime);

    // Triangle waveform gives acoustic woodwind/piano undertones
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + delay);

    const startTime = this.audioCtx.currentTime + delay;
    
    // Soft attack, gentle decay
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(0.25, startTime + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  playNextChord() {
    const chord = this.chords[this.chordIndex];
    // Arpeggiate chord notes with slight time offsets
    chord.forEach((freq, idx) => {
      this.playNote(freq, idx * 0.25, 4.5);
    });

    // Add a high delicate melody note
    const highMelodyNotes = [523.25, 659.25, 587.33, 783.99]; // C5, E5, D5, G5
    const melodyFreq = highMelodyNotes[this.chordIndex % highMelodyNotes.length];
    this.playNote(melodyFreq, 1.2, 3.5);

    this.chordIndex = (this.chordIndex + 1) % this.chords.length;
  }
}

window.romanticAudio = new RomanticPianoAudio();
