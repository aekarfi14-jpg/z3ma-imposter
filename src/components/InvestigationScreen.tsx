import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Mic,
  MicOff,
  Vote,
  BookOpen,
  Sparkles,
  AlertCircle,
  Clock,
  Volume2,
} from 'lucide-react';
import { Language, VoiceRecording } from '../types';
import { BANTER_QUOTES } from '../data/quotes';
import { translations } from '../i18n/translations';
import { soundService } from '../services/soundService';

interface InvestigationScreenProps {
  language: Language;
  roundNumber: number;
  durationSeconds: number;
  onGoToVoting: () => void;
  onOpenRules: () => void;
  onSaveRecording: (recording: VoiceRecording) => void;
}

export const InvestigationScreen: React.FC<InvestigationScreenProps> = ({
  language,
  roundNumber,
  durationSeconds,
  onGoToVoting,
  onOpenRules,
  onSaveRecording,
}) => {
  const t = translations[language];

  const [timeLeft, setTimeLeft] = useState<number>(durationSeconds);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);
  const [hasPlayed30sWarning, setHasPlayed30sWarning] = useState<boolean>(false);

  // Audio recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingStartTimeRef = useRef<number>(0);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (!isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 31 && !hasPlayed30sWarning) {
            soundService.playSFX('30-s-left.mp3');
            setHasPlayed30sWarning(true);
          }
          if (prev <= 1) {
            soundService.playSFX('faaah.mp3');
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused, timeLeft, hasPlayed30sWarning]);

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % BANTER_QUOTES.length);
    }, 8000);

    return () => clearInterval(quoteInterval);
  }, []);

  const handleTimerComplete = () => {
    stopRecordingAndSave();
    onGoToVoting();
  };

  // Recording management
  const toggleRecording = async () => {
    if (isRecording) {
      soundService.playSFX('piuw.mp3');
      stopRecordingAndSave();
    } else {
      try {
        soundService.playSFX('piuw.mp3');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        recordingStartTimeRef.current = Date.now();
        setRecordingDuration(0);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioBlobUrl = URL.createObjectURL(audioBlob);
          const durationSec = Math.max(
            1,
            Math.round((Date.now() - recordingStartTimeRef.current) / 1000)
          );

          const now = new Date();
          const pad = (n: number) => n.toString().padStart(2, '0');
          const dateFormatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
            now.getDate()
          )}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
          const filename = `Round_${roundNumber}_${dateFormatted}.webm`;

          const recordingItem: VoiceRecording = {
            id: 'rec_' + Date.now(),
            roundNumber,
            filename,
            date: now.toLocaleDateString('ar-DZ', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            timestamp: Date.now(),
            audioBlobUrl,
            durationSeconds: durationSec,
          };

          onSaveRecording(recordingItem);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);

        recordingTimerRef.current = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);
      } catch (err) {
        console.warn('Microphone permission denied', err);
      }
    }
  };

  const stopRecordingAndSave = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  const currentQuote = BANTER_QUOTES[currentQuoteIndex];

  return (
    <div className="w-full max-w-lg mx-auto p-4 flex flex-col items-center justify-between min-h-[calc(100vh-6rem)] space-y-6">
      {/* Top Header Card */}
      <div className="w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 font-cairo text-sm sm:text-base">
              {t.investigationTitle}
            </h3>
            <p className="text-[11px] text-slate-400">{t.investigationDesc}</p>
          </div>
        </div>

        <button
          onClick={() => {
            soundService.playSFX('piuw.mp3');
            onOpenRules();
          }}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-all"
        >
          <BookOpen size={16} className="text-amber-400" />
        </button>
      </div>

      {/* Center Giant Timer & Atmosphere */}
      <div className="w-full relative flex flex-col items-center justify-center py-4">
        {/* Glow Ring */}
        <div
          className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full flex flex-col items-center justify-center border-4 shadow-2xl relative transition-all duration-700 ${
            timeLeft <= 30
              ? 'bg-rose-950/40 border-rose-500/80 shadow-rose-600/40 animate-pulse'
              : 'bg-slate-900/90 border-cyan-500/50 shadow-cyan-500/20'
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 font-outfit mb-1">
            {t.timeRemaining}
          </span>
          <h1 className="text-6xl sm:text-7xl font-black text-white font-outfit tracking-tighter drop-shadow-2xl">
            {formattedTime}
          </h1>

          {/* Pause / Resume Pill Button inside circle */}
          <button
            onClick={() => {
              soundService.playSFX('piuw.mp3');
              setIsPaused(!isPaused);
            }}
            className="mt-3 px-4 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold font-cairo border border-slate-700 flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            {isPaused ? <Play size={14} className="text-emerald-400" /> : <Pause size={14} className="text-amber-400" />}
            <span>{isPaused ? t.resumeTimer : t.pauseTimer}</span>
          </button>
        </div>
      </div>

      {/* Rotating Banter Quote Box */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-lg flex items-center justify-between gap-3 text-center"
          >
            <span className="text-lg">💬</span>
            <p className="text-xs sm:text-sm font-bold text-cyan-200 font-cairo flex-1">
              {language === 'ar' ? currentQuote.textAr : currentQuote.textEn}
            </p>
            <Sparkles size={16} className="text-cyan-400 shrink-0 opacity-60" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Audio Recording Live Status Banner */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full p-3 rounded-2xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-between text-rose-200 text-xs font-cairo"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bold">{t.recordingActive}</span>
          </div>
          <span className="font-mono font-bold text-rose-300">
            {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
          </span>
        </motion.div>
      )}

      {/* Bottom Actions Grid */}
      <div className="w-full space-y-3">
        {/* Record Audio Button */}
        <button
          onClick={toggleRecording}
          className={`w-full py-3.5 px-4 rounded-2xl font-cairo font-bold text-sm flex items-center justify-center gap-2 border shadow-lg transition-all active:scale-95 ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400 shadow-rose-600/30'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 shadow-slate-950'
          }`}
        >
          {isRecording ? <MicOff size={18} /> : <Mic size={18} className="text-rose-400" />}
          <span>{isRecording ? t.stopRecording : t.recordAudio}</span>
        </button>

        {/* Proceed to Voting Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            soundService.playSFX('piuw.mp3');
            stopRecordingAndSave();
            onGoToVoting();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-cairo font-black text-lg shadow-xl shadow-cyan-500/30 border border-cyan-300/40 flex items-center justify-center gap-2 transition-all"
        >
          <Vote size={22} />
          <span>{t.goToVoting}</span>
        </motion.button>
      </div>

      {/* Pause Stop.jpg Modal */}
      {isPaused && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-slate-900 border-2 border-cyan-500/60 rounded-3xl p-6 shadow-2xl text-center space-y-4"
          >
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src="/assets/Stop.jpg"
                alt="Stop"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/Stop.jpg';
                }}
              />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white font-cairo">
                {t.timeOutModalTitle}
              </h3>
              <p className="text-xs text-slate-400 font-cairo">
                {t.timeOutModalDesc}
              </p>
            </div>

            <button
              onClick={() => {
                soundService.playSFX('piuw.mp3');
                setIsPaused(false);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold font-cairo text-sm shadow-md"
            >
              {t.resumeTimer}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
