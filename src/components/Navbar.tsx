import React from 'react';
import { Volume2, VolumeX, BookOpen, Globe, Music } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { soundService } from '../services/soundService';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenRules: () => void;
  isMusicMuted: boolean;
  onToggleMusic: () => void;
  onOpenMusicMenu?: () => void;
  roundNumber?: number;
  showBackHome?: boolean;
  onBackHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onOpenRules,
  isMusicMuted,
  onToggleMusic,
  onOpenMusicMenu,
  roundNumber,
  showBackHome,
  onBackHome,
}) => {
  const t = translations[language];

  const handleLanguageToggle = () => {
    // Custom harmonic AI-generated chime for language switch (Req 4)
    soundService.playLanguageSwitchSound();
    onLanguageChange(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 px-3 py-2.5 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left Side: Brand Logo & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          {showBackHome && onBackHome ? (
            <button
              id="nav-back-button"
              onClick={() => {
                soundService.playSFX('piuw.mp3');
                onBackHome();
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 transition-all border border-slate-700 flex-shrink-0"
              title="Home"
            >
              <span className="text-sm font-bold px-1.5">🏠</span>
            </button>
          ) : (
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md shadow-cyan-500/20 border border-cyan-500/40 bg-slate-950 flex items-center justify-center flex-shrink-0">
              <img
                src="/assets/Icon.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/Icon.jpg';
                }}
              />
            </div>
          )}

          <div className="min-w-0 truncate">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 font-outfit truncate">
                Z3MA IMPOSTER
              </h1>
              {roundNumber !== undefined && (
                <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
                  {t.round} #{roundNumber}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block truncate">
              {t.tagline} • <span className="text-emerald-400 font-semibold">{t.offlineBadge}</span>
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Music Menu / Toggle - No SFX on music controls (Req 14) */}
          <button
            id="nav-music-toggle"
            onClick={() => {
              if (onOpenMusicMenu) {
                onOpenMusicMenu();
              } else {
                onToggleMusic();
              }
            }}
            className={`p-2 rounded-xl border transition-all active:scale-95 flex items-center justify-center ${
              isMusicMuted
                ? 'bg-slate-800/80 border-slate-700 text-slate-500'
                : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300 shadow-sm shadow-indigo-500/20'
            }`}
            title="Music Menu"
          >
            {isMusicMuted ? <VolumeX size={17} /> : <Music size={17} className="animate-pulse" />}
          </button>

          {/* Rules Modal Button */}
          <button
            id="nav-rules-button"
            onClick={() => {
              soundService.playSFX('piuw.mp3');
              onOpenRules();
            }}
            className="p-2 rounded-xl bg-slate-800/90 border border-slate-700 hover:bg-slate-700 text-slate-200 transition-all active:scale-95 flex items-center gap-1 text-xs font-semibold"
            title="Rules"
          >
            <BookOpen size={16} className="text-amber-400" />
            <span className="hidden md:inline">{t.quickRules}</span>
          </button>

          {/* Language Switcher */}
          <button
            id="nav-language-toggle"
            onClick={handleLanguageToggle}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 hover:bg-slate-700 text-slate-100 transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold font-cairo"
            title="Change Language"
          >
            <Globe size={15} className="text-cyan-400" />
            <span>{language === 'ar' ? '🇩🇿 دزيرية' : '🇬🇧 EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
