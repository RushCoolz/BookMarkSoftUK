/**
 * 5-Channel Procedural Web Audio Ambient Soundscape Synthesizer
 * Pure mathematical synthesis of:
 * 1. Rain on Glass (bandpass white noise + subtle droplet filter)
 * 2. Distant Thunder (low-pass brownian rumble + stochastic thunder rolls)
 * 3. Meadow Wind Chimes (pentatonic crystalline bell harmonics)
 * 4. Alpine Breeze (LFO-modulated resonant pink noise gusts)
 * 5. Warm Analog Chords (detuned Fmaj9 / Cmaj7 harmonic drone pad)
 *
 * Zero external audio files required.
 */

export interface SoundscapeChannelMix {
  rain: number;    // 0.0 to 1.0
  thunder: number; // 0.0 to 1.0
  chimes: number;  // 0.0 to 1.0
  wind: number;    // 0.0 to 1.0
  chords: number;  // 0.0 to 1.0
}

export type SoundscapePresetId = 
  | 'auto-weather'
  | 'shinkai-rain'
  | 'ghibli-meadow'
  | 'aurora-zen'
  | 'alpine-gale';

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private animId: number | null = null;
  private chimeTimer: number | null = null;
  private thunderTimer: number | null = null;

  // Channel Gain Nodes
  private rainGain: GainNode | null = null;
  private thunderGain: GainNode | null = null;
  private chimesGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private chordsGain: GainNode | null = null;

  // Active Source Nodes
  private sourceNodes: AudioNode[] = [];

  private mix: SoundscapeChannelMix = {
    rain: 0.35,
    thunder: 0.15,
    chimes: 0.45,
    wind: 0.4,
    chords: 0.5,
  };

  private activePreset: SoundscapePresetId = 'auto-weather';
  private onWaveData?: (levels: number[]) => void;
  private onMixChange?: (mix: SoundscapeChannelMix, preset: SoundscapePresetId, playing: boolean) => void;

  public init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 32;

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  public setVisualizerCallback(cb: (levels: number[]) => void) {
    this.onWaveData = cb;
  }

  public setMixChangeCallback(cb: (mix: SoundscapeChannelMix, preset: SoundscapePresetId, playing: boolean) => void) {
    this.onMixChange = cb;
  }

  public getMix(): SoundscapeChannelMix {
    return { ...this.mix };
  }

  public getActivePreset(): SoundscapePresetId {
    return this.activePreset;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setChannelLevel(channel: keyof SoundscapeChannelMix, value: number) {
    const clamped = Math.max(0, Math.min(1, value));
    this.mix[channel] = clamped;

    if (this.ctx && this.isPlaying) {
      const now = this.ctx.currentTime;
      if (channel === 'rain' && this.rainGain) {
        this.rainGain.gain.setTargetAtTime(clamped * 0.65, now, 0.08);
      } else if (channel === 'thunder' && this.thunderGain) {
        this.thunderGain.gain.setTargetAtTime(clamped * 0.85, now, 0.08);
      } else if (channel === 'chimes' && this.chimesGain) {
        this.chimesGain.gain.setTargetAtTime(clamped * 0.4, now, 0.08);
      } else if (channel === 'wind' && this.windGain) {
        this.windGain.gain.setTargetAtTime(clamped * 0.55, now, 0.08);
      } else if (channel === 'chords' && this.chordsGain) {
        this.chordsGain.gain.setTargetAtTime(clamped * 0.16, now, 0.08);
      }
    }

    this.notifyState();
  }

  public applyPreset(
    preset: SoundscapePresetId,
    weatherCategory = 'clear',
    precipitationMm = 0,
    windKmh = 12
  ) {
    this.activePreset = preset;
    if (preset === 'auto-weather') {
      const isRainy = precipitationMm > 0 || ['rain', 'drizzle', 'thunderstorm'].includes(weatherCategory);
      const isStorm = weatherCategory === 'thunderstorm' || precipitationMm > 4;
      this.mix = {
        rain: isRainy ? Math.min(0.95, 0.45 + precipitationMm * 0.08) : 0.0,
        thunder: isStorm ? 0.65 : isRainy ? 0.2 : 0.0,
        chimes: isRainy ? 0.2 : 0.55,
        wind: Math.min(0.9, Math.max(0.2, windKmh / 45)),
        chords: 0.6,
      };
    } else if (preset === 'shinkai-rain') {
      this.mix = { rain: 0.82, thunder: 0.48, chimes: 0.25, wind: 0.35, chords: 0.65 };
    } else if (preset === 'ghibli-meadow') {
      this.mix = { rain: 0.0, thunder: 0.0, chimes: 0.78, wind: 0.48, chords: 0.55 };
    } else if (preset === 'aurora-zen') {
      this.mix = { rain: 0.12, thunder: 0.0, chimes: 0.62, wind: 0.25, chords: 0.88 };
    } else if (preset === 'alpine-gale') {
      this.mix = { rain: 0.18, thunder: 0.15, chimes: 0.35, wind: 0.88, chords: 0.42 };
    }

    // Apply immediately if playing
    (Object.keys(this.mix) as (keyof SoundscapeChannelMix)[]).forEach((ch) => {
      this.setChannelLevel(ch, this.mix[ch]);
    });

    if (!this.isPlaying) {
      this.start(weatherCategory, precipitationMm, windKmh, false);
    }
  }

  public start(
    weatherCategory = 'clear',
    precipitationMm = 0,
    windKmh = 12,
    recomputeAutoMix = true
  ) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (recomputeAutoMix && this.activePreset === 'auto-weather') {
      const isRainy = precipitationMm > 0 || ['rain', 'drizzle', 'thunderstorm'].includes(weatherCategory);
      const isStorm = weatherCategory === 'thunderstorm' || precipitationMm > 4;
      this.mix = {
        rain: isRainy ? Math.min(0.95, 0.45 + precipitationMm * 0.08) : 0.08,
        thunder: isStorm ? 0.65 : isRainy ? 0.22 : 0.0,
        chimes: isRainy ? 0.25 : 0.58,
        wind: Math.min(0.9, Math.max(0.25, windKmh / 45)),
        chords: 0.62,
      };
    }

    this.stopNodes();
    this.isPlaying = true;

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(0.001, this.masterGain.gain.value), now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.45, now + 1.0);

    // Build all 5 continuous/stochastic channels so user can slide any channel up/down live
    this.setupRainChannel();
    this.setupThunderChannel();
    this.setupWindChannel();
    this.setupChordsChannel();
    this.setupChimesChannel();

    this.startAnalyzerLoop();
    this.notifyState();
  }

  public stop() {
    if (!this.ctx || !this.masterGain) return;
    this.isPlaying = false;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(0.001, this.masterGain.gain.value), now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    setTimeout(() => {
      if (!this.isPlaying) {
        this.stopNodes();
        if (this.animId) cancelAnimationFrame(this.animId);
        if (this.onWaveData) this.onWaveData([0.15, 0.15, 0.15, 0.15]);
      }
    }, 650);

    this.notifyState();
  }

  public toggle(weatherCategory: string, precipitationMm: number, windKmh: number): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(weatherCategory, precipitationMm, windKmh, true);
      return true;
    }
  }

  private notifyState() {
    if (this.onMixChange) {
      this.onMixChange({ ...this.mix }, this.activePreset, this.isPlaying);
    }
  }

  private stopNodes() {
    if (this.chimeTimer) {
      window.clearInterval(this.chimeTimer);
      this.chimeTimer = null;
    }
    if (this.thunderTimer) {
      window.clearInterval(this.thunderTimer);
      this.thunderTimer = null;
    }
    for (const node of this.sourceNodes) {
      try {
        (node as any).stop?.();
        node.disconnect();
      } catch {}
    }
    this.sourceNodes = [];
    this.rainGain = null;
    this.thunderGain = null;
    this.chimesGain = null;
    this.windGain = null;
    this.chordsGain = null;
  }

  // Channel 1: Rain on Glass
  private setupRainChannel() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1150, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.1, this.ctx.currentTime);

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(this.mix.rain * 0.65, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);

    whiteNoise.start();
    this.sourceNodes.push(whiteNoise);
  }

  // Channel 2: Distant Rolling Thunder
  private setupThunderChannel() {
    if (!this.ctx || !this.masterGain) return;
    this.thunderGain = this.ctx.createGain();
    this.thunderGain.gain.setValueAtTime(this.mix.thunder * 0.85, this.ctx.currentTime);
    this.thunderGain.connect(this.masterGain);

    const triggerThunderClap = () => {
      if (!this.ctx || !this.thunderGain || !this.isPlaying || this.mix.thunder <= 0.02) return;
      const now = this.ctx.currentTime;
      const duration = 3.6;
      const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * duration, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.2;
      }

      const src = this.ctx.createBufferSource();
      src.buffer = buf;

      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(145, now);

      const env = this.ctx.createGain();
      env.gain.setValueAtTime(0.001, now);
      env.gain.exponentialRampToValueAtTime(0.9, now + 0.35);
      env.gain.exponentialRampToValueAtTime(0.35, now + 1.2);
      env.gain.exponentialRampToValueAtTime(0.001, now + duration - 0.1);

      src.connect(lp);
      lp.connect(env);
      env.connect(this.thunderGain);
      src.start(now);
      src.stop(now + duration);
    };

    // Trigger an initial subtle rumble if thunder > 0.2
    if (this.mix.thunder > 0.2) {
      setTimeout(triggerThunderClap, 800);
    }

    this.thunderTimer = window.setInterval(() => {
      if (Math.random() < 0.55) {
        triggerThunderClap();
      }
    }, 6500);
  }

  // Channel 3: Meadow Wind Chimes (Pentatonic Crystalline Bells)
  private setupChimesChannel() {
    if (!this.ctx || !this.masterGain) return;
    this.chimesGain = this.ctx.createGain();
    this.chimesGain.gain.setValueAtTime(this.mix.chimes * 0.4, this.ctx.currentTime);
    this.chimesGain.connect(this.masterGain);

    // Pentatonic frequencies (F4, G4, A4, C5, D5, F5, G5, A5)
    const notes = [349.23, 392.00, 440.00, 523.25, 587.33, 698.46, 783.99, 880.00];

    const ringChime = () => {
      if (!this.ctx || !this.chimesGain || !this.isPlaying || this.mix.chimes <= 0.02) return;
      const now = this.ctx.currentTime;
      const freq = notes[Math.floor(Math.random() * notes.length)];

      const osc = this.ctx.createOscillator();
      const overtone = this.ctx.createOscillator();
      const env = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2.0, now);

      const overtoneGain = this.ctx.createGain();
      overtoneGain.gain.setValueAtTime(0.15, now);

      env.gain.setValueAtTime(0.001, now);
      env.gain.exponentialRampToValueAtTime(0.28, now + 0.04);
      env.gain.exponentialRampToValueAtTime(0.0008, now + 2.6);

      osc.connect(env);
      overtone.connect(overtoneGain);
      overtoneGain.connect(env);
      env.connect(this.chimesGain);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 2.7);
      overtone.stop(now + 2.7);
    };

    if (this.mix.chimes > 0.1) {
      setTimeout(ringChime, 400);
    }

    this.chimeTimer = window.setInterval(() => {
      if (Math.random() < 0.72) {
        ringChime();
      }
    }, 2200);
  }

  // Channel 4: Alpine Breeze (Pink Noise with LFO Gusts)
  private setupWindChannel() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const pinkNoise = this.ctx.createBufferSource();
    pinkNoise.buffer = noiseBuffer;
    pinkNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(310, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.6, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.16, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(160, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(this.mix.wind * 0.55, this.ctx.currentTime);

    pinkNoise.connect(filter);
    filter.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    pinkNoise.start();
    this.sourceNodes.push(pinkNoise, lfo);
  }

  // Channel 5: Warm Analog Chords (Fmaj9 Harmonic Sanctuary Drone)
  private setupChordsChannel() {
    if (!this.ctx || !this.masterGain) return;

    this.chordsGain = this.ctx.createGain();
    this.chordsGain.gain.setValueAtTime(this.mix.chords * 0.16, this.ctx.currentTime);
    this.chordsGain.connect(this.masterGain);

    // F3, C4, E4, G4 warm chord
    const freqs = [174.61, 261.63, 329.63, 392.00];
    freqs.forEach((f, idx) => {
      if (!this.ctx || !this.chordsGain) return;
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(620, this.ctx.currentTime);

      const voiceGain = this.ctx.createGain();
      voiceGain.gain.setValueAtTime(idx === 0 ? 0.45 : 0.22, this.ctx.currentTime);

      osc.connect(lp);
      lp.connect(voiceGain);
      voiceGain.connect(this.chordsGain);

      osc.start();
      this.sourceNodes.push(osc);
    });
  }

  private startAnalyzerLoop() {
    if (!this.analyser) return;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const check = () => {
      if (!this.isPlaying || !this.analyser) return;
      this.analyser.getByteFrequencyData(dataArray);

      if (this.onWaveData) {
        const levels = [
          Math.max(0.18, (dataArray[1] || 0) / 255),
          Math.max(0.18, (dataArray[3] || 0) / 255),
          Math.max(0.18, (dataArray[6] || 0) / 255),
          Math.max(0.18, (dataArray[10] || 0) / 255),
        ];
        this.onWaveData(levels);
      }

      this.animId = requestAnimationFrame(check);
    };

    check();
  }
}

export const soundscape = new SoundscapeEngine();
