// Audio service managing sound effects and background music with dual WebAudio + HTMLAudio failover

class SoundManager {
  private musicAudio: HTMLAudioElement | null = null;
  private sfxAudioMap: Map<string, HTMLAudioElement> = new Map();
  private sfxBufferMap: Map<string, AudioBuffer> = new Map();
  private activeSourceNodes: Map<string, AudioBufferSourceNode[]> = new Map();
  private sfxVolume: number = 0.8;
  private musicVolume: number = 0.5;
  private isMusicMuted: boolean = false;
  private currentTrackName: string = 'Msic00.mp3';
  private audioContext: AudioContext | null = null;
  private isUnlocked: boolean = false;

  // Major vocal/stinger sounds that should never overlap with each other
  private currentMajorSFX: string | null = null;
  private majorSFXList = new Set([
    '30-s-left.mp3',
    'faaah.mp3',
    'get-out-tuco.mp3',
    'suuuuui.mp3',
    'dry-fart.mp3',
    'n-ldhy-smtny-my-hydr.mp3',
    'anime-girl-voice.mp3',
    'du-bist-gut-genug.mp3',
    'plankton-augh.mp3',
    'yyy_ahqVbsA.mp3',
    'quack_5.mp3',
  ]);

  constructor() {
    this.initCapacitorAndVisibilityListeners();
    this.initAutoUnlock();

    // Eagerly preload and decode critical sound effects
    const prioritySounds = [
      'du-bist-gut-genug.mp3',
      'n-ldhy-smtny-my-hydr.mp3',
      'anime-girl-voice.mp3',
      '30-s-left.mp3',
      'faaah.mp3',
      'piuw.mp3',
      'dry-fart.mp3',
      'suuuuui.mp3',
      'plankton-augh.mp3',
      'get-out-tuco.mp3',
    ];
    prioritySounds.forEach((snd) => this.preloadAndDecode(snd));
  }

  private initAutoUnlock() {
    if (typeof window === 'undefined') return;

    const unlockHandler = () => {
      this.unlockAudio();
      window.removeEventListener('click', unlockHandler);
      window.removeEventListener('touchstart', unlockHandler);
      window.removeEventListener('pointerdown', unlockHandler);
      window.removeEventListener('keydown', unlockHandler);
    };

    window.addEventListener('click', unlockHandler, { passive: true });
    window.addEventListener('touchstart', unlockHandler, { passive: true });
    window.addEventListener('pointerdown', unlockHandler, { passive: true });
    window.addEventListener('keydown', unlockHandler, { passive: true });
  }

  public unlockAudio() {
    if (this.isUnlocked) return;
    try {
      const ctx = this.getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          this.isUnlocked = true;
        }).catch(() => {});
      } else {
        this.isUnlocked = true;
      }
    } catch {
      // Ignore unlock issues
    }
  }

  private initCapacitorAndVisibilityListeners() {
    if (typeof window === 'undefined') return;

    try {
      const win = window as any;
      if (win.Capacitor && win.Capacitor.Plugins && win.Capacitor.Plugins.App) {
        win.Capacitor.Plugins.App.addListener('appStateChange', (state: { isActive: boolean }) => {
          if (!state.isActive) {
            this.pauseAllAudio();
          }
        });
      }
    } catch {
      // Ignore if Capacitor is not present
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAllAudio();
      }
    });

    window.addEventListener('pagehide', () => {
      this.pauseAllAudio();
    });
  }

  public getAudioContext(): AudioContext {
    if (!this.audioContext) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioContextClass();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
    return this.audioContext;
  }

  // Preload and decode into memory buffer for instant, unbreakable playback
  public async preloadAndDecode(soundName: string) {
    if (this.sfxBufferMap.has(soundName)) return;

    try {
      const ctx = this.getAudioContext();
      // Try primary and fallback URLs
      const paths = [`/assets/${soundName}`, `/${soundName}`];
      let arrayBuffer: ArrayBuffer | null = null;

      for (const path of paths) {
        try {
          const res = await fetch(path);
          if (res.ok) {
            arrayBuffer = await res.arrayBuffer();
            break;
          }
        } catch {
          // Try next path
        }
      }

      if (arrayBuffer && ctx) {
        const decoded = await ctx.decodeAudioData(arrayBuffer);
        this.sfxBufferMap.set(soundName, decoded);
      }
    } catch {
      // Decode fallback handled in playSFX
    }
  }

  public setSFXVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  public getSFXVolume(): number {
    return this.sfxVolume;
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicAudio) {
      this.musicAudio.volume = this.isMusicMuted ? 0 : this.musicVolume;
    }
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public setMusicMuted(muted: boolean): boolean {
    this.isMusicMuted = muted;
    if (this.musicAudio) {
      this.musicAudio.volume = this.isMusicMuted ? 0 : this.musicVolume;
    }
    return this.isMusicMuted;
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

  // Smoothly duck background music during major voice/stingers to avoid noise overload
  private duckMusic() {
    if (this.musicAudio && !this.isMusicMuted) {
      this.musicAudio.volume = Math.max(0, this.musicVolume * 0.25);
    }
  }

  private restoreMusic() {
    if (this.musicAudio && !this.isMusicMuted) {
      this.musicAudio.volume = this.musicVolume;
    }
  }

  public playSFX(soundName: string) {
    if (this.sfxVolume <= 0) return;
    this.unlockAudio();

    // If it's a major vocal/stinger sound, stop any other major sound first to avoid chaotic overlapping!
    const isMajor = this.majorSFXList.has(soundName);
    if (isMajor) {
      if (this.currentMajorSFX && this.currentMajorSFX !== soundName) {
        this.stopSFX(this.currentMajorSFX);
      }
      this.currentMajorSFX = soundName;
      this.duckMusic();
    }

    // Tactile vibration feedback
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        if (soundName === 'piuw.mp3') {
          navigator.vibrate(15);
        } else if (soundName === 'dry-fart.mp3' || soundName === 'get-out-tuco.mp3') {
          navigator.vibrate([40, 30, 60]);
        } else if (soundName === '30-s-left.mp3') {
          navigator.vibrate([30, 20, 30]);
        }
      }
    } catch {}

    // Priority 1: High-performance WebAudio Buffer playback
    const buffer = this.sfxBufferMap.get(soundName);
    if (buffer) {
      try {
        const ctx = this.getAudioContext();
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        const source = ctx.createBufferSource();
        const gainNode = ctx.createGain();

        source.buffer = buffer;
        gainNode.gain.setValueAtTime(this.sfxVolume, ctx.currentTime);

        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        source.start(0);

        // Track active node for immediate stopping if needed
        const active = this.activeSourceNodes.get(soundName) || [];
        active.push(source);
        this.activeSourceNodes.set(soundName, active);

        source.onended = () => {
          const current = this.activeSourceNodes.get(soundName) || [];
          this.activeSourceNodes.set(
            soundName,
            current.filter((s) => s !== source)
          );
          if (this.currentMajorSFX === soundName) {
            this.currentMajorSFX = null;
            this.restoreMusic();
          }
        };
        return;
      } catch {
        // Fall back to HTMLAudio
      }
    }

    // Priority 2: Direct HTML Audio Playback with Multi-path Fallback
    try {
      const existing = this.sfxAudioMap.get(soundName);
      if (existing) {
        existing.pause();
        existing.currentTime = 0;
      }

      const audio = new Audio(`/assets/${soundName}`);
      audio.volume = this.sfxVolume;
      this.sfxAudioMap.set(soundName, audio);

      audio.onended = () => {
        if (this.currentMajorSFX === soundName) {
          this.currentMajorSFX = null;
          this.restoreMusic();
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If /assets/ fails, try root /
          const fallbackAudio = new Audio(`/${soundName}`);
          fallbackAudio.volume = this.sfxVolume;
          this.sfxAudioMap.set(soundName, fallbackAudio);
          fallbackAudio.onended = () => {
            if (this.currentMajorSFX === soundName) {
              this.currentMajorSFX = null;
              this.restoreMusic();
            }
          };
          fallbackAudio.play().catch(() => {
            // As last resort, synthesize tone
            this.playSyntheticSFX(soundName);
          });
        });
      }
    } catch {
      this.playSyntheticSFX(soundName);
    }

    // Trigger async background decode for future instant plays
    this.preloadAndDecode(soundName);
  }

  // Instantly stop an active SFX
  public stopSFX(soundName: string) {
    try {
      // 1. Stop WebAudio buffer source nodes
      const activeNodes = this.activeSourceNodes.get(soundName);
      if (activeNodes && activeNodes.length > 0) {
        activeNodes.forEach((node) => {
          try {
            node.stop();
            node.disconnect();
          } catch {}
        });
        this.activeSourceNodes.set(soundName, []);
      }

      // 2. Stop HTMLAudio element
      const audio = this.sfxAudioMap.get(soundName);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      if (this.currentMajorSFX === soundName) {
        this.currentMajorSFX = null;
        this.restoreMusic();
      }
    } catch {
      // Safely ignore
    }
  }

  // Instantly stop ALL active sound effects
  public stopAllSFX() {
    this.activeSourceNodes.forEach((nodes, soundName) => {
      nodes.forEach((n) => {
        try {
          n.stop();
          n.disconnect();
        } catch {}
      });
    });
    this.activeSourceNodes.clear();

    this.sfxAudioMap.forEach((audio) => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {}
    });

    this.currentMajorSFX = null;
    this.restoreMusic();
  }

  // Custom AI-generated harmonic chime for switching languages (distinct, soft, and modern)
  public playLanguageSwitchSound() {
    if (this.sfxVolume <= 0) return;
    try {
      const ctx = this.getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const now = ctx.currentTime;

      // 3-note ascending crystalline arpeggio chime (C5 -> E5 -> G5)
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.07);

        gain.gain.setValueAtTime(0, now + index * 0.07);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.25, now + index * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.07 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.07);
        osc.stop(now + index * 0.07 + 0.35);
      });
    } catch {
      // Ignore if audio context cannot run
    }
  }

  // Synthetic WebAudio fallback if network or audio decoding is offline
  private playSyntheticSFX(soundName: string) {
    try {
      const ctx = this.getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
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
      // Ignore
    }
  }

  // Music playback session management to strictly prevent overlapping/duplicate tracks
  private musicSessionId: number = 0;

  public playMusic(trackName: string = 'Msic00.mp3') {
    this.unlockAudio();
    this.currentTrackName = trackName;
    const currentSession = ++this.musicSessionId;

    // 1. Immediately detach handlers and stop any existing music to eliminate ghost/duplicate instances
    if (this.musicAudio) {
      this.musicAudio.onended = null;
      this.musicAudio.onerror = null;
      this.musicAudio.oncanplay = null;
      try {
        this.musicAudio.pause();
        this.musicAudio.currentTime = 0;
        this.musicAudio.src = '';
        this.musicAudio.load();
      } catch {}
      this.musicAudio = null;
    }

    // Build unique candidate list
    const candidates = [
      `/assets/${trackName}`,
      `/${trackName}`,
      `/assets/${trackName.toLowerCase()}`,
      `/${trackName.toLowerCase()}`,
    ];
    const uniqueCandidates = Array.from(new Set(candidates));

    try {
      const audio = new Audio();
      audio.loop = true;
      audio.volume = this.isMusicMuted ? 0 : this.musicVolume;
      this.musicAudio = audio;

      let candidateIndex = 0;
      const tryPlayCandidate = () => {
        // If a new track or stop was requested, cancel this attempt immediately
        if (this.musicSessionId !== currentSession) return;
        if (candidateIndex >= uniqueCandidates.length) return;

        const candidateUrl = uniqueCandidates[candidateIndex];
        candidateIndex++;

        audio.onerror = () => {
          if (this.musicSessionId === currentSession) {
            tryPlayCandidate();
          }
        };

        audio.src = candidateUrl;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (this.musicSessionId === currentSession) {
              tryPlayCandidate();
            }
          });
        }
      };

      tryPlayCandidate();
    } catch {
      // Safely ignore
    }
  }

  public stopMusic() {
    this.musicSessionId++; // Invalidate all pending candidate playback promises
    if (this.musicAudio) {
      this.musicAudio.onended = null;
      this.musicAudio.onerror = null;
      this.musicAudio.oncanplay = null;
      try {
        this.musicAudio.pause();
        this.musicAudio.currentTime = 0;
        this.musicAudio.src = '';
        this.musicAudio.load();
      } catch {}
      this.musicAudio = null;
    }
  }

  public pauseAllAudio() {
    if (this.musicAudio) {
      this.musicAudio.pause();
    }
    this.sfxAudioMap.forEach((audio) => {
      audio.pause();
    });
    this.activeSourceNodes.forEach((nodes) => {
      nodes.forEach((n) => {
        try {
          n.stop();
        } catch {}
      });
    });
    this.currentMajorSFX = null;
    this.restoreMusic();
  }

  public isMusicPlaying(): boolean {
    return !!(
      this.musicAudio &&
      !this.musicAudio.paused &&
      this.musicAudio.currentTime > 0 &&
      !this.musicAudio.ended
    );
  }

  public getCurrentTrack(): string {
    return this.currentTrackName;
  }
}

export const soundService = new SoundManager();
