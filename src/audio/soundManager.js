class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    
    // Load persistent preferences
    const savedMute = localStorage.getItem('vishal_os_muted');
    const savedVol = localStorage.getItem('vishal_os_volume');
    
    this.muted = savedMute ? JSON.parse(savedMute) : false;
    this.volume = savedVol ? parseFloat(savedVol) : 0.2; // Default to 20%
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.connect(this.audioCtx.destination);
      this.updateMasterGain();
    }
  }

  updateMasterGain() {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.audioCtx.currentTime);
    }
  }

  setMute(isMuted) {
    this.muted = isMuted;
    localStorage.setItem('vishal_os_muted', JSON.stringify(isMuted));
    this.updateMasterGain();
  }

  setVolume(vol) {
    this.volume = vol;
    localStorage.setItem('vishal_os_volume', vol);
    this.updateMasterGain();
  }

  play(soundName) {
    if (this.muted) return;
    
    try {
      this.init();
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
    gain.connect(this.masterGain); // Connect to master instead of destination

    osc.type = 'square';
    
    switch (name) {
      case 'startup':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.setValueAtTime(554.37, t + 0.15);
        osc.frequency.setValueAtTime(659.25, t + 0.3);
        osc.frequency.setValueAtTime(880, t + 0.5);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 2.0);
        osc.start(t);
        osc.stop(t + 2.0);
        break;
      case 'shutdown':
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
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.1);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;
      case 'error':
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
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, t);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.3);
        break;
      case 'ai-response':
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