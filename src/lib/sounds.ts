class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();

  async init() {
    if (typeof window === 'undefined') return;
    
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    await this.generateSounds();
  }

  private async generateSounds() {
    if (!this.audioContext) return;

    this.sounds.set('move', await this.createClickSound(0.05, 800, 0.1));
    this.sounds.set('capture', await this.createClickSound(0.08, 400, 0.15));
    this.sounds.set('check', await this.createBeepSound(0.1, 1200, 0.2));
    this.sounds.set('checkmate', await this.createCheckmateSound());
    this.sounds.set('castle', await this.createDoubleClickSound());
  }

  private async createClickSound(volume: number, frequency: number, duration: number): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error('AudioContext not initialized');
    
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 15);
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * volume;
    }

    return buffer;
  }

  private async createBeepSound(volume: number, frequency: number, duration: number): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error('AudioContext not initialized');
    
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const envelope = t < duration / 2 ? 1 : Math.exp(-(t - duration / 2) * 10);
      data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * volume;
    }

    return buffer;
  }

  private async createCheckmateSound(): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error('AudioContext not initialized');
    
    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.5;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const freq = 1000 - (t * 600);
      const envelope = Math.exp(-t * 3);
      data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.15;
    }

    return buffer;
  }

  private async createDoubleClickSound(): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error('AudioContext not initialized');
    
    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.2;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const click1 = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 30);
      const click2 = Math.sin(2 * Math.PI * 800 * (t - 0.1)) * Math.exp(-(t - 0.1) * 30) * (t > 0.1 ? 1 : 0);
      data[i] = (click1 + click2) * 0.05;
    }

    return buffer;
  }

  play(soundName: string) {
    if (!this.audioContext) return;
    
    const buffer = this.sounds.get(soundName);
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start();
  }

  playMove(isCapture: boolean, isCheck: boolean, isCheckmate: boolean, isCastle: boolean) {
    if (isCheckmate) {
      this.play('checkmate');
    } else if (isCheck) {
      this.play('check');
    } else if (isCastle) {
      this.play('castle');
    } else if (isCapture) {
      this.play('capture');
    } else {
      this.play('move');
    }
  }
}

export const soundManager = new SoundManager();
