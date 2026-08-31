import {
  CommemorativePhoto,
  GameRoundSummary,
  GameSettings,
  PastAssistantRecord,
  Player,
  SecretWordItem,
  VoiceRecording,
} from '../types';
import {
  CATEGORIES,
  CATEGORY_HINTS_MAP,
  doesWordMatchCategoryHint,
  normalizeArabicComparison,
} from '../data/words';
import { getRandomAvatarId } from '../data/avatars';

const STORAGE_KEYS = {
  SETTINGS: 'z3ma_imposter_settings',
  PLAYERS: 'z3ma_imposter_players',
  ROUND_COUNTER: 'z3ma_imposter_round_count',
  PHOTOS: 'z3ma_imposter_photos',
  RECORDINGS: 'z3ma_imposter_recordings',
  HISTORY: 'z3ma_imposter_history',
  PAST_ASSISTANT: 'z3ma_imposter_past_assistant',
  CUSTOM_WORDS: 'z3ma_imposter_custom_words',
};

const DEFAULT_PLAYERS: Player[] = [
  { id: 'p1', name: 'يونس', avatarId: 'wolf' },
  { id: 'p2', name: 'أسماء', avatarId: 'fox' },
  { id: 'p3', name: 'ياسر', avatarId: 'detective' },
  { id: 'p4', name: 'يوسف', avatarId: 'fennec' },
  { id: 'p5', name: 'محمد', avatarId: 'ninja' },
];

const DEFAULT_SETTINGS: GameSettings = {
  imposterCount: 1,
  durationSeconds: 300, // 5 minutes default
  hintEnabled: true,
  assistantEnabled: false,
  enabledCategoryIds: CATEGORIES.map((c) => c.id),
  sfxVolume: 0.8,
  musicVolume: 0.5,
  language: 'ar',
  lastUsedWordIds: [],
  currentTrack: 'Msic00.mp3',
};

export const storageService = {
  getSettings(): GameSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: Partial<GameSettings>): GameSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch {
      // Ignore
    }
    return updated;
  },

  getPlayers(): Player[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLAYERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return DEFAULT_PLAYERS;
  },

  savePlayers(players: Player[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    } catch {
      // Ignore
    }
  },

  getRoundCount(): number {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.ROUND_COUNTER);
      return val ? parseInt(val, 10) || 1 : 1;
    } catch {
      return 1;
    }
  },

  incrementRoundCount(): number {
    const next = this.getRoundCount() + 1;
    try {
      localStorage.setItem(STORAGE_KEYS.ROUND_COUNTER, next.toString());
    } catch {
      // Ignore
    }
    return next;
  },

  addUsedWord(wordId: string) {
    const settings = this.getSettings();
    const recent = [wordId, ...settings.lastUsedWordIds.filter((id) => id !== wordId)].slice(0, 50);
    this.saveSettings({ lastUsedWordIds: recent });
  },

  getPastAssistant(): PastAssistantRecord | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAST_ASSISTANT);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  setPastAssistant(record: PastAssistantRecord | null) {
    try {
      if (record) {
        localStorage.setItem(STORAGE_KEYS.PAST_ASSISTANT, JSON.stringify(record));
      } else {
        localStorage.removeItem(STORAGE_KEYS.PAST_ASSISTANT);
      }
    } catch {
      // Ignore
    }
  },

  getPhotos(): CommemorativePhoto[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  savePhoto(photo: CommemorativePhoto) {
    const photos = [photo, ...this.getPhotos()].slice(0, 30);
    try {
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
    } catch (e) {
      // If local storage is full, keep fewer photos
      try {
        const trimmed = [photo, ...this.getPhotos()].slice(0, 10);
        localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(trimmed));
      } catch {}
    }
  },

  deletePhoto(id: string) {
    const photos = this.getPhotos().filter((p) => p.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
    } catch {}
  },

  getRecordings(): VoiceRecording[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECORDINGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  saveRecording(recording: VoiceRecording) {
    const list = [recording, ...this.getRecordings()].slice(0, 20);
    try {
      localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(list));
    } catch {}
  },

  deleteRecording(id: string) {
    const list = this.getRecordings().filter((r) => r.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(list));
    } catch {}
  },

  getHistory(): GameRoundSummary[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  addHistory(summary: GameRoundSummary) {
    const list = [summary, ...this.getHistory()].slice(0, 50);
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(list));
    } catch {}
  },

  deleteHistory(id: string) {
    const list = this.getHistory().filter((h) => h.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(list));
    } catch {}
  },

  getCustomWords(): SecretWordItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_WORDS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  addCustomWord(
    word: string,
    categoryId: string
  ): { success: boolean; reason?: 'MATCHES_HINT' | 'DUPLICATE' | 'INVALID' } {
    const cleanWord = word.trim();
    if (!cleanWord || cleanWord.length < 2) {
      return { success: false, reason: 'INVALID' };
    }

    // 1. Check if the word matches any reserved hint in the category
    if (doesWordMatchCategoryHint(cleanWord, categoryId)) {
      return { success: false, reason: 'MATCHES_HINT' };
    }

    const customList = this.getCustomWords();

    // 2. Check for duplicate in the same category
    const exists = customList.some(
      (w) =>
        normalizeArabicComparison(w.word) === normalizeArabicComparison(cleanWord) &&
        w.categoryId === categoryId
    );
    if (exists) {
      return { success: false, reason: 'DUPLICATE' };
    }

    // 3. Attach the pool of 7 contextual hints of this category
    const hintsObj = CATEGORY_HINTS_MAP[categoryId] || {
      hintsAr: ['سر', 'لغز', 'فكرة', 'رمز', 'تلميح', 'خيال', 'شفرة'],
      hintsEn: ['Secret', 'Mystery', 'Idea', 'Symbol', 'Hint', 'Imagination', 'Code'],
    };

    const newWordItem: SecretWordItem = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      categoryId,
      word: cleanWord,
      wordEn: cleanWord,
      // 7 contextual hints associated with this category
      hintsAr: [...hintsObj.hintsAr],
      hintsEn: [...hintsObj.hintsEn],
    };

    const updated = [...customList, newWordItem];
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_WORDS, JSON.stringify(updated));
      return { success: true };
    } catch {
      return { success: false, reason: 'INVALID' };
    }
  },
};
