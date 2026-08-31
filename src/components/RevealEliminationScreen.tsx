import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Skull, UserCheck, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { Language, Player } from '../types';
import { getAvatarById } from '../data/avatars';
import { translations } from '../i18n/translations';
import { soundService } from '../services/soundService';

interface RevealEliminationScreenProps {
  language: Language;
  suspectPlayer: Player;
  remainingImposterCount: number;
  onImpostersWin: () => void;
  onNextVote: () => void;
  onFinalGuess: () => void;
}

export const RevealEliminationScreen: React.FC<RevealEliminationScreenProps> = ({
  language,
  suspectPlayer,
  remainingImposterCount,
  onImpostersWin,
  onNextVote,
  onFinalGuess,
}) => {
  const t = translations[language];
  const [isRevealed, setIsRevealed] = useState(false);

  const avatar = getAvatarById(suspectPlayer.avatarId);
  const isImposter = suspectPlayer.isImposter;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
      if (isImposter) {
        soundService.playSFX('get-out-tuco.mp3');
      } else {
        soundService.playSFX('faaah.mp3');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [isImposter]);

  return (
    <div className="w-full max-w-lg mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 overflow-hidden relative"
      >
        <div className="space-y-1">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-widest font-outfit">
            {t.revealTitle}
          </span>
          <h2 className="text-3xl font-black text-white font-cairo">
            {suspectPlayer.name}
          </h2>
        </div>

        {/* Suspect Avatar Dramatic Box */}
        <div className="py-2">
          <div
            className={`w-32 h-32 rounded-3xl bg-gradient-to-tr ${avatar.bgGradient} mx-auto flex items-center justify-center text-7xl shadow-2xl border-4 ${
              isRevealed
                ? isImposter
                  ? 'border-rose-500 shadow-rose-950/80 animate-bounce'
                  : 'border-cyan-500 shadow-cyan-950/80'
                : 'border-slate-700 animate-pulse'
            } transition-all duration-700`}
          >
            <span>{avatar.svgIcon}</span>
          </div>
        </div>

        {/* Identity Result Banner */}
        {isRevealed ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border-2 space-y-2 ${
              isImposter
                ? 'bg-rose-950/80 border-rose-500 text-rose-100 shadow-lg shadow-rose-950'
                : 'bg-cyan-950/80 border-cyan-500 text-cyan-100 shadow-lg shadow-cyan-950'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {isImposter ? <Skull size={24} className="text-rose-400" /> : <UserCheck size={24} className="text-cyan-400" />}
              <h3 className="text-xl font-black font-cairo">
                {isImposter ? t.heWasImposter : t.heWasInnocent}
              </h3>
            </div>
            <p className="text-xs font-cairo text-slate-300">
              {isImposter
                ? remainingImposterCount > 0
                  ? t.imposterCaughtProceed
                  : t.allImpostersCaught
                : t.impostersWinImmediate}
            </p>
          </motion.div>
        ) : (
          <div className="py-4 text-cyan-400 font-bold text-sm font-cairo flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span>{language === 'ar' ? 'جارٍ كشف الهوية الحقيقية...' : 'Revealing true identity...'}</span>
          </div>
        )}

        {/* Actions based on result */}
        {isRevealed && (
          <div className="space-y-3 pt-2">
            {!isImposter ? (
              /* Innocent eliminated -> Imposters win! */
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  soundService.playSFX('piuw.mp3');
                  onImpostersWin();
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-cairo font-black text-lg shadow-xl shadow-rose-600/30 border border-rose-400/40 flex items-center justify-center gap-2 transition-all"
              >
                <span>{language === 'ar' ? '💀 إعلان فوز الـ IMPOSTERS' : '💀 Imposters Win'}</span>
                <ArrowRight size={20} />
              </motion.button>
            ) : remainingImposterCount > 0 ? (
              /* More Imposters remain */
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  soundService.playSFX('piuw.mp3');
                  onNextVote();
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-cairo font-black text-lg shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{t.continueNextVote}</span>
                <ArrowRight size={20} />
              </motion.button>
            ) : (
              /* All Imposters caught -> Final Guess */
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  soundService.playSFX('piuw.mp3');
                  onFinalGuess();
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-cairo font-black text-lg shadow-xl shadow-cyan-500/30 border border-cyan-300/40 transition-all flex items-center justify-center gap-2"
              >
                <span>{t.goToFinalGuess}</span>
                <ArrowRight size={20} />
              </motion.button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
