class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.muted = false;
  }

  // Initialize on first user interaction to comply with browser autoplay policies
  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  play(soundName) {
    if (this.muted) return;
    
    try {
      this.init();
      // Resume context if browser suspended it
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      this.synthesize(soundName);
    } catch (e) {
      console.warn("Audio synthesis failed:", e);
    }
  }

  synthesize(name) {
    const ctx = this.audioCtx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Default to a classic retro square wave
    osc.type = 'square';
    
    switch (name) {
      case 'startup':
        // Classic Windows 95/98-style ascending chord
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, t);       // A4
        osc.frequency.setValueAtTime(554.37, t + 0.15); // C#5
        osc.frequency.setValueAtTime(659.25, t + 0.3);  // E5
        osc.frequency.setValueAtTime(880, t + 0.5);     // A5
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 2.0);
        osc.start(t);
        osc.stop(t + 2.0);
        break;

      case 'shutdown':
        // Descending chord
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.setValueAtTime(659.25, t + 0.2);
        osc.frequency.setValueAtTime(554.37, t + 0.4);
        osc.frequency.setValueAtTime(440, t + 0.6);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
        osc.start(t);
        osc.stop(t + 1.5);
        break;

      case 'click':
      case 'button':
      case 'typing':
        // Very short, high-pitched tick (like a mechanical keyboard or mouse click)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        osc.start(t);
        osc.stop(t + 0.05);
        break;

      case 'window-open':
      case 'menu-open':
        // Quick ascending swoosh
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;

      case 'window-close':
      case 'window-minimize':
        // Quick descending swoosh
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.1);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;

      case 'error':
        // Dissonant/Low classic error "donk"
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.3);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.start(t);
        osc.stop(t + 0.4);
        break;

      case 'warning':
      case 'notification':
        // Mid-tone alert beep
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, t);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.3);
        break;

      case 'ai-response':
        // Robotic chirps
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.setValueAtTime(800, t + 0.1);
        osc.frequency.setValueAtTime(500, t + 0.2);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.start(t);
        osc.stop(t + 0.4);
        break;

      default:
        // Safe fallback beep
        osc.frequency.setValueAtTime(440, t);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;
    }
  }
}

export const soundManager = new SoundManager();