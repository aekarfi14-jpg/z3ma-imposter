export type GamePhase =
  | 'HOME'
  | 'SETUP'
  | 'PHOTO_PROMPT'
  | 'CAMERA'
  | 'CARD_DISTRIBUTION'
  | 'INVESTIGATION'
  | 'VOTING'
  | 'REVEAL_ELIMINATION'
  | 'FINAL_GUESS'
  | 'GAME_OVER'
  | 'ALBUM'
  | 'RULES';

export type Language = 'ar' | 'en';

export interface Player {
  id: string;
  name: string;
  avatarId: string;
  isImposter?: boolean;
  isAssistant?: boolean;
  isEliminated?: boolean;
  votesReceived?: number;
  votedForId?: string | null;
}

export interface SecretWordItem {
  id: string;
  categoryId: string;
  word: string;
  wordEn: string;
  hintsAr: string[];
  hintsEn: string[];
}

export interface CategoryItem {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  color: string;
  enabled: boolean;
}

export interface GameSettings {
  imposterCount: number;
  durationSeconds: number;
  hintEnabled: boolean;
  assistantEnabled: boolean;
  enabledCategoryIds: string[];
  sfxVolume: number;
  musicVolume: number;
  language: Language;
  lastUsedWordIds: string[];
  currentTrack: string;
}

export interface CommemorativePhoto {
  id: string;
  roundNumber: number;
  date: string;
  timestamp: number;
  photoDataUrl: string;
  playersCount: number;
  imposterCount: number;
  playerNames: string[];
}

export interface VoiceRecording {
  id: string;
  roundNumber: number;
  filename: string;
  date: string;
  timestamp: number;
  audioBlobUrl: string;
  durationSeconds: number;
  audioData?: string; // base64 for persistent storage
}

export interface PastAssistantRecord {
  roundNumber: number;
  assistantName: string;
  date: string;
}

export interface GameRoundSummary {
  id: string;
  roundNumber: number;
  date: string;
  secretWord: string;
  categoryName: string;
  imposters: string[];
  assistant?: string;
  winner: 'IMPOSTERS' | 'CREW';
  eliminationHistory: { playerName: string; isImposter: boolean; roundIndex: number }[];
  finalGuessCorrect?: boolean;
}

export interface AvatarOption {
  id: string;
  nameAr: string;
  nameEn: string;
  svgIcon: string;
  bgGradient: string;
}
