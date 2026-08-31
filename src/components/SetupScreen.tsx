import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  UserPlus,
  Trash2,
  Clock,
  Skull,
  Lightbulb,
  Shield,
  Volume2,
  Music,
  Check,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Play,
  Dice5,
  X,
} from 'lucide-react';
import { GameSettings, Language, PastAssistantRecord, Player } from '../types';
import { CATEGORIES } from '../data/words';
import { AVATARS, getAvatarById, getRandomAvatarId } from '../data/avatars';
import { translations } from '../i18n/translations';
import { soundService } from '../services/soundService';

interface SetupScreenProps {
  language: Language;
  players: Player[];
  settings: GameSettings;
  pastAssistant: PastAssistantRecord | null;
  onClearPastAssistant: () => void;
  onUpdatePlayers: (players: Player[]) => void;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
  onStartGame: () => void;
}

// Smart text normalizer for Arabic typing easter eggs
const normalizeArabic = (text: string) => {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove tashkeel
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[يى]/g, 'ي');
};

const getSecretNameMessage = (input: string, lang: Language): string | null => {
  if (lang !== 'ar') return null;
  const norm = normalizeArabic(input);
  if (!norm) return null;

  if (norm === 'يونس') {
    return 'شيكور سيدي المبجل اتمنى ان تكون بخير';
  }
  if (norm === 'اسماء') {
    return 'انت اخت المطور ربحتي قبل ما تبدا اللعبة';
  }
  if (norm === 'سهيله' || norm === 'امينه' || norm === 'سميه') {
    return 'وي قرطوفة راكم ملاح';
  }
  if (norm === 'انفال' || norm === 'صالح') {
    return 'جوسبار ناس تسمسيلت راهم ملاح';
  }
  if (norm === 'يوسف') {
    return 'الله يبارك راك غي تزيد تطوال';
  }
  return null;
};

export const SetupScreen: React.FC<SetupScreenProps> = ({
  language,
  players,
  settings,
  pastAssistant,
  onClearPastAssistant,
  onUpdatePlayers,
  onUpdateSettings,
  onStartGame,
}) => {
  const t = translations[language];
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingAvatarPlayerId, setEditingAvatarPlayerId] = useState<string | null>(null);
  const [secretMessage, setSecretMessage] = useState<string | null>(null);
  const lastTriggeredNameRef = useRef<string>('');
  const secretTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Maximum imposters is min(4, totalPlayers - 1)
  const maxAllowedImposters = Math.min(4, Math.max(1, players.length - 1));

  // Smart typing check (only when user types manually in Arabic)
  const checkAndTriggerSecret = (typedText: string) => {
    if (language !== 'ar') return;
    const msg = getSecretNameMessage(typedText, language);
    const norm = normalizeArabic(typedText);

    if (msg && lastTriggeredNameRef.current !== norm) {
      lastTriggeredNameRef.current = norm;
      setSecretMessage(msg);
      soundService.playSFX('suuuuui.mp3');

      if (secretTimerRef.current) clearTimeout(secretTimerRef.current);
      secretTimerRef.current = setTimeout(() => {
        setSecretMessage(null);
      }, 4500);
    } else if (!msg) {
      lastTriggeredNameRef.current = '';
    }
  };

  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newPlayerName.trim();
    if (!trimmed) return;
    if (players.length >= 50) return;

    soundService.playSFX('piuw.mp3');
    const newPlayer: Player = {
      id: 'p_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      name: trimmed,
      avatarId: getRandomAvatarId(),
    };
    onUpdatePlayers([...players, newPlayer]);
    setNewPlayerName('');
  };

  const handleRemovePlayer = (id: string) => {
    if (players.length <= 3) return;
    soundService.playSFX('piuw.mp3');
    const filtered = players.filter((p) => p.id !== id);
    onUpdatePlayers(filtered);

    // Adjust imposter count if needed
    if (settings.imposterCount >= filtered.length) {
      onUpdateSettings({ imposterCount: Math.max(1, filtered.length - 1) });
    }
  };

  const handleUpdatePlayerName = (id: string, name: string) => {
    onUpdatePlayers(
      players.map((p) => (p.id === id ? { ...p, name } : p))
    );
  };

  const handleSelectAvatar = (playerId: string, avatarId: string) => {
    soundService.playSFX('piuw.mp3');
    onUpdatePlayers(
      players.map((p) => (p.id === playerId ? { ...p, avatarId } : p))
    );
    setEditingAvatarPlayerId(null);
  };

  const handleRandomizeAllAvatars = () => {
    soundService.playSFX('piuw.mp3');
    onUpdatePlayers(
      players.map((p) => ({ ...p, avatarId: getRandomAvatarId() }))
    );
  };

  const handleToggleCategory = (categoryId: string) => {
    soundService.playSFX('piuw.mp3');
    const current = settings.enabledCategoryIds;
    let next: string[];
    if (current.includes(categoryId)) {
      if (current.length === 1) return; // keep at least 1
      next = current.filter((id) => id !== categoryId);
    } else {
      next = [...current, categoryId];
    }
    onUpdateSettings({ enabledCategoryIds: next });
  };

  const handleSelectTrack = (track: string) => {
    soundService.playSFX('piuw.mp3');
    onUpdateSettings({ currentTrack: track });
    soundService.playMusic(track);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 pb-12 space-y-6 relative">
      {/* Easter Egg / Secret Typing Toast Banner */}
      <AnimatePresence>
        {secretMessage && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed top-5 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-4 rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-2xl border border-white/30 backdrop-blur-md flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-bounce">✨</span>
              <p className="font-cairo font-bold text-sm sm:text-base leading-snug drop-shadow">
                {secretMessage}
              </p>
            </div>
            <button
              onClick={() => setSecretMessage(null)}
              className="p-1.5 rounded-xl bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all text-xs shrink-0"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Past Assistant Warning Banner (if exposed previously) */}
      {pastAssistant && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-amber-950/80 border-2 border-amber-500/60 shadow-lg shadow-amber-950/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 className="font-bold font-cairo text-sm sm:text-base text-amber-100">
                {language === 'ar'
                  ? `⚠️ المساعد [${pastAssistant.assistantName}] خربها المرة الماضية 😂`
                  : `⚠️ Assistant [${pastAssistant.assistantName}] blew cover last time 😂`}
              </h4>
              <p className="text-xs text-amber-300/80">
                {language === 'ar'
                  ? 'نورمالمو ما يلعبش الجولة الجاية... تسامحوه ولا يقعد يصفق؟'
                  : 'Technically on timeout... do you forgive them to play?'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundService.playSFX('piuw.mp3');
              onClearPastAssistant();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all self-end sm:self-center"
          >
            {language === 'ar' ? 'سامحناه 👍' : 'Forgiven 👍'}
          </button>
        </motion.div>
      )}

      {/* Players Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100 font-cairo">
                {t.playersList} ({players.length})
              </h3>
              <p className="text-xs text-slate-400">
                {players.length < 3 ? (
                  <span className="text-rose-400 font-semibold">{t.minPlayersWarning}</span>
                ) : (
                  <span>{t.maxPlayersWarning}</span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={handleRandomizeAllAvatars}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all active:scale-95"
            title="Randomize Avatars"
          >
            <Dice5 size={15} className="text-cyan-400" />
            <span className="hidden sm:inline">
              {language === 'ar' ? 'خلط الشخصيات' : 'Randomize'}
            </span>
          </button>
        </div>

        {/* Add Player Input */}
        <form onSubmit={handleAddPlayer} className="flex gap-2 items-center">
          <input
            id="new-player-input"
            type="text"
            value={newPlayerName}
            onChange={(e) => {
              const val = e.target.value;
              setNewPlayerName(val);
              checkAndTriggerSecret(val);
            }}
            placeholder={t.playerNamePlaceholder}
            maxLength={25}
            className="flex-1 min-w-0 bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-cairo text-xs sm:text-sm"
          />
          <button
            type="submit"
            disabled={!newPlayerName.trim() || players.length >= 50}
            className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold font-cairo text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all active:scale-95 shrink-0"
          >
            <UserPlus size={15} className="shrink-0" />
            <span className="whitespace-nowrap">{t.addPlayer}</span>
          </button>
        </form>

        {/* Players Scrollable Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
          {players.map((player, index) => {
            const avatar = getAvatarById(player.avatarId);
            const isEditingThisAvatar = editingAvatarPlayerId === player.id;

            return (
              <div
                key={player.id}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  {/* Avatar Click to change */}
                  <button
                    type="button"
                    onClick={() => {
                      soundService.playSFX('piuw.mp3');
                      setEditingAvatarPlayerId(isEditingThisAvatar ? null : player.id);
                    }}
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${avatar.bgGradient} flex items-center justify-center text-xl shadow-md border-2 ${
                      isEditingThisAvatar ? 'border-cyan-400 scale-105' : 'border-slate-700'
                    } transition-all relative group`}
                    title="Change Avatar"
                  >
                    <span>{avatar.svgIcon}</span>
                    <span className="absolute -bottom-1 -right-1 text-[9px] bg-slate-900 rounded-full px-1 border border-slate-700">
                      ✏️
                    </span>
                  </button>

                  {/* Player Name Input */}
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleUpdatePlayerName(player.id, val);
                      checkAndTriggerSecret(val);
                    }}
                    maxLength={25}
                    className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-500 text-slate-200 font-cairo font-semibold text-sm px-1 py-0.5 focus:outline-none flex-1 truncate"
                  />
                </div>

                {/* Remove Player Button (if > 3) */}
                {players.length > 3 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(player.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors rounded-xl hover:bg-rose-500/10 active:scale-95"
                    title="Remove Player"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Avatar Picker Modal Dropdown */}
        {editingAvatarPlayerId && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-xl space-y-2"
          >
            <div className="flex items-center justify-between text-xs text-cyan-300 font-bold">
              <span>{language === 'ar' ? 'اختر شخصية للـلاعب:' : 'Choose Avatar:'}</span>
              <button
                onClick={() => setEditingAvatarPlayerId(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => handleSelectAvatar(editingAvatarPlayerId, av.id)}
                  className={`p-2 rounded-xl bg-gradient-to-tr ${av.bgGradient} flex flex-col items-center justify-center gap-1 hover:scale-110 active:scale-95 transition-all border border-slate-700`}
                >
                  <span className="text-2xl">{av.svgIcon}</span>
                  <span className="text-[9px] text-white/90 truncate max-w-full font-medium">
                    {language === 'ar' ? av.nameAr : av.nameEn}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Imposters & Duration Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Imposters Counter */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Skull size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 font-cairo text-sm sm:text-base">
                {t.imposterCount}
              </h4>
              <p className="text-[11px] text-slate-400">{t.imposterRule}</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-2 rounded-2xl border border-slate-800">
            {[1, 2, 3, 4].map((num) => {
              const isDisabled = num >= players.length;
              const isSelected = settings.imposterCount === num;

              return (
                <button
                  key={num}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    soundService.playSFX('piuw.mp3');
                    onUpdateSettings({ imposterCount: num });
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-black text-sm font-outfit transition-all flex flex-col items-center ${
                    isSelected
                      ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/30 scale-105'
                      : isDisabled
                      ? 'text-slate-600 opacity-40 cursor-not-allowed'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <span>{num}</span>
                  <span className="text-[9px] font-normal font-cairo">
                    {num === 1 ? 'Imposter' : 'Imposters'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration Picker */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-100 font-cairo text-sm sm:text-base">
                {t.investigationTime}
              </h4>
              <p className="text-[11px] text-slate-400">
                {Math.floor(settings.durationSeconds / 60)} {t.minutes}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 bg-slate-950 p-2 rounded-2xl border border-slate-800 gap-1.5">
            {[2, 3, 5, 8, 10, 15, 20].map((mins) => {
              const isSelected = settings.durationSeconds === mins * 60;
              return (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    soundService.playSFX('piuw.mp3');
                    onUpdateSettings({ durationSeconds: mins * 60 });
                  }}
                  className={`py-2 px-1 rounded-xl font-bold text-xs sm:text-sm font-outfit text-center transition-all ${
                    isSelected
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {mins}m
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Special Game Mechanics Toggles: Hint & Assistant */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Hint System */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 mt-0.5">
              <Lightbulb size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-100 font-cairo text-sm">{t.hintToggle}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-cairo ${settings.hintEnabled ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-slate-800 text-slate-400'}`}>
                  {settings.hintEnabled ? (language === 'ar' ? 'مفعل' : 'ON') : (language === 'ar' ? 'معطل' : 'OFF')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">{t.hintDesc}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundService.playSFX('piuw.mp3');
              onUpdateSettings({ hintEnabled: !settings.hintEnabled });
            }}
            className={`w-12 h-7 rounded-full transition-colors relative p-1 flex items-center cursor-pointer overflow-hidden ${
              settings.hintEnabled
                ? 'bg-yellow-500 shadow-md shadow-yellow-500/25 justify-end'
                : 'bg-slate-800 justify-start'
            }`}
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 700, damping: 35 }}
              className="w-5 h-5 rounded-full bg-slate-950 shadow-md shrink-0 pointer-events-none"
            />
          </button>
        </div>

        {/* Secret Assistant */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-0.5">
              <Shield size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-100 font-cairo text-sm">{t.assistantToggle}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-cairo ${settings.assistantEnabled ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400'}`}>
                  {settings.assistantEnabled ? (language === 'ar' ? 'مفعل' : 'ON') : (language === 'ar' ? 'معطل' : 'OFF')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">{t.assistantDesc}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundService.playSFX('piuw.mp3');
              onUpdateSettings({ assistantEnabled: !settings.assistantEnabled });
            }}
            className={`w-12 h-7 rounded-full transition-colors relative p-1 flex items-center cursor-pointer overflow-hidden ${
              settings.assistantEnabled
                ? 'bg-amber-500 shadow-md shadow-amber-500/25 justify-end'
                : 'bg-slate-800 justify-start'
            }`}
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 700, damping: 35 }}
              className="w-5 h-5 rounded-full bg-slate-950 shadow-md shrink-0 pointer-events-none"
            />
          </button>
        </div>
      </div>

      {/* Categories Selection */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-100 font-cairo text-base flex items-center gap-2">
            <span>{t.categories}</span>
            <span className="text-xs text-cyan-400 font-normal">
              ({settings.enabledCategoryIds.length}/{CATEGORIES.length})
            </span>
          </h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {CATEGORIES.map((cat) => {
            const isEnabled = settings.enabledCategoryIds.includes(cat.id);

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleToggleCategory(cat.id)}
                className={`p-3 rounded-2xl border text-right sm:text-start transition-all flex items-center gap-2.5 active:scale-95 ${
                  isEnabled
                    ? 'bg-slate-950 border-cyan-500/50 text-slate-100 shadow-md shadow-cyan-950/20'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-xs font-bold font-cairo flex-1 truncate">
                  {language === 'ar' ? cat.nameAr : cat.nameEn}
                </span>
                {isEnabled && <Check size={14} className="text-cyan-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Audio & Music Settings */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <h4 className="font-bold text-slate-100 font-cairo text-base flex items-center gap-2">
          <Volume2 size={18} className="text-cyan-400" />
          <span>{t.audioSettings}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            { id: 'Msic00.mp3', label: t.track1 },
            { id: 'msic01.mp3', label: t.track2 },
            { id: 'msic02.mp3', label: t.track3 },
          ].map((trk) => {
            const isSelected = settings.currentTrack === trk.id;
            return (
              <button
                key={trk.id}
                type="button"
                onClick={() => handleSelectTrack(trk.id)}
                className={`p-3 rounded-2xl border text-xs font-bold font-cairo transition-all flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-indigo-950 border-indigo-500 text-indigo-200 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Music size={15} className={isSelected ? 'text-indigo-400' : 'text-slate-500'} />
                  <span className="truncate">{trk.label}</span>
                </div>
                {isSelected && <Check size={14} className="text-indigo-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Start Button */}
      <motion.button
        id="setup-start-game-btn"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          soundService.playSFX('dry-fart.mp3');
          onStartGame();
        }}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-cairo font-black text-lg shadow-xl shadow-cyan-500/30 border border-cyan-300/40 flex items-center justify-center gap-3 transition-all"
      >
        <Play size={22} className="fill-current" />
        <span>{t.startRoundButton}</span>
      </motion.button>
    </div>
  );
};
