import React from 'react';
import { motion } from 'motion/react';
import { Play, Images, Settings2, BookOpen, Crown, Sparkles, ShieldAlert, Library, Music, Volume2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { soundService } from '../services/soundService';

interface HomeScreenProps {
  language: Language;
  onStartGame: () => void;
  onOpenAlbum: () => void;
  onOpenRules: () => void;
  onOpenLibrary: () => void;
  onOpenEasterEgg: () => void;
  onOpenMusicMenu: () => void;
  roundNumber: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  language,
  onStartGame,
  onOpenAlbum,
  onOpenRules,
  onOpenLibrary,
  onOpenEasterEgg,
  onOpenMusicMenu,
  roundNumber,
}) => {
  const t = translations[language];

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-between min-h-[calc(100vh-4rem)] p-4 pb-8 space-y-6">
      {/* Hero Visual Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full relative group"
      >
        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border-2 border-cyan-500/30 bg-slate-900 shadow-2xl shadow-cyan-950/50">
          <img
            src="/assets/Main.jpg"
            alt="Z3MA IMPOSTER"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/Main.jpg';
            }}
          />

          {/* Floating Music Button on Hero - No SFX (Req 14) */}
          <button
            id="home-music-quick-btn"
            type="button"
            onClick={onOpenMusicMenu}
            className="absolute top-3 left-3 bg-slate-950/80 hover:bg-slate-900 text-cyan-300 border border-cyan-500/40 p-2.5 rounded-2xl backdrop-blur-md shadow-lg flex items-center gap-1.5 transition-all active:scale-95 z-10"
            title={t.musicMenuTitle}
          >
            <Music size={16} className="animate-pulse" />
            <span className="text-xs font-bold font-cairo hidden sm:inline">{t.musicMenuTitle}</span>
          </button>

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-5">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-rose-500/80 text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-1 shadow-md whitespace-nowrap">
                <ShieldAlert size={13} />
                IMPOSTER GAME
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-cyan-300 text-[11px] font-bold border border-cyan-500/30 whitespace-nowrap">
                1 PHONE • 3-50 PLAYERS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-cairo tracking-wide drop-shadow-md truncate">
              Z3MA IMPOSTER
            </h2>
            <p className="text-xs sm:text-sm text-cyan-200/90 font-medium break-words">
              {language === 'ar'
                ? 'الشك راه يدور في القعدة... شكون راه يكذب وشكون هو الشيكور؟ 😈'
                : 'Deception & suspense around the room... who is faking it? 😈'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Primary Action Buttons */}
      <div className="w-full space-y-3">
        {/* Play Button */}
        <motion.button
          id="home-start-game-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            soundService.playSFX('dry-fart.mp3');
            onStartGame();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-cairo font-black text-lg sm:text-xl shadow-lg shadow-cyan-500/30 border border-cyan-300/40 flex items-center justify-center gap-3 transition-all relative overflow-hidden group"
        >
          <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
          <Play size={24} className="fill-current text-white flex-shrink-0" />
          <span className="truncate">{t.startGame}</span>
        </motion.button>

        {/* Secondary Buttons Grid: Library, Album, Rules */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Library Button */}
          <motion.button
            id="home-library-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              soundService.playSFX('piuw.mp3');
              onOpenLibrary();
            }}
            className="py-3 px-2 sm:px-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-indigo-500/40 hover:border-indigo-500/70 text-slate-100 font-cairo font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 shadow-md transition-all group"
          >
            <Library size={18} className="text-indigo-400 group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="truncate">{t.library}</span>
          </motion.button>

          {/* Album */}
          <motion.button
            id="home-album-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              soundService.playSFX('piuw.mp3');
              onOpenAlbum();
            }}
            className="py-3 px-2 sm:px-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 text-slate-100 font-cairo font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 shadow-md transition-all group"
          >
            <Images size={18} className="text-amber-400 group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="truncate">{t.album}</span>
          </motion.button>

          {/* Quick Rules */}
          <motion.button
            id="home-rules-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              soundService.playSFX('piuw.mp3');
              onOpenRules();
            }}
            className="py-3 px-2 sm:px-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/40 text-slate-100 font-cairo font-bold text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 shadow-md transition-all group"
          >
            <BookOpen size={18} className="text-cyan-400 group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="truncate">{t.quickRules}</span>
          </motion.button>
        </div>
      </div>

      {/* Narcissistic Creator Icon & Footer */}
      <div className="w-full flex flex-col items-center justify-center pt-2 border-t border-slate-800/60">
        <motion.button
          id="home-easter-egg-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            soundService.playSFX('n-ldhy-smtny-my-hydr.mp3');
            onOpenEasterEgg();
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 text-amber-300 shadow-md shadow-amber-950/30 transition-all group"
          title="Creator Easter Egg"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-inner">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-[11px]">
              👑
            </div>
          </div>
          <span className="text-[12px] font-bold font-cairo group-hover:text-amber-200 truncate">
            {t.creatorCredit}
          </span>
          <Sparkles size={13} className="text-amber-400 animate-spin flex-shrink-0" />
        </motion.button>
        <span className="text-[10px] text-slate-500 mt-2">
          v1.0.0 • Offline Ready • Single Device Party Game
        </span>
      </div>
    </div>
  );
};
