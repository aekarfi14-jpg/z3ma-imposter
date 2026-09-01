import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Home,
  Trophy,
  ShieldCheck,
  Skull,
  HelpCircle,
  Volume2,
} from 'lucide-react';
import { Language, Player, SecretWordItem, CategoryItem } from '../types';
import { translations } from '../i18n/translations';
import {
  ASSISTANT_EXPOSED_MESSAGES_AR,
  ASSISTANT_EXPOSED_MESSAGES_EN,
} from '../data/quotes';
import { getAvatarById } from '../data/avatars';
import { soundService } from '../services/soundService';

interface GameOverScreenProps {
  language: Language;
  roundNumber: number;
  winner: 'IMPOSTERS' | 'CREW';
  imposters: Player[];
  assistant: Player | null;
  secretWord: SecretWordItem;
  category: CategoryItem;
  onPlayAgain: () => void;
  onBackHome: () => void;
  onAssistantExposed: (assistantName: string, isExposed: boolean) => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  language,
  roundNumber,
  winner,
  imposters,
  assistant,
  secretWord,
  category,
  onPlayAgain,
  onBackHome,
  onAssistantExposed,
}) => {
  const t = translations[language];
  const [assistantReviewAnswered, setAssistantReviewAnswered] = useState(false);
  const [assistantToast, setAssistantToast] = useState<string | null>(null);

  const isImpostersWinner = winner === 'IMPOSTERS';
  const categoryName = language === 'ar' ? category.nameAr : category.nameEn;
  const wordDisplay = language === 'ar' ? secretWord.word : secretWord.wordEn;

  // Stop background music and trigger win sound immediately
  useEffect(() => {
    soundService.unlockAudio();
    soundService.stopMusic();
    soundService.playSFX('du-bist-gut-genug.mp3');

    try {
      confetti({
        particleCount: isImpostersWinner ? 80 : 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: isImpostersWinner
          ? ['#ef4444', '#f97316', '#dc2626']
          : ['#38bdf8', '#10b981', '#6366f1', '#f59e0b'],
      });
    } catch {}
  }, [isImpostersWinner]);

  const handleAssistantExposedReview = (exposed: boolean) => {
    if (!assistant) return;
    soundService.playSFX('piuw.mp3');
    setAssistantReviewAnswered(true);

    if (exposed) {
      soundService.playSFX('plankton-augh.mp3');
      const template =
        language === 'ar'
          ? ASSISTANT_EXPOSED_MESSAGES_AR[
              Math.floor(Math.random() * ASSISTANT_EXPOSED_MESSAGES_AR.length)
            ]
          : ASSISTANT_EXPOSED_MESSAGES_EN[
              Math.floor(Math.random() * ASSISTANT_EXPOSED_MESSAGES_EN.length)
            ];
      setAssistantToast(template.replace(/\[NAME\]/g, assistant.name));
      onAssistantExposed(assistant.name, true);
    } else {
      soundService.playSFX('du-bist-gut-genug.mp3');
      onAssistantExposed(assistant.name, false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 flex flex-col items-center justify-between min-h-[calc(100vh-6rem)] space-y-6 pb-8">
      {/* Victory Art Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4"
      >
        {/* Banner Art */}
        <div className="w-full aspect-[16/9] relative bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-800">
          <img
            src={
              isImpostersWinner
                ? '/assets/Victory_imposters.png'
                : '/assets/Imposter_lose.png'
            }
            alt="Victory Screen"
            className="w-full h-full object-cover object-center drop-shadow-2xl"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (isImpostersWinner) {
                target.src = '/Victory_imposters.png';
              } else {
                target.src = '/Imposter_lose.png';
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-4 sm:p-5 z-20">
            <h2 className="text-2xl sm:text-3xl font-black text-white font-cairo drop-shadow-lg">
              {isImpostersWinner ? t.impostersVictorious : t.crewVictorious}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-cairo font-semibold">
              {isImpostersWinner ? t.imposterWonQuote : t.crewWonQuote}
            </p>
          </div>
        </div>

        {/* Round Summary Details */}
        <div className="p-5 space-y-4">
          {/* Audio Celebration / Replay Bar */}
          <button
            type="button"
            onClick={() => soundService.playSFX('du-bist-gut-genug.mp3')}
            className="w-full py-2.5 px-3 rounded-2xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-200 text-xs font-cairo font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
          >
            <Volume2 size={16} className="text-cyan-400 animate-pulse" />
            <span>
              {language === 'ar'
                ? '🔊 إعادة تشغيل صوت الفوز (du bist gut genug)'
                : '🔊 Replay Victory Voice (du bist gut genug)'}
            </span>
          </button>

          {/* Secret Word & Category */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 font-cairo block">
                {t.secretWordLabel}
              </span>
              <span className="text-2xl font-black text-cyan-300 font-cairo">
                {wordDisplay}
              </span>
            </div>
            <div className="text-right sm:text-start">
              <span className="text-[11px] text-slate-400 font-cairo block">
                {t.categoryLabel}
              </span>
              <span className="text-xs font-bold text-slate-200 font-cairo">
                {category.icon} {categoryName}
              </span>
            </div>
          </div>

          {/* Imposters Revealed */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-rose-400 font-cairo flex items-center gap-1">
              <Skull size={14} />
              <span>{t.impostersWere}</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {imposters.map((imp) => {
                const avatar = getAvatarById(imp.avatarId);
                return (
                  <div
                    key={imp.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-100 text-xs font-cairo font-bold"
                  >
                    <span className="text-sm">{avatar.svgIcon}</span>
                    <span>{imp.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assistant (if enabled) */}
          {assistant && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-amber-400 font-cairo flex items-center gap-1">
                <ShieldCheck size={14} />
                <span>
                  {language === 'ar' ? 'المساعد السري كان:' : 'Secret Assistant was:'}
                </span>
              </span>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-100 text-xs font-cairo font-bold w-fit">
                <span className="text-sm">{getAvatarById(assistant.avatarId).svgIcon}</span>
                <span>{assistant.name}</span>
              </div>
            </div>
          )}

          {/* Assistant Review Feature */}
          {assistant && !assistantReviewAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3"
            >
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-cairo">
                <HelpCircle size={16} />
                <span>{t.assistantReviewTitle}</span>
              </div>
              <p className="text-xs text-slate-200 font-cairo font-semibold">
                {t.assistantReviewQuestion.replace('[{NAME}]', assistant.name)}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAssistantExposedReview(true)}
                  className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-cairo font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  {t.assistantExposedYes}
                </button>
                <button
                  onClick={() => handleAssistantExposedReview(false)}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-cairo font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  {t.assistantExposedNo}
                </button>
              </div>
            </motion.div>
          )}

          {/* Assistant Exposed Notification */}
          <AnimatePresence>
            {assistantToast && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-amber-950/90 border-2 border-amber-500 text-amber-200 text-xs sm:text-sm font-cairo font-bold text-center shadow-xl space-y-1"
              >
                <div className="text-lg">🤣🚨</div>
                <p>{assistantToast}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="w-full space-y-3">
        {/* Play Again */}
        <motion.button
          id="gameover-play-again-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            soundService.playSFX('dry-fart.mp3');
            onPlayAgain();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-cairo font-black text-lg shadow-xl shadow-cyan-500/30 border border-cyan-300/40 flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw size={22} />
          <span>{t.playAgainSamePlayers}</span>
        </motion.button>

        {/* Main Menu */}
        <motion.button
          id="gameover-home-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            soundService.playSFX('piuw.mp3');
            onBackHome();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-cairo font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <Home size={18} />
          <span>{t.backToHome}</span>
        </motion.button>
      </div>
    </div>
  );
};
