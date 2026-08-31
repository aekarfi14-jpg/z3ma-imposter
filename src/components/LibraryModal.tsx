import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Library,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Lock,
  EyeOff,
  Dices,
} from 'lucide-react';
import { Language } from '../types';
import { CATEGORIES, doesWordMatchCategoryHint } from '../data/words';
import { translations } from '../i18n/translations';
import { soundService } from '../services/soundService';

interface AddWordResult {
  success: boolean;
  reason?: 'MATCHES_HINT' | 'DUPLICATE' | 'INVALID';
}

interface LibraryModalProps {
  language: Language;
  onAddCustomWord: (word: string, categoryId: string) => AddWordResult;
  onClose: () => void;
  customWordsCount: number;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  language,
  onAddCustomWord,
  onClose,
  customWordsCount,
}) => {
  const t = translations[language];
  const [wordInput, setWordInput] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(CATEGORIES[0].id);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedCategory = CATEGORIES.find((c) => c.id === selectedCategoryId) || CATEGORIES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = wordInput.trim();

    if (!trimmed) {
      setErrorMessage(
        language === 'ar'
          ? 'يرجى كتابة الكلمة أولاً!'
          : 'Please enter a word first!'
      );
      return;
    }

    if (trimmed.length < 2) {
      setErrorMessage(
        language === 'ar'
          ? 'الكلمة قصيرة جداً!'
          : 'The word is too short!'
      );
      return;
    }

    // Direct check for hint match
    if (doesWordMatchCategoryHint(trimmed, selectedCategoryId)) {
      setErrorMessage(
        language === 'ar'
          ? 'الكلمة مطابقة لتلميح ما لايمكن اضافتها'
          : 'This word matches a reserved hint and cannot be added!'
      );
      return;
    }

    const result = onAddCustomWord(trimmed, selectedCategoryId);
    if (result.success) {
      soundService.playSFX('suuuuui.mp3');
      setWordInput('');
      setErrorMessage(null);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
    } else {
      if (result.reason === 'MATCHES_HINT') {
        setErrorMessage(
          language === 'ar'
            ? 'الكلمة مطابقة لتلميح ما لايمكن اضافتها'
            : 'This word matches a reserved hint and cannot be added!'
        );
      } else if (result.reason === 'DUPLICATE') {
        setErrorMessage(
          language === 'ar'
            ? 'هذه الكلمة مضافة بالفعل مسبقاً في هذه الفئة!'
            : 'This word has already been added to this category!'
        );
      } else {
        setErrorMessage(
          language === 'ar'
            ? 'تعذر إضافة الكلمة، يرجى المحاولة مجدداً.'
            : 'Failed to add word, please try again.'
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        className="w-full max-w-xl bg-slate-900 border-2 border-indigo-500/40 rounded-3xl p-5 sm:p-6 text-slate-100 shadow-2xl shadow-indigo-950/80 max-h-[92vh] flex flex-col space-y-4 relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            soundService.playSFX('piuw.mp3');
            onClose();
          }}
          className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 pt-1 shrink-0">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
            <Library size={24} />
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-cairo text-white">
            {language === 'ar' ? 'مكتبة الكلمات السرية' : 'Secret Word Library'}
          </h3>
          <p className="text-[11px] sm:text-xs text-indigo-300/80 max-w-xs mx-auto leading-relaxed">
            {language === 'ar'
              ? 'أضف كلماتك الخاصة بسرية تامة دون كشفها للآخرين'
              : 'Privately add secret words with auto-assigned 7 rotating hints'}
          </p>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto space-y-3.5 pr-1 -mr-1 pl-1 -ml-1">
          {/* Privacy & Anti-Peeking Notice */}
          <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
              <EyeOff size={16} />
            </div>
            <div className="text-[11px] leading-relaxed text-indigo-200 font-cairo">
              <span className="font-bold text-indigo-300">
                {language === 'ar' ? '🛡️ سرية تامة:' : '🛡️ Anti-Peeking:'}{' '}
              </span>
              {language === 'ar'
                ? 'الكلمات المدخلة تُخزن مشفرة ولا تظهر في أي قائمة حتى لا يقرأها أحد.'
                : 'Added words are encrypted and never shown in lists to prevent spoilers.'}
            </div>
          </div>

          {/* 7-Hints Rotating System Banner */}
          <div className="p-3 rounded-2xl bg-purple-950/50 border border-purple-500/30 flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 shrink-0">
              <Dices size={16} />
            </div>
            <div className="text-[11px] text-purple-200 font-cairo leading-relaxed">
              <span className="font-bold text-purple-300">
                {language === 'ar' ? '🎲 نظام 7 تلميحات ذكية:' : '🎲 7 Rotating Hints:'}{' '}
              </span>
              {language === 'ar'
                ? 'لكل فئة 7 تلميحات سرية مرتبطة بها تظهر للإمبوستر بالتناوب العشوائي.'
                : 'Each category has 7 hidden contextual hints randomly served to the Imposter.'}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Word Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300 font-cairo">
                {language === 'ar' ? '✏️ اكتب الكلمة السرية:' : '✏️ Enter Secret Word:'}
              </label>
              <input
                type="text"
                value={wordInput}
                onChange={(e) => {
                  setWordInput(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder={
                  language === 'ar'
                    ? 'مثال: ملف، غراء، قبعة، مقلاة...'
                    : 'e.g., File, Glue, Hat, Pan...'
                }
                maxLength={40}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3.5 py-2.5 sm:py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-cairo text-xs sm:text-sm"
              />
            </div>

            {/* Compact Category Selector (15 Categories in Elegant Micro-Grid) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 font-cairo">
                  {language === 'ar' ? '🗂️ اختر الفئة (15 فئة متوفرة):' : '🗂️ Select Category (15 available):'}
                </label>
                <span className="text-[10px] text-indigo-400 font-cairo">
                  {language === 'ar' ? 'تصميم مدمج وأنيق' : 'Compact Grid'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-44 sm:max-h-48 overflow-y-auto p-1.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        soundService.playSFX('piuw.mp3');
                        setSelectedCategoryId(cat.id);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      className={`p-2 rounded-xl border text-right rtl:text-right ltr:text-left flex items-center gap-1.5 transition-all text-xs ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600/40 to-purple-600/40 border-indigo-400 text-white shadow-md'
                          : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-base shrink-0">{cat.icon}</span>
                      <span className="font-cairo text-[11px] font-bold truncate leading-tight">
                        {language === 'ar' ? cat.nameAr : cat.nameEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Category Preview Tag */}
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs font-cairo text-slate-400">
              <span>{language === 'ar' ? 'الفئة المختارة للكلمة:' : 'Chosen Category:'}</span>
              <span className="font-bold text-indigo-300 flex items-center gap-1 bg-indigo-950/80 px-2.5 py-0.5 rounded-lg border border-indigo-500/30 text-[11px]">
                <span>{selectedCategory.icon}</span>
                <span>{language === 'ar' ? selectedCategory.nameAr : selectedCategory.nameEn}</span>
              </span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-cairo flex items-center gap-2"
              >
                <AlertCircle size={16} className="shrink-0 text-rose-400" />
                <span className="font-semibold">{errorMessage}</span>
              </motion.div>
            )}

            {/* Success Toast */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-cairo flex items-center gap-2.5 shadow-lg"
                >
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold text-emerald-300">
                      {language === 'ar' ? '✅ تم حفظ الكلمة بنجاح!' : '✅ Word added successfully!'}
                    </p>
                    <p className="text-[10px] text-emerald-300/80">
                      {language === 'ar'
                        ? 'تم إدراجها سراً في القرعة مع 7 تلميحات عشوائية تدور مع كل جولة.'
                        : 'Added secretly to game pool with 7 random rotating hints.'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold font-cairo text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle size={17} />
              <span>{language === 'ar' ? 'حفظ الكلمة سراً في اللعبة' : 'Save Secret Word to Game'}</span>
            </motion.button>
          </form>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-800 text-center flex items-center justify-between text-[11px] text-slate-500 font-cairo shrink-0">
          <span>
            {language === 'ar'
              ? `الكلمات المخصصة: ${customWordsCount}`
              : `Custom words: ${customWordsCount}`}
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Lock size={12} />
            {language === 'ar' ? 'محمية من المشاهدة' : 'Hidden from view'}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
