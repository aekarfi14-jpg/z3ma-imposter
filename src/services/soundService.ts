// Audio service managing sound effects and background music

class SoundManager {
  private musicAudio: HTMLAudioElement | null = null;
  private sfxAudioMap: Map<string, HTMLAudioElement> = new Map();
  private sfxVolume: number = 0.8;
  private musicVolume: number = 0.5;
  private isMusicMuted: boolean = false;
  private currentTrackName: string = 'Msic00.mp3';
  private audioContext: AudioContext | null = null;

  constructor() {
    // Lazy init
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioContextClass();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  public setSFXVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicAudio) {
      this.musicAudio.volume = this.isMusicMuted ? 0 : this.musicVolume;
    }
  }

  public toggleMusicMute(): boolean {
    this.isMusicMuted = !this.isMusicMuted;
    if (this.musicAudio) {
      this.musicAudio.volume = this.isMusicMuted ? 0 : this.musicVolume;
    }
    return this.isMusicMuted;
  }

  public getIsMusicMuted(): boolean {
    return this.isMusicMuted;
  }

  public playSFX(soundName: string) {
    if (this.sfxVolume <= 0) return;

    try {
      // Vibrate for feedback if supported
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        if (soundName === 'piuw.mp3') {
          navigator.vibrate(20);
        } else if (soundName === 'dry-fart.mp3' || soundName === 'get-out-tuco.mp3') {
          navigator.vibrate([60, 40, 80]);
        } else if (soundName === '30-s-left.mp3') {
          navigator.vibrate([40, 20, 40]);
        }
      }

      // Try playing the static file from /assets/
      const audioPath = `/assets/${soundName}`;
      let audio = this.sfxAudioMap.get(soundName);
      if (!audio) {
        audio = new Audio(audioPath);
        this.sfxAudioMap.set(soundName, audio);
      } else {
        audio.currentTime = 0;
      }

      audio.volume = this.sfxVolume;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Playback failed or user gesture needed, trigger synthetic WebAudio fallback
          this.playSyntheticSFX(soundName);
        });
      }
    } catch {
      this.playSyntheticSFX(soundName);
    }
  }

  // High-fidelity synthesized WebAudio fallback so sounds always play
  private playSyntheticSFX(soundName: string) {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (soundName === 'piuw.mp3') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
        gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (soundName === 'dry-fart.mp3') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.linearRampToValueAtTime(55, now + 0.6);
        gain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (soundName === '30-s-left.mp3') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (soundName === 'faaah.mp3') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(200, now + 0.8);
        gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      } else if (soundName === 'suuuuui.mp3') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.7);
        gain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.7);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (soundName === 'yyy_ahqVbsA.mp3' || soundName === 'quack_5.mp3') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.4);
        gain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch {
      // Ignore audio synthesis errors in restricted autoplay contexts
    }
  }

  public playMusic(trackName: string = 'Msic00.mp3') {
    this.currentTrackName = trackName;
    const musicPath = `/assets/${trackName}`;

    try {
      if (this.musicAudio) {
        this.musicAudio.pause();
      }

      this.musicAudio = new Audio(musicPath);
      this.musicAudio.loop = true;
      this.musicAudio.volume = this.isMusicMuted ? 0 : this.musicVolume;
      const playPromise = this.musicAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy prevented music until first tap
        });
      }
    } catch {
      // Safely ignore
    }
  }

  public stopMusic() {
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
    }
  }

  public getCurrentTrack(): string {
    return this.currentTrackName;
  }
}

export const soundService = new SoundManager();
