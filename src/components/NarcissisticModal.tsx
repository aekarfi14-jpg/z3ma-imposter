import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Crown, Sparkles, X, Heart, Flame } from 'lucide-react';
import { Language } from '../types';
import { NARCISSISTIC_QUOTES, NARCISSISTIC_QUOTES_EN } from '../data/quotes';
import { translations } from '../i18n/translations';
import { soundService } from '../services/soundService';

interface NarcissisticModalProps {
  language: Language;
  onClose: () => void;
}

export const NarcissisticModal: React.FC<NarcissisticModalProps> = ({
  language,
  onClose,
}) => {
  const t = translations[language];
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = language === 'ar' ? NARCISSISTIC_QUOTES : NARCISSISTIC_QUOTES_EN;
  const currentQuote = quotes[quoteIndex % quotes.length];

  const handleNextQuote = () => {
    soundService.playSFX('suuuuui.mp3');
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, rotate: -3, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="w-full max-w-md bg-gradient-to-b from-slate-900 via-amber-950/30 to-slate-950 border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl shadow-amber-950/80 text-center space-y-5 relative overflow-hidden"
      >
        {/* Decorative Top Sunburst Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close icon */}
        <button
          onClick={() => {
            soundService.playSFX('piuw.mp3');
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Crown & Avatar Badge */}
        <div className="pt-2">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 mx-auto flex items-center justify-center text-5xl shadow-2xl shadow-amber-950 border-4 border-amber-300 relative group animate-bounce">
            <span>👑</span>
            <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-slate-950 border border-amber-400 text-[10px] font-black text-amber-300 font-outfit">
              LE CHIKOR
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 font-cairo">
            {language === 'ar' ? 'يونس الشيكور 👑' : 'Younes Le Chikor 👑'}
          </h3>
          <p className="text-xs text-amber-400/80 font-bold uppercase tracking-widest font-outfit flex items-center justify-center gap-1">
            <Sparkles size={13} />
            <span>{language === 'ar' ? 'المبتكر الأسطوري' : 'Mastermind Creator'}</span>
            <Sparkles size={13} />
          </p>
        </div>

        {/* Hilarious Narcissistic Quote Box */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-amber-100 text-xs sm:text-sm font-cairo font-semibold leading-relaxed shadow-inner">
          <p>"{currentQuote}"</p>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleNextQuote}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold font-cairo text-xs border border-amber-500/40 flex items-center justify-center gap-1.5 transition-all"
          >
            <Flame size={15} className="text-amber-400" />
            <span>{language === 'ar' ? 'جرعة نرجسية إضافية 🔥' : 'More Narcissism 🔥'}</span>
          </button>

          <button
            onClick={() => {
              soundService.playSFX('piuw.mp3');
              onClose();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-cairo font-black text-sm shadow-lg shadow-amber-500/20 transition-all"
          >
            {t.closeEasterEgg}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
