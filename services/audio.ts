
class AudioService {
  private context: AudioContext | null = null;

  private getContext() {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.context;
  }

  private createOscillator(type: OscillatorType, freq: number, duration: number, volume: number = 0.1) {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    return { osc, gain, ctx };
  }

  playSend() {
    const { osc, ctx } = this.createOscillator('triangle', 440, 0.4, 0.15);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }

  playOpen() {
    const { osc, ctx } = this.createOscillator('sine', 200, 0.2, 0.1);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  playNotify() {
    const ctx = this.getContext();
    const now = ctx.currentTime;
    
    // Create a magical ascending sparkle (A-Major arpeggio)
    const playSparkleNote = (freq: number, startTime: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      // Fast attack, slow decay
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    };

    // Four-note ascending sequence for a "magical mail" feel
    playSparkleNote(880, now, 0.06);           // A5
    playSparkleNote(1108.73, now + 0.08, 0.05); // C#6
    playSparkleNote(1318.51, now + 0.16, 0.04); // E6
    playSparkleNote(1760, now + 0.24, 0.03);    // A6
  }

  playDelete() {
    const ctx = this.getContext();
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 0.1);
  }
}

export const audioService = new AudioService();
