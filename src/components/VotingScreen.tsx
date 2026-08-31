import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Vote, AlertTriangle, Check, Plus, Minus, ShieldAlert } from 'lucide-react';
import { Language, Player } from '../types';
import { getAvatarById } from '../data/avatars';
import { translations } from '../i18n/translations';
import { soundService } from '../services/soundService';
import { SELF_VOTE_MESSAGES_AR, SELF_VOTE_MESSAGES_EN } from '../data/quotes';

interface VotingScreenProps {
  language: Language;
  activePlayers: Player[];
  onConfirmElimination: (eliminatedPlayer: Player) => void;
}

export const VotingScreen: React.FC<VotingScreenProps> = ({
  language,
  activePlayers,
  onConfirmElimination,
}) => {
  const t = translations[language];

  // Map of playerId -> votes received count
  const [votes, setVotes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    activePlayers.forEach((p) => {
      initial[p.id] = 0;
    });
    return initial;
  });

  const [tieError, setTieError] = useState<boolean>(false);
  const [selfVoteNotice, setSelfVoteNotice] = useState<string | null>(null);

  const totalVotesCast = (Object.values(votes) as number[]).reduce((a: number, b: number) => a + b, 0);

  const handleAddVote = (playerId: string) => {
    soundService.playSFX('piuw.mp3');
    setTieError(false);
    setVotes((prev) => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1,
    }));
  };

  const handleRemoveVote = (playerId: string) => {
    soundService.playSFX('piuw.mp3');
    setTieError(false);
    setVotes((prev) => ({
      ...prev,
      [playerId]: Math.max(0, (prev[playerId] || 0) - 1),
    }));
  };

  const handleTriggerSelfVoteJoke = (player: Player) => {
    const template =
      language === 'ar'
        ? SELF_VOTE_MESSAGES_AR[Math.floor(Math.random() * SELF_VOTE_MESSAGES_AR.length)]
        : SELF_VOTE_MESSAGES_EN[Math.floor(Math.random() * SELF_VOTE_MESSAGES_EN.length)];
    const msg = template.replace('[{NAME}]', player.name);
    setSelfVoteNotice(msg);
    setTimeout(() => setSelfVoteNotice(null), 4000);
    handleAddVote(player.id);
  };

  const handleConfirmAndTally = () => {
    if (totalVotesCast === 0) {
      soundService.playSFX('faaah.mp3');
      return;
    }

    // Determine max votes
    let maxVotes = -1;
    let topPlayerIds: string[] = [];

    (Object.entries(votes) as [string, number][]).forEach(([pId, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        topPlayerIds = [pId];
      } else if (count === maxVotes && count > 0) {
        topPlayerIds.push(pId);
      }
    });

    if (maxVotes <= 0) return;

    // Check for a tie
    if (topPlayerIds.length > 1) {
      soundService.playSFX('faaah.mp3');
      setTieError(true);
      return;
    }

    // We have a single suspect!
    const suspect = activePlayers.find((p) => p.id === topPlayerIds[0]);
    if (suspect) {
      soundService.playSFX('get-out-tuco.mp3');
      onConfirmElimination(suspect);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 flex flex-col items-center justify-between min-h-[calc(100vh-6rem)] space-y-6">
      {/* Visual Header with Voting.jpg */}
      <div className="w-full relative rounded-3xl overflow-hidden border-2 border-slate-800 bg-slate-900 shadow-xl">
        <div className="w-full h-32 relative">
          <img
            src="/assets/Voting.jpg"
            alt="Voting Room"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/Voting.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-end p-4">
            <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold uppercase font-outfit">
              <ShieldAlert size={14} />
              <span>{t.votingTitle}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-cairo">
              {language === 'ar' ? 'صندوق طرد المشكوك فيه' : 'Elimination Ballot Box'}
            </h3>
          </div>
        </div>
      </div>

      {/* Tie Alert Banner */}
      <AnimatePresence>
        {tieError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full p-4 rounded-2xl bg-amber-950/90 border-2 border-amber-500/70 text-amber-200 shadow-xl flex items-center gap-3 text-right sm:text-center"
          >
            <AlertTriangle size={24} className="text-amber-400 shrink-0" />
            <div className="space-y-0.5">
              <h4 className="font-bold font-cairo text-sm text-amber-100">
                {t.tieWarningTitle}
              </h4>
              <p className="text-xs font-cairo text-amber-300">
                {t.tieWarningDesc}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Self Vote Funny Notification */}
      <AnimatePresence>
        {selfVoteNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full p-3 rounded-2xl bg-rose-950 border border-rose-500/50 text-rose-200 text-xs font-cairo text-center font-bold shadow-lg"
          >
            {selfVoteNotice}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suspect Players List */}
      <div className="w-full space-y-2.5 max-h-[46vh] overflow-y-auto pr-1">
        {activePlayers.map((player) => {
          const avatar = getAvatarById(player.avatarId);
          const count = votes[player.id] || 0;

          return (
            <motion.div
              key={player.id}
              whileTap={{ scale: 0.99 }}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                count > 0
                  ? 'bg-slate-900 border-rose-500/60 shadow-lg shadow-rose-950/30'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Player Info */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${avatar.bgGradient} flex items-center justify-center text-2xl shadow-md border border-slate-700`}
                >
                  <span>{avatar.svgIcon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 font-cairo text-sm sm:text-base">
                    {player.name}
                  </h4>
                  <button
                    onClick={() => handleTriggerSelfVoteJoke(player)}
                    className="text-[10px] text-slate-500 hover:text-cyan-400 font-cairo transition-colors"
                  >
                    {language === 'ar' ? 'صوت على روحه؟ 😂' : 'Self-voted? 😂'}
                  </button>
                </div>
              </div>

              {/* Vote Steppers */}
              <div className="flex items-center gap-2">
                {count > 0 && (
                  <button
                    onClick={() => handleRemoveVote(player.id)}
                    className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all border border-slate-700 active:scale-95"
                    title="Remove Vote"
                  >
                    <Minus size={15} />
                  </button>
                )}

                <span
                  className={`w-9 text-center font-outfit font-black text-base ${
                    count > 0 ? 'text-rose-400' : 'text-slate-500'
                  }`}
                >
                  {count}
                </span>

                <button
                  onClick={() => handleAddVote(player.id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-cairo font-bold text-xs flex items-center gap-1 shadow-md shadow-rose-600/20 active:scale-95 transition-all"
                >
                  <Plus size={14} />
                  <span>{t.voteFor}</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Confirm & Tally Button */}
      <motion.button
        id="voting-confirm-btn"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleConfirmAndTally}
        disabled={totalVotesCast === 0}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-40 disabled:pointer-events-none text-white font-cairo font-black text-lg shadow-xl shadow-rose-600/30 border border-rose-400/40 flex items-center justify-center gap-2 transition-all"
      >
        <Vote size={22} />
        <span>{t.confirmVotes}</span>
      </motion.button>
    </div>
  );
};
