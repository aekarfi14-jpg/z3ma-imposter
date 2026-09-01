import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera as CameraIcon, Check, X, RotateCcw } from 'lucide-react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
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
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const addWatermark = (rawDataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

        ctx.font = 'bold 18px Cairo, sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`Z3MA IMPOSTER • Round #${roundNumber}`, 20, canvas.height - 20);

        const dateStr = new Date().toLocaleDateString();
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(`${dateStr} • ${players.length} Players`, canvas.width - 220, canvas.height - 20);

        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = rawDataUrl;
    });
  };

  const handleCapture = async () => {
    soundService.playSFX('piuw.mp3');
    setCameraError(null);
    setIsCapturing(true);

    try {
      const photo = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      soundService.playSFX('dry-fart.mp3');

      const rawUrl = photo.dataUrl;
      if (!rawUrl) {
        throw new Error('No photo data returned');
      }

      const watermarkedUrl = await addWatermark(rawUrl);
      setCapturedPhotoUrl(watermarkedUrl);
    } catch (err: unknown) {
      console.warn('Camera error:', err);
      setCameraError(
        language === 'ar'
          ? 'تعذر الوصول إلى الكاميرا. يرجى التأكد من السماح بالصلاحيات من إعدادات الجهاز.'
          : 'Unable to access camera. Please allow camera permissions from device settings.'
      );
    } finally {
      setIsCapturing(false);
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

  return (
    <div className="w-full max-w-lg mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] space-y-4">
      <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-4 overflow-hidden">
        {/* Preview Viewport */}
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
            <div className="flex flex-col items-center justify-center gap-4 text-slate-500 p-6">
              <CameraIcon size={64} strokeWidth={1.5} />
              <p className="text-sm text-center">
                {language === 'ar'
                  ? 'اضغط على زر التصوير لفتح الكاميرا'
                  : 'Tap the capture button to open the camera'}
              </p>
              <div className="bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center justify-between gap-4 text-xs text-slate-300 border border-slate-800">
                <span className="font-bold text-cyan-400">Round #{roundNumber}</span>
                <span className="text-[11px] text-slate-400">{players.length} Players</span>
              </div>
            </div>
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
              onClick={handleCapture}
              disabled={isCapturing || !!cameraError}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold font-cairo text-base flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 border border-cyan-300/40 transition-all disabled:opacity-50"
            >
              <CameraIcon size={22} />
              <span>{isCapturing ? '...' : t.captureSnapshot}</span>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};
