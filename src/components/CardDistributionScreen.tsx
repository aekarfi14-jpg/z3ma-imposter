import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Lock, ShieldAlert, Sparkles, UserCheck, AlertTriangle, ArrowRight } from 'lucide-react';
import { CategoryItem, Language, Player, SecretWordItem } from '../types';
import { getAvatarById } from '../data/avatars';
import { translations } from '../i18n/translations';
import { soundService } from '../services/soundService';

interface CardDistributionScreenProps {
  language: Language;
  players: Player[];
  secretWord: SecretWordItem;
  category: CategoryItem;
  assignedHint: string | null;
  assistantPlayer: Player | null;
  assistantEnabled?: boolean;
  imposterPlayers: Player[];
  onFinishDistribution: () => void;
}

type CardState = 'PROMPT_PASS' | 'PRIVACY_CHECK' | 'CARD_REVEALED' | 'CARD_HIDDEN';

export const CardDistributionScreen: React.FC<CardDistributionScreenProps> = ({
  language,
  players,
  secretWord,
  category,
  assignedHint,
  assistantPlayer,
  assistantEnabled = false,
  imposterPlayers,
  onFinishDistribution,
}) => {
  const t = translations[language];
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [cardState, setCardState] = useState<CardState>('PROMPT_PASS');
  const [autoHideTimer, setAutoHideTimer] = useState<number>(12);

  const currentPlayer = players[currentPlayerIndex];
  const avatar = getAvatarById(currentPlayer?.avatarId || 'wolf');

  const isImposter = currentPlayer?.isImposter;
  const isAssistant = currentPlayer?.isAssistant;
  const isInnocent = !isImposter && !isAssistant;

  // Auto-hide countdown when card is revealed (12 seconds)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (cardState === 'CARD_REVEALED') {
      setAutoHideTimer(12);
      interval = setInterval(() => {
        setAutoHideTimer((prev) => {
          if (prev <= 1) {
            handleHideCard();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cardState]);

  const handleStartReveal = () => {
    soundService.playSFX('piuw.mp3');
    setCardState('PRIVACY_CHECK');
  };

  const handleConfirmPrivacyAndReveal = () => {
    // Unified sound for everyone to avoid exposing imposters
    soundService.playSFX('piuw.mp3');
    setCardState('CARD_REVEALED');
  };

  const handleHideCard = () => {
    soundService.playSFX('piuw.mp3');
    setCardState('CARD_HIDDEN');
  };

  const handleProceedToNextPlayer = () => {
    soundService.playSFX('piuw.mp3');
    if (currentPlayerIndex + 1 < players.length) {
      setCurrentPlayerIndex((prev) => prev + 1);
      setCardState('PROMPT_PASS');
    } else {
      // All cards distributed!
      soundService.playSFX('get-out-tuco.mp3');
      onFinishDistribution();
    }
  };

  const categoryName = language === 'ar' ? category.nameAr : category.nameEn;
  const wordDisplay = language === 'ar' ? secretWord.word : secretWord.wordEn;

  return (
    <div className="w-full max-w-lg mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] space-y-6">
      {/* Progress Bar Header */}
      <div className="w-full bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <UserCheck size={18} className="text-cyan-400" />
          <span className="text-xs font-bold text-slate-300 font-cairo">
            {language === 'ar' ? 'توزيع البطاقات السرية' : 'Secret Cards Dealing'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-outfit text-xs font-black text-cyan-400">
          <span>{currentPlayerIndex + 1}</span>
          <span className="text-slate-600">/</span>
          <span>{players.length}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Handshake & Pass Phone */}
        {cardState === 'PROMPT_PASS' && (
          <motion.div
            key="prompt_pass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6"
          >
            <div className="space-y-2">
              <span className="text-xs font-black tracking-widest text-cyan-400 uppercase font-outfit">
                {t.passPhoneTo}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-cairo">
                {currentPlayer.name}
              </h2>
            </div>

            {/* Avatar Visual */}
            <div className="py-4">
              <div
                className={`w-28 h-28 rounded-3xl bg-gradient-to-tr ${avatar.bgGradient} mx-auto flex items-center justify-center text-6xl shadow-2xl shadow-cyan-950/80 border-4 border-slate-700`}
              >
                <span>{avatar.svgIcon}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 font-cairo max-w-xs mx-auto">
              {language === 'ar'
                ? `سلّم الهاتف إلى [${currentPlayer.name}] ليشاهد بطاقته بمفرده في سرية تامة!`
                : `Hand the phone to [${currentPlayer.name}] to secretly view their card!`}
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStartReveal}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-cairo font-black text-lg shadow-xl shadow-cyan-500/30 border border-cyan-300/40 flex items-center justify-center gap-2 transition-all"
            >
              <Eye size={22} />
              <span>{t.seeMyCard}</span>
            </motion.button>
          </motion.div>
        )}

        {/* STEP 2: Privacy Check Confirmation */}
        {cardState === 'PRIVACY_CHECK' && (
          <motion.div
            key="privacy_check"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/40 mx-auto flex items-center justify-center shadow-lg">
              <AlertTriangle size={42} className="animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-amber-200 font-cairo">
                {language === 'ar' ? 'يا ' + currentPlayer.name + '!' : 'Hey ' + currentPlayer.name + '!'}
              </h3>
              <p className="text-sm sm:text-base text-slate-200 font-cairo font-bold leading-relaxed max-w-xs mx-auto">
                {t.makeSureAlone}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleConfirmPrivacyAndReveal}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-cairo font-black text-lg shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Lock size={20} />
              <span>{t.tapToReveal}</span>
            </motion.button>
          </motion.div>
        )}

        {/* STEP 3: 3D Card Revealed */}
        {cardState === 'CARD_REVEALED' && (
          <motion.div
            key="card_revealed"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full space-y-4"
          >
            {/* The Main Identity Card */}
            <div
              className={`w-full rounded-3xl p-6 shadow-2xl border-2 space-y-5 text-center relative overflow-hidden ${
                isImposter
                  ? 'bg-gradient-to-b from-slate-900 via-rose-950/60 to-slate-950 border-rose-500/60 shadow-rose-950/80'
                  : isAssistant
                  ? 'bg-gradient-to-b from-slate-900 via-amber-950/60 to-slate-950 border-amber-500/60 shadow-amber-950/80'
                  : 'bg-gradient-to-b from-slate-900 via-cyan-950/60 to-slate-950 border-cyan-500/60 shadow-cyan-950/80'
              }`}
            >
              {/* Card Image Banner */}
              <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 relative shadow-inner">
                <img
                  src={
                    isImposter
                      ? '/assets/Imposter.jpg'
                      : isAssistant
                      ? '/assets/Assistant.jpg'
                      : '/assets/Man.jpg'
                  }
                  alt="Role Card"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = isImposter
                      ? '/assets/Imposter.jpg'
                      : '/assets/Man.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end justify-center p-2">
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-black tracking-wider uppercase font-cairo shadow-md ${
                      isImposter
                        ? 'bg-rose-600 text-white'
                        : isAssistant
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-cyan-500 text-slate-950'
                    }`}
                  >
                    {isImposter
                      ? t.youAreImposter
                      : isAssistant
                      ? t.youAreAssistant
                      : t.youAreInnocent}
                  </span>
                </div>
              </div>

              {/* Secret Information Display */}
              {isImposter ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-rose-200">
                    <p className="text-xs font-semibold leading-relaxed font-cairo">
                      {t.imposterSecretGoal}
                    </p>
                  </div>

                  {/* Category */}
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-300 font-cairo">
                    <span className="text-slate-500">{t.categoryLabel}</span>
                    <span className="font-bold text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      {category.icon} {categoryName}
                    </span>
                  </div>

                  {/* Single Hint (if enabled) */}
                  {assignedHint && (
                    <div className="p-3 rounded-2xl bg-yellow-950/60 border border-yellow-500/40 text-yellow-200 text-right sm:text-center space-y-1">
                      <div className="text-[11px] font-bold text-yellow-400 flex items-center justify-center gap-1 font-cairo">
                        <Sparkles size={13} />
                        <span>{t.singleHintLabel}</span>
                      </div>
                      <p className="text-xs font-cairo font-semibold leading-relaxed">
                        "{assignedHint}"
                      </p>
                    </div>
                  )}

                  {/* Secret Assistant Identity (ONLY if assistant setting is enabled) */}
                  {assistantEnabled && assistantPlayer && (
                    <div className="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs font-cairo">
                      <span className="text-amber-400 font-bold">{t.yourAssistantIs} </span>
                      <span className="font-black text-amber-100 underline decoration-amber-400">
                        {assistantPlayer.name}
                      </span>
                    </div>
                  )}
                </div>
              ) : isAssistant ? (
                <div className="space-y-3">
                  {/* Category & Secret Word */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-1">
                    <span className="text-xs text-slate-400 font-cairo">{t.secretWordIs}</span>
                    <h3 className="text-3xl font-black text-amber-300 font-cairo tracking-wide">
                      {wordDisplay}
                    </h3>
                    <span className="text-xs text-slate-400 font-cairo block pt-1">
                      {category.icon} {categoryName}
                    </span>
                  </div>

                  {/* Target Imposter */}
                  <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs font-cairo">
                    <span className="font-bold text-rose-400">{t.targetImposter} </span>
                    <span className="font-black text-rose-100">
                      {imposterPlayers.map((p) => p.name).join(', ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-300/80 font-cairo leading-relaxed">
                    {t.assistantDescReveal}
                  </p>
                </div>
              ) : (
                /* Innocent Player */
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-1">
                    <span className="text-xs text-slate-400 font-cairo">{t.secretWordIs}</span>
                    <h3 className="text-3xl font-black text-cyan-300 font-cairo tracking-wide">
                      {wordDisplay}
                    </h3>
                    <span className="text-xs text-slate-400 font-cairo block pt-1">
                      {category.icon} {categoryName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-cairo">
                    {language === 'ar'
                      ? 'اطرح أسئلة ذكية لا تكشف الكلمة للـ Imposter!'
                      : 'Ask subtle questions that don\'t give the word away!'}
                  </p>
                </div>
              )}

              {/* Auto-Hide Countdown Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-cairo">
                  <span>{t.autoHideIn}</span>
                  <span className="font-bold text-cyan-400 font-outfit">
                    {autoHideTimer} {t.seconds}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    className="h-full bg-cyan-400"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 12, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>

            {/* Manual Hide Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleHideCard}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-cairo font-bold text-base border border-slate-700 flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <EyeOff size={20} />
              <span>{t.hideMyCard}</span>
            </motion.button>
          </motion.div>
        )}

        {/* STEP 4: Card Hidden Confirmation */}
        {cardState === 'CARD_HIDDEN' && (
          <motion.div
            key="card_hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-lg">
              <Lock size={38} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white font-cairo">
                {t.cardHiddenPrompt}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-cairo max-w-xs mx-auto">
                {currentPlayerIndex + 1 < players.length
                  ? language === 'ar'
                    ? `اضغط على التالي وسلّم الهاتف للاعب التالي [${players[currentPlayerIndex + 1].name}]!`
                    : `Tap next and hand the phone to [${players[currentPlayerIndex + 1].name}]!`
                  : language === 'ar'
                  ? 'رائع! الجميع شاهدوا بطاقاتهم، حان وقت مرحلة الاستجواب!'
                  : 'All players have seen their cards! Ready for the investigation!'}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleProceedToNextPlayer}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-cairo font-black text-lg shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>
                {currentPlayerIndex + 1 < players.length
                  ? language === 'ar'
                    ? `التالي: ${players[currentPlayerIndex + 1].name}`
                    : `Next: ${players[currentPlayerIndex + 1].name}`
                  : language === 'ar'
                  ? '🚀 بدء الاستجواب الآن'
                  : '🚀 Start Investigation'}
              </span>
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
