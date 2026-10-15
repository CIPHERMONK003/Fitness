// Web Audio Synthetic Focus & Gym Ambience Generator (No external MP3s needed)
class AudioVibeEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: any = null;
  private bpm = 128;
  private beatStep = 0;

  public init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleBeat(onStateChange?: (playing: boolean) => void) {
    this.init();
    if (this.isPlaying) {
      this.stop();
      onStateChange?.(false);
    } else {
      this.start();
      onStateChange?.(true);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private start() {
    if (!this.ctx) return;
    this.isPlaying = true;
    const intervalMs = (60 / this.bpm) * 1000;

    this.timer = setInterval(() => {
      this.playKick(this.beatStep % 4 === 0);
      this.beatStep++;
    }, intervalMs);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private playKick(isDownbeat: boolean) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isDownbeat ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(isDownbeat ? 140 : 100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(32, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(isDownbeat ? 0.28 : 0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }
}

export const audioVibe = new AudioVibeEngine();
