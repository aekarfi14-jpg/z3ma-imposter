import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, CheckCircle, XCircle, Sparkles, HelpCircle } from 'lucide-react';
import { CategoryItem, Language, Player, SecretWordItem } from '../types';
import { getAvatarById } from '../data/avatars';
import { translations } from '../i18n/translations';
import { soundService } from '../services/soundService';

interface FinalGuessScreenProps {
  language: Language;
  lastImposter: Player;
  secretWord: SecretWordItem;
  category: CategoryItem;
  onFinalGuessResult: (isCorrect: boolean) => void;
}

export const FinalGuessScreen: React.FC<FinalGuessScreenProps> = ({
  language,
  lastImposter,
  secretWord,
  category,
  onFinalGuessResult,
}) => {
  const t = translations[language];
  const [showSecretWord, setShowSecretWord] = useState(false);

  const avatar = getAvatarById(lastImposter.avatarId);
  const wordDisplay = language === 'ar' ? secretWord.word : secretWord.wordEn;
  const categoryName = language === 'ar' ? category.nameAr : category.nameEn;

  const handleCorrect = () => {
    soundService.playSFX('suuuuui.mp3');
    onFinalGuessResult(true);
  };

  const handleWrong = () => {
    soundService.playSFX('yyy_ahqVbsA.mp3');
    onFinalGuessResult(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6"
      >
        {/* Header Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-600 mx-auto flex items-center justify-center shadow-xl shadow-amber-950/60 text-slate-950 border border-amber-300/40">
          <Target size={42} />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-outfit">
            {t.finalGuessTitle}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-cairo">
            {language === 'ar'
              ? `🎯 آخر فرصة... ${lastImposter.name} خمّن الكلمة!`
              : `🎯 Last Chance... ${lastImposter.name} Guess the Word!`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-cairo max-w-xs mx-auto">
            {t.finalGuessSubtitle}
          </p>
        </div>

        {/* Imposter Avatar */}
        <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${avatar.bgGradient} flex items-center justify-center text-3xl shadow-md border border-slate-700`}
          >
            <span>{avatar.svgIcon}</span>
          </div>
          <div className="text-right sm:text-start">
            <span className="text-xs text-rose-400 font-bold block">{t.finalImposterName}</span>
            <span className="text-base font-black text-white font-cairo">{lastImposter.name}</span>
          </div>
        </div>

        {/* Secret Word Reveal Box for Players */}
        <div className="space-y-2">
          {showSecretWord ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-slate-950 border-2 border-cyan-500/50 space-y-1 text-center"
            >
              <span className="text-xs text-slate-400 font-cairo">{t.theRealWordWas}</span>
              <h3 className="text-3xl font-black text-cyan-300 font-cairo tracking-wide">
                {wordDisplay}
              </h3>
              <span className="text-xs text-slate-500 font-cairo block">
                {category.icon} {categoryName}
              </span>
            </motion.div>
          ) : (
            <button
              onClick={() => {
                soundService.playSFX('piuw.mp3');
                setShowSecretWord(true);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold font-cairo border border-slate-700 transition-all flex items-center justify-center gap-1.5 mx-auto"
            >
              <HelpCircle size={15} className="text-cyan-400" />
              <span>{language === 'ar' ? '👀 إظهار الكلمة للتأكد من التخمين' : '👀 Show Word to Verify'}</span>
            </button>
          )}
        </div>

        {/* Result Action Buttons */}
        <div className="space-y-3 pt-2">
          <p className="text-xs font-bold text-slate-400 font-cairo">
            {t.guessQuestion}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Correct */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCorrect}
              className="py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-cairo font-black text-sm sm:text-base shadow-xl shadow-emerald-600/30 border border-emerald-400/40 flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle size={20} />
              <span>{t.guessCorrect}</span>
            </motion.button>

            {/* Wrong */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleWrong}
              className="py-4 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-cairo font-black text-sm sm:text-base shadow-xl shadow-rose-600/30 border border-rose-400/40 flex items-center justify-center gap-2 transition-all"
            >
              <XCircle size={20} />
              <span>{t.guessWrong}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
