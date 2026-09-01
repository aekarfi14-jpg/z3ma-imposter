import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Music,
  Play,
  Pause,
  Check,
  X,
  Disc3,
  BellRing,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { soundService } from '../services/soundService';
import { storageService } from '../services/storageService';

interface MusicMenuModalProps {
  language: Language;
  isOpen?: boolean;
  currentTrack?: string;
  musicVolume?: number;
  sfxVolume?: number;
  isMuted?: boolean;
  onClose: () => void;
  onSelectTrack?: (track: string) => void;
  onChangeMusicVolume?: (vol: number) => void;
  onChangeSfxVolume?: (vol: number) => void;
  onToggleMute?: () => void;
  onTrackChanged?: (track: string) => void;
}

export const MusicMenuModal: React.FC<MusicMenuModalProps> = ({
  language,
  isOpen = true,
  currentTrack: propCurrentTrack,
  musicVolume: propMusicVolume,
  sfxVolume: propSfxVolume,
  isMuted: propIsMuted,
  onClose,
  onSelectTrack,
  onChangeMusicVolume,
  onChangeSfxVolume,
  onToggleMute,
  onTrackChanged,
}) => {
  const t = translations[language];

  // Local state initialized from props or soundService
  const [selectedTrack, setSelectedTrack] = useState<string>(
    propCurrentTrack || soundService.getCurrentTrack()
  );
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(
    propIsMuted !== undefined ? propIsMuted : soundService.getIsMusicMuted()
  );
  const [musicVol, setMusicVol] = useState<number>(
    propMusicVolume !== undefined ? propMusicVolume : soundService.getMusicVolume()
  );
  const [sfxVol, setSfxVol] = useState<number>(
    propSfxVolume !== undefined ? propSfxVolume : soundService.getSFXVolume()
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(soundService.isMusicPlaying());

  useEffect(() => {
    if (propCurrentTrack) setSelectedTrack(propCurrentTrack);
    if (propIsMuted !== undefined) setIsMusicMuted(propIsMuted);
    if (propMusicVolume !== undefined) setMusicVol(propMusicVolume);
    if (propSfxVolume !== undefined) setSfxVol(propSfxVolume);
    setIsPlaying(soundService.isMusicPlaying());
  }, [propCurrentTrack, propIsMuted, propMusicVolume, propSfxVolume]);

  const tracks = [
    {
      id: 'Msic00.mp3',
      label: t.track1 || (language === 'ar' ? 'الموسيقى الكلاسيكية 01' : 'Track 1 (Classic)'),
      desc: language === 'ar' ? 'غموض وتشويق كلاسيكي هادئ' : 'Classic suspense & subtle mystery',
      tag: 'Classic',
    },
    {
      id: 'msic01.mp3',
      label: t.track2 || (language === 'ar' ? 'موسيقى التوتر والنبض 02' : 'Track 2 (Tension)'),
      desc: language === 'ar' ? 'إيقاع سريع وتوتر تصاعدي حابس للأنفاس' : 'Fast-paced rhythmic pulse',
      tag: 'Tense',
    },
    {
      id: 'msic02.mp3',
      label: t.track3 || (language === 'ar' ? 'موسيقى الحسم والدراما 03' : 'Track 3 (Dramatic)'),
      desc: language === 'ar' ? 'دراما وحسم سينمائي للجولات الحاسمة' : 'Cinematic climax & intense drama',
      tag: 'Climax',
    },
  ];

  // Instant real-time track selection and audio switch
  const handleSelectTrack = (trackId: string) => {
    setSelectedTrack(trackId);
    setIsMusicMuted(false);
    setIsPlaying(true);
    storageService.saveSettings({ currentTrack: trackId });
    if (onSelectTrack) {
      onSelectTrack(trackId);
    } else {
      soundService.setMusicMuted(false);
      soundService.playMusic(trackId);
    }
    if (onTrackChanged) onTrackChanged(trackId);
  };

  // Instant real-time play/pause
  const handleTogglePlayPause = () => {
    if (isPlaying) {
      soundService.stopMusic();
      setIsPlaying(false);
    } else {
      soundService.setMusicMuted(false);
      setIsMusicMuted(false);
      soundService.playMusic(selectedTrack);
      setIsPlaying(true);
    }
  };

  // Instant real-time mute
  const handleToggleMute = () => {
    const newMuted = soundService.toggleMusicMute();
    setIsMusicMuted(newMuted);
    if (onToggleMute) onToggleMute();
  };

  // Instant real-time music volume change
  const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMusicVol(val);
    soundService.setMusicVolume(val);
    if (isMusicMuted && val > 0) {
      soundService.setMusicMuted(false);
      setIsMusicMuted(false);
    }
    storageService.saveSettings({ musicVolume: val });
    if (onChangeMusicVolume) onChangeMusicVolume(val);
  };

  // Instant real-time SFX volume change
  const handleSfxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSfxVol(val);
    soundService.setSFXVolume(val);
    storageService.saveSettings({ sfxVolume: val });
    if (onChangeSfxVolume) onChangeSfxVolume(val);
  };

  const handleTestSFX = () => {
    soundService.playSFX('piuw.mp3');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 relative my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/90 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-950/50">
                <Disc3 size={22} className={isPlaying ? 'animate-spin' : ''} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white font-cairo">
                  {t.musicMenuTitle || (language === 'ar' ? 'إعدادات الموسيقى والصوت' : 'Audio & Music Controls')}
                </h3>
                <p className="text-xs text-emerald-400 font-cairo flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {language === 'ar' ? 'تعديل فوري ومباشر' : 'Live Real-time Active'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close music menu"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors active:scale-95"
            >
              <X size={20} />
            </button>
          </div>

          {/* Master Volume Sliders Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Music Volume Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-cairo">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  {isMusicMuted || musicVol === 0 ? (
                    <VolumeX size={16} className="text-rose-400" />
                  ) : (
                    <Volume2 size={16} className="text-cyan-400" />
                  )}
                  <span>{t.musicVolume || (language === 'ar' ? 'مستوى الموسيقى' : 'Music Volume')}</span>
                </span>
                <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-900/50">
                  {isMusicMuted ? '0%' : `${Math.round(musicVol * 100)}%`}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className={`p-2.5 rounded-xl border transition-all active:scale-95 shrink-0 ${
                    isMusicMuted
                      ? 'bg-rose-950/60 border-rose-500/60 text-rose-400 shadow-sm shadow-rose-950'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title={isMusicMuted ? 'Unmute Music' : 'Mute Music'}
                >
                  {isMusicMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={isMusicMuted ? 0 : musicVol}
                  onChange={handleMusicVolumeChange}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            {/* SFX Volume Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-cairo">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <BellRing size={16} className="text-amber-400" />
                  <span>{language === 'ar' ? 'المؤثرات الصوتية' : 'Sound Effects'}</span>
                </span>
                <span className="font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-900/50">
                  {`${Math.round(sfxVol * 100)}%`}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleTestSFX}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 text-[11px] font-cairo font-bold transition-all active:scale-95 shrink-0"
                  title="Test Sound"
                >
                  {language === 'ar' ? 'تجربة 🔔' : 'Test 🔔'}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={sfxVol}
                  onChange={handleSfxVolumeChange}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Playlist Track Selection List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-300 font-cairo flex items-center gap-1.5">
                <Music size={14} className="text-indigo-400" />
                <span>{t.chooseTrack || (language === 'ar' ? 'اختر الموسيقى الخلفية:' : 'Select Background Music:')}</span>
              </span>
              <span className="text-[11px] text-slate-400 font-cairo">
                {tracks.length} {language === 'ar' ? 'مقاطع متوفرة' : 'tracks'}
              </span>
            </div>

            <div className="space-y-2">
              {tracks.map((trk) => {
                const isCurrent = selectedTrack.toLowerCase() === trk.id.toLowerCase();
                return (
                  <button
                    key={trk.id}
                    type="button"
                    onClick={() => handleSelectTrack(trk.id)}
                    className={`w-full p-3.5 rounded-2xl border text-start flex items-center justify-between transition-all active:scale-[0.99] ${
                      isCurrent
                        ? 'bg-gradient-to-r from-indigo-950/80 to-slate-900 border-indigo-500/80 text-indigo-100 shadow-lg shadow-indigo-950/60 ring-1 ring-indigo-500/30'
                        : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-transform ${
                          isCurrent
                            ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 scale-105'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        <Music size={18} className={isCurrent && isPlaying ? 'animate-bounce' : ''} />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold font-cairo truncate text-white">
                            {trk.label}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono uppercase font-bold ${
                              isCurrent
                                ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-500/40'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {trk.tag}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-cairo truncate mt-0.5">
                          {trk.desc}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ms-2">
                      {isCurrent && isPlaying ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold font-cairo">
                          <Check size={14} className="text-indigo-400" />
                          <span>{language === 'ar' ? 'تعمل الآن 🎵' : 'Playing 🎵'}</span>
                        </div>
                      ) : isCurrent ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold font-cairo">
                          <span>{language === 'ar' ? 'المحددة' : 'Selected'}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-cyan-400 font-cairo hover:text-cyan-300 font-bold">
                          {language === 'ar' ? 'تشغيل ▶' : 'Play ▶'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action / Play Toggle & Close */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleTogglePlayPause}
              className={`w-full py-3.5 px-4 rounded-2xl font-cairo font-bold text-sm flex items-center justify-center gap-2 border transition-all active:scale-95 ${
                isPlaying
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40 shadow-md'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-cyan-400/40 shadow-lg shadow-cyan-600/20'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause size={18} />
                  <span>{language === 'ar' ? 'إيقاف مؤقت للموسيقى' : 'Pause Music'}</span>
                </>
              ) : (
                <>
                  <Play size={18} />
                  <span>{language === 'ar' ? 'تشغيل الموسيقى الآن' : 'Play Music Now'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-cairo font-bold text-sm border border-slate-700 shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Check size={16} className="text-cyan-400" />
              <span>{language === 'ar' ? 'إغلاق القائمة' : 'Close Menu'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
