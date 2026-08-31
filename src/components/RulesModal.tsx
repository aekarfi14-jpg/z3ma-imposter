import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, X, CheckCircle2, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { soundService } from '../services/soundService';

interface RulesModalProps {
  language: Language;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ language, onClose }) => {
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-amber-400" />
            <h3 className="font-bold text-lg text-slate-100 font-cairo">
              {t.rulesTitle}
            </h3>
          </div>
          <button
            onClick={() => {
              soundService.playSFX('piuw.mp3');
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Rules Sections */}
        <div className="space-y-4 text-xs sm:text-sm font-cairo">
          {/* Rule 1 */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-cyan-400 flex items-center gap-1.5">
              <CheckCircle2 size={16} />
              <span>{t.rule1Title}</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              {t.rule1Body}
            </p>
          </div>

          {/* Rule 2 */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
              <CheckCircle2 size={16} />
              <span>{t.rule2Title}</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              {t.rule2Body}
            </p>
          </div>

          {/* Rule 3 */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-rose-400 flex items-center gap-1.5">
              <CheckCircle2 size={16} />
              <span>{t.rule3Title}</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              {t.rule3Body}
            </p>
          </div>

          {/* Rule 4 */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={16} />
              <span>{t.rule4Title}</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              {t.rule4Body}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            soundService.playSFX('piuw.mp3');
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-cairo font-black text-sm shadow-md transition-all"
        >
          {t.closeRules}
        </button>
      </motion.div>
    </div>
  );
};
