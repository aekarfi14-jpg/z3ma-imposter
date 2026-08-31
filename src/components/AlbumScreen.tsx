import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Images,
  Mic,
  History,
  Trash2,
  Play,
  Pause,
  Download,
  Calendar,
  Users,
  Skull,
  Trophy,
  X,
} from 'lucide-react';
import {
  CommemorativePhoto,
  GameRoundSummary,
  Language,
  VoiceRecording,
} from '../types';
import { translations } from '../i18n/translations';
import { soundService } from '../services/soundService';

interface AlbumScreenProps {
  language: Language;
  photos: CommemorativePhoto[];
  recordings: VoiceRecording[];
  history: GameRoundSummary[];
  onDeletePhoto: (id: string) => void;
  onDeleteRecording: (id: string) => void;
  onDeleteHistory: (id: string) => void;
  onBack: () => void;
}

type TabType = 'photos' | 'recordings' | 'history';

export const AlbumScreen: React.FC<AlbumScreenProps> = ({
  language,
  photos,
  recordings,
  history,
  onDeletePhoto,
  onDeleteRecording,
  onDeleteHistory,
  onBack,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<TabType>('photos');
  const [playingRecordingId, setPlayingRecordingId] = useState<string | null>(null);
  const [activeAudioElement, setActiveAudioElement] = useState<HTMLAudioElement | null>(null);
  const [selectedPhotoForLightbox, setSelectedPhotoForLightbox] = useState<CommemorativePhoto | null>(null);

  const handleTogglePlayAudio = (rec: VoiceRecording) => {
    soundService.playSFX('piuw.mp3');

    if (playingRecordingId === rec.id) {
      if (activeAudioElement) {
        activeAudioElement.pause();
      }
      setPlayingRecordingId(null);
      setActiveAudioElement(null);
    } else {
      if (activeAudioElement) {
        activeAudioElement.pause();
      }
      const audio = new Audio(rec.audioBlobUrl);
      audio.onended = () => {
        setPlayingRecordingId(null);
        setActiveAudioElement(null);
      };
      audio.play().catch(() => {});
      setActiveAudioElement(audio);
      setPlayingRecordingId(rec.id);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 pb-12 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Images size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-cairo">
              {t.albumTitle}
            </h2>
            <p className="text-xs text-slate-400">
              {photos.length} {language === 'ar' ? 'صور' : 'Photos'} • {recordings.length} {language === 'ar' ? 'تسجيلات' : 'Audios'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundService.playSFX('piuw.mp3');
            if (activeAudioElement) activeAudioElement.pause();
            onBack();
          }}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-cairo border border-slate-700 transition-all"
        >
          {t.backToHome}
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 gap-1.5">
        <button
          onClick={() => {
            soundService.playSFX('piuw.mp3');
            setActiveTab('photos');
          }}
          className={`flex-1 py-2.5 rounded-xl font-cairo font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'photos'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Images size={16} />
          <span>{t.photosTab} ({photos.length})</span>
        </button>

        <button
          onClick={() => {
            soundService.playSFX('piuw.mp3');
            setActiveTab('recordings');
          }}
          className={`flex-1 py-2.5 rounded-xl font-cairo font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'recordings'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mic size={16} />
          <span>{t.recordingsTab} ({recordings.length})</span>
        </button>

        <button
          onClick={() => {
            soundService.playSFX('piuw.mp3');
            setActiveTab('history');
          }}
          className={`flex-1 py-2.5 rounded-xl font-cairo font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <History size={16} />
          <span>{t.historyTab} ({history.length})</span>
        </button>
      </div>

      {/* Tab 1: Commemorative Photos */}
      {activeTab === 'photos' && (
        <div className="space-y-4">
          {photos.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
              <Images size={48} className="mx-auto text-slate-600" />
              <p className="text-slate-400 font-cairo text-sm max-w-xs mx-auto">
                {t.noPhotosYet}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl group space-y-2"
                >
                  <div
                    onClick={() => setSelectedPhotoForLightbox(photo)}
                    className="w-full aspect-[4/3] relative cursor-pointer overflow-hidden bg-slate-950"
                  >
                    <img
                      src={photo.photoDataUrl}
                      alt={`Round #${photo.roundNumber}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-xl text-[10px] font-bold text-cyan-400 border border-slate-800">
                      {t.round} #{photo.roundNumber}
                    </div>
                  </div>

                  <div className="p-3.5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block font-cairo">
                        {photo.date}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {photo.playersCount} {language === 'ar' ? 'لاعبين' : 'Players'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        soundService.playSFX('piuw.mp3');
                        onDeletePhoto(photo.id);
                      }}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                      title={t.deleteItem}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Voice Recordings */}
      {activeTab === 'recordings' && (
        <div className="space-y-3">
          {recordings.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
              <Mic size={48} className="mx-auto text-slate-600" />
              <p className="text-slate-400 font-cairo text-sm max-w-xs mx-auto">
                {t.noRecordingsYet}
              </p>
            </div>
          ) : (
            recordings.map((rec) => {
              const isPlaying = playingRecordingId === rec.id;

              return (
                <div
                  key={rec.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isPlaying
                      ? 'bg-cyan-950/60 border-cyan-500/70 shadow-lg shadow-cyan-950/50'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <button
                    onClick={() => handleTogglePlayAudio(rec)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                      isPlaying
                        ? 'bg-cyan-500 text-slate-950 shadow-md animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-cyan-400'
                    }`}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-200 text-xs sm:text-sm truncate font-mono">
                      {rec.filename}
                    </h4>
                    <span className="text-[11px] text-slate-400 block">
                      {rec.date} • {rec.durationSeconds}s
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={rec.audioBlobUrl}
                      download={rec.filename}
                      className="p-2 text-slate-400 hover:text-cyan-400 rounded-xl hover:bg-slate-800 transition-colors"
                      title={t.downloadRecording}
                    >
                      <Download size={16} />
                    </a>
                    <button
                      onClick={() => {
                        soundService.playSFX('piuw.mp3');
                        if (isPlaying && activeAudioElement) {
                          activeAudioElement.pause();
                          setPlayingRecordingId(null);
                        }
                        onDeleteRecording(rec.id);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                      title={t.deleteItem}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
              <History size={48} className="mx-auto text-slate-600" />
              <p className="text-slate-400 font-cairo text-sm max-w-xs mx-auto">
                {t.noHistoryYet}
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-950 text-cyan-400 border border-slate-800">
                      {t.round} #{item.roundNumber}
                    </span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        item.winner === 'IMPOSTERS'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {item.winner === 'IMPOSTERS' ? '😈 IMPOSTERS' : '🎉 CREW'}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-slate-200 font-cairo">
                    {item.secretWord} • <span className="text-xs text-slate-400">{item.categoryName}</span>
                  </div>

                  <div className="text-xs text-slate-400 font-cairo">
                    {language === 'ar' ? 'الـ Imposters:' : 'Imposters:'} {item.imposters.join(', ')}
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundService.playSFX('piuw.mp3');
                    onDeleteHistory(item.id);
                  }}
                  className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                  title={t.deleteItem}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Lightbox for Photos */}
      {selectedPhotoForLightbox && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative"
          >
            <button
              onClick={() => setSelectedPhotoForLightbox(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 text-slate-200 hover:text-white border border-slate-700 z-10"
            >
              <X size={18} />
            </button>
            <img
              src={selectedPhotoForLightbox.photoDataUrl}
              alt="Lightbox"
              className="w-full max-h-[70vh] object-contain bg-black"
            />
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 font-cairo">
              <span>Round #{selectedPhotoForLightbox.roundNumber} • {selectedPhotoForLightbox.date}</span>
              <a
                href={selectedPhotoForLightbox.photoDataUrl}
                download={`Z3MA_Round_${selectedPhotoForLightbox.roundNumber}.jpg`}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1 shadow-md"
              >
                <Download size={14} />
                <span>{language === 'ar' ? 'تحميل' : 'Download'}</span>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
