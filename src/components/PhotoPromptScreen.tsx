import React from 'react';
import { motion } from 'motion/react';
import { Camera, ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { soundService } from '../services/soundService';

interface PhotoPromptScreenProps {
  language: Language;
  onTakePhoto: () => void;
  onSkipPhoto: () => void;
  roundNumber: number;
}

export const PhotoPromptScreen: React.FC<PhotoPromptScreenProps> = ({
  language,
  onTakePhoto,
  onSkipPhoto,
  roundNumber,
}) => {
  const t = translations[language];

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 relative overflow-hidden"
      >
        {/* Decorative Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Camera Icon Badge */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-600 to-blue-500 mx-auto flex items-center justify-center shadow-xl shadow-cyan-500/30 text-white border border-cyan-300/30">
          <Camera size={40} className="animate-bounce" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-100 font-cairo">
            {t.photoPromptTitle}
          </h3>
          <p className="text-sm text-slate-300 font-cairo max-w-xs mx-auto">
            {t.photoPromptSubtitle}
          </p>
          <div className="inline-block px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs text-cyan-400 font-bold">
            {t.round} #{roundNumber}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 pt-2">
          <motion.button
            id="photo-prompt-snap-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              soundService.playSFX('piuw.mp3');
              onTakePhoto();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-cairo font-black text-lg shadow-lg shadow-cyan-500/30 border border-cyan-300/40 flex items-center justify-center gap-3 transition-all"
          >
            <Camera size={22} />
            <span>{t.takePhoto}</span>
          </motion.button>

          <motion.button
            id="photo-prompt-skip-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              soundService.playSFX('piuw.mp3');
              onSkipPhoto();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-cairo font-bold text-sm border border-slate-800 transition-all"
          >
            <span>{t.skipPhoto}</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
