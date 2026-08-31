import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, RefreshCw, Check, X, RotateCcw, Sparkles } from 'lucide-react';
import { CommemorativePhoto, Language, Player } from '../types';
import { translations } from '../i18n/translations';
import { soundService } from '../services/soundService';

interface CameraScreenProps {
  language: Language;
  roundNumber: number;
  players: Player[];
  imposterCount: number;
  onSavePhotoAndContinue: (photo: CommemorativePhoto) => void;
  onCancel: () => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({
  language,
  roundNumber,
  players,
  imposterCount,
  onSavePhotoAndContinue,
  onCancel,
}) => {
  const t = translations[language];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Initialize camera stream
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function startCamera() {
      try {
        setCameraError(null);
        if (activeStream) {
          activeStream.getTracks().forEach((track) => track.stop());
        }

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        activeStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err: unknown) {
        console.warn('Camera error:', err);
        setCameraError(
          language === 'ar'
            ? 'تعذر الوصول إلى الكاميرا. يرجى التأكد من السماح بالصلاحيات.'
            : 'Unable to access camera. Please allow camera permissions.'
        );
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode, language]);

  // Trigger countdown snapshot
  const handleStartCaptureCountdown = () => {
    soundService.playSFX('piuw.mp3');
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          executeSnap();
          return null;
        }
        soundService.playSFX('piuw.mp3');
        return prev - 1;
      });
    }, 1000);
  };

  const executeSnap = () => {
    if (!videoRef.current) return;
    soundService.playSFX('dry-fart.mp3');

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // If user facing, flip horizontally for mirror effect
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Reset transform for drawing overlay badge
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      // Add watermark footer
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

      ctx.font = 'bold 18px Cairo, sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`Z3MA IMPOSTER • Round #${roundNumber}`, 20, canvas.height - 20);

      const dateStr = new Date().toLocaleDateString();
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(`${dateStr} • ${players.length} Players`, canvas.width - 200, canvas.height - 20);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPhotoUrl(dataUrl);
    }
  };

  const handleSaveAndProceed = () => {
    if (!capturedPhotoUrl) return;
    soundService.playSFX('piuw.mp3');

    const photoRecord: CommemorativePhoto = {
      id: 'photo_' + Date.now(),
      roundNumber,
      date: new Date().toLocaleDateString('ar-DZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: Date.now(),
      photoDataUrl: capturedPhotoUrl,
      playersCount: players.length,
      imposterCount,
      playerNames: players.map((p) => p.name),
    };

    onSavePhotoAndContinue(photoRecord);
  };

  const handleToggleFacingMode = () => {
    soundService.playSFX('piuw.mp3');
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] space-y-4">
      <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-4 overflow-hidden">
        {/* Video / Snapshot Viewport */}
        <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
          {capturedPhotoUrl ? (
            <img
              src={capturedPhotoUrl}
              alt="Snapshot"
              className="w-full h-full object-cover"
            />
          ) : cameraError ? (
            <div className="p-6 text-center text-rose-400 space-y-2">
              <p className="text-sm font-semibold">{cameraError}</p>
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold"
              >
                {t.skipPhoto}
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  facingMode === 'user' ? '-scale-x-100' : ''
                }`}
              />

              {/* Countdown overlay */}
              {countdown !== null && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 1 }}
                  key={countdown}
                  className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center"
                >
                  <span className="text-8xl font-black text-cyan-400 font-outfit drop-shadow-2xl">
                    {countdown}
                  </span>
                </motion.div>
              )}

              {/* Watermark overlay preview */}
              <div className="absolute bottom-2 left-2 right-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center justify-between text-xs text-slate-200 border border-slate-800">
                <span className="font-bold text-cyan-400">Round #{roundNumber}</span>
                <span className="text-[11px] text-slate-400">{players.length} Players</span>
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        {capturedPhotoUrl ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                soundService.playSFX('piuw.mp3');
                setCapturedPhotoUrl(null);
              }}
              className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-cairo text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              <RotateCcw size={18} />
              <span>{t.retakePhoto}</span>
            </button>

            <button
              onClick={handleSaveAndProceed}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold font-cairo text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
            >
              <Check size={18} />
              <span>{t.savePhotoAndContinue}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            {/* Cancel */}
            <button
              onClick={() => {
                soundService.playSFX('piuw.mp3');
                onCancel();
              }}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-all"
              title="Cancel"
            >
              <X size={20} />
            </button>

            {/* Snap Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartCaptureCountdown}
              disabled={countdown !== null || !!cameraError}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold font-cairo text-base flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 border border-cyan-300/40 transition-all"
            >
              <Camera size={22} />
              <span>{t.captureSnapshot}</span>
            </motion.button>

            {/* Switch Camera */}
            <button
              onClick={handleToggleFacingMode}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              title={t.switchCamera}
            >
              <RefreshCw size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
