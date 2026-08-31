import React, { useEffect, useState } from 'react';
import {
  CategoryItem,
  CommemorativePhoto,
  GamePhase,
  GameRoundSummary,
  GameSettings,
  Language,
  PastAssistantRecord,
  Player,
  SecretWordItem,
  VoiceRecording,
} from './types';
import { CATEGORIES, selectSecretWord } from './data/words';
import { storageService } from './services/storageService';
import { soundService } from './services/soundService';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { SetupScreen } from './components/SetupScreen';
import { PhotoPromptScreen } from './components/PhotoPromptScreen';
import { CameraScreen } from './components/CameraScreen';
import { CardDistributionScreen } from './components/CardDistributionScreen';
import { InvestigationScreen } from './components/InvestigationScreen';
import { VotingScreen } from './components/VotingScreen';
import { RevealEliminationScreen } from './components/RevealEliminationScreen';
import { FinalGuessScreen } from './components/FinalGuessScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { AlbumScreen } from './components/AlbumScreen';
import { RulesModal } from './components/RulesModal';
import { NarcissisticModal } from './components/NarcissisticModal';
import { LibraryModal } from './components/LibraryModal';

export const App: React.FC = () => {
  // Global persistent states
  const [settings, setSettings] = useState<GameSettings>(() => storageService.getSettings());
  const [players, setPlayers] = useState<Player[]>(() => storageService.getPlayers());
  const [roundNumber, setRoundNumber] = useState<number>(() => storageService.getRoundCount());
  const [pastAssistant, setPastAssistant] = useState<PastAssistantRecord | null>(() =>
    storageService.getPastAssistant()
  );
  const [photos, setPhotos] = useState<CommemorativePhoto[]>(() => storageService.getPhotos());
  const [recordings, setRecordings] = useState<VoiceRecording[]>(() =>
    storageService.getRecordings()
  );
  const [history, setHistory] = useState<GameRoundSummary[]>(() => storageService.getHistory());

  // Active game session states
  const [gamePhase, setGamePhase] = useState<GamePhase>('HOME');
  const [activeGamePlayers, setActiveGamePlayers] = useState<Player[]>([]);
  const [activeSuspects, setActiveSuspects] = useState<Player[]>([]);
  const [secretWord, setSecretWord] = useState<SecretWordItem | null>(null);
  const [category, setCategory] = useState<CategoryItem | null>(null);
  const [assignedHint, setAssignedHint] = useState<string | null>(null);
  const [imposterPlayers, setImposterPlayers] = useState<Player[]>([]);
  const [assistantPlayer, setAssistantPlayer] = useState<Player | null>(null);
  const [currentEliminatedSuspect, setCurrentEliminatedSuspect] = useState<Player | null>(null);
  const [winner, setWinner] = useState<'IMPOSTERS' | 'CREW'>('CREW');

  // Modals & Controls
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [showEasterEggModal, setShowEasterEggModal] = useState<boolean>(false);
  const [showLibraryModal, setShowLibraryModal] = useState<boolean>(false);
  const [customWords, setCustomWords] = useState<SecretWordItem[]>(() =>
    storageService.getCustomWords()
  );
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(false);

  // Sync settings audio volume on mount
  useEffect(() => {
    soundService.setSFXVolume(settings.sfxVolume);
    soundService.setMusicVolume(settings.musicVolume);
  }, [settings.sfxVolume, settings.musicVolume]);

  const handleLanguageChange = (lang: Language) => {
    const updated = storageService.saveSettings({ language: lang });
    setSettings(updated);
  };

  const handleUpdatePlayers = (updated: Player[]) => {
    setPlayers(updated);
    storageService.savePlayers(updated);
  };

  const handleUpdateSettings = (partial: Partial<GameSettings>) => {
    const updated = storageService.saveSettings(partial);
    setSettings(updated);
    if (partial.sfxVolume !== undefined) soundService.setSFXVolume(partial.sfxVolume);
    if (partial.musicVolume !== undefined) soundService.setMusicVolume(partial.musicVolume);
  };

  const handleToggleMusic = () => {
    const muted = soundService.toggleMusicMute();
    setIsMusicMuted(muted);
  };

  // Start new round from Setup
  const handleStartRound = () => {
    if (players.length < 3) return;

    // 1. Pick secret word (incorporating user custom words from Library)
    const selectedWord = selectSecretWord(
      settings.enabledCategoryIds,
      settings.lastUsedWordIds,
      customWords
    );
    const selectedCategory =
      CATEGORIES.find((c) => c.id === selectedWord.categoryId) || CATEGORIES[0];

    // 2. Assign roles randomly
    const shuffled = [...players].sort(() => 0.5 - Math.random());
    const countImposters = Math.min(settings.imposterCount, players.length - 1);

    const impostersList: Player[] = [];
    const regularList: Player[] = [];

    shuffled.forEach((p, idx) => {
      if (idx < countImposters) {
        const imp = { ...p, isImposter: true, isAssistant: false };
        impostersList.push(imp);
      } else {
        regularList.push({ ...p, isImposter: false, isAssistant: false });
      }
    });

    let assignedAssistant: Player | null = null;
    if (settings.assistantEnabled && regularList.length > 0) {
      regularList[0].isAssistant = true;
      assignedAssistant = regularList[0];
    } else {
      assignedAssistant = null;
    }

    const allAssignedPlayers = [...impostersList, ...regularList].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    // 3. Assign single hint if enabled
    let singleHint: string | null = null;
    if (settings.hintEnabled) {
      const hintPool =
        settings.language === 'ar' ? selectedWord.hintsAr : selectedWord.hintsEn;
      if (hintPool && hintPool.length > 0) {
        const randomHintIdx = Math.floor(Math.random() * hintPool.length);
        singleHint = hintPool[randomHintIdx];
      }
    }

    // Save state
    setSecretWord(selectedWord);
    setCategory(selectedCategory);
    setAssignedHint(singleHint);
    setImposterPlayers(impostersList);
    setAssistantPlayer(settings.assistantEnabled ? assignedAssistant : null);
    setActiveGamePlayers(allAssignedPlayers);
    setActiveSuspects(allAssignedPlayers);
    storageService.addUsedWord(selectedWord.id);

    // Prompt photo
    setGamePhase('PHOTO_PROMPT');
  };

  const handleSavePhotoAndProceed = (photo: CommemorativePhoto) => {
    storageService.savePhoto(photo);
    setPhotos(storageService.getPhotos());
    setGamePhase('CARD_DISTRIBUTION');
  };

  const handleFinishCardDistribution = () => {
    soundService.playMusic(settings.currentTrack);
    setGamePhase('INVESTIGATION');
  };

  const handleSaveRecording = (rec: VoiceRecording) => {
    storageService.saveRecording(rec);
    setRecordings(storageService.getRecordings());
  };

  const handleConfirmElimination = (suspect: Player) => {
    setCurrentEliminatedSuspect(suspect);
    setActiveSuspects((prev) => prev.filter((p) => p.id !== suspect.id));
    setGamePhase('REVEAL_ELIMINATION');
  };

  const handleImpostersWin = () => {
    setWinner('IMPOSTERS');
    recordRoundHistory('IMPOSTERS', false);
    setGamePhase('GAME_OVER');
  };

  const handleNextVote = () => {
    setGamePhase('VOTING');
  };

  const handleProceedToFinalGuess = () => {
    setGamePhase('FINAL_GUESS');
  };

  const handleFinalGuessResult = (isCorrect: boolean) => {
    const finalWinner: 'IMPOSTERS' | 'CREW' = isCorrect ? 'IMPOSTERS' : 'CREW';
    setWinner(finalWinner);
    recordRoundHistory(finalWinner, isCorrect);
    setGamePhase('GAME_OVER');
  };

  const recordRoundHistory = (winningSide: 'IMPOSTERS' | 'CREW', finalGuessCorrect?: boolean) => {
    if (!secretWord || !category) return;

    const summary: GameRoundSummary = {
      id: 'round_' + Date.now(),
      roundNumber,
      date: new Date().toLocaleDateString('ar-DZ', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      secretWord: settings.language === 'ar' ? secretWord.word : secretWord.wordEn,
      categoryName: settings.language === 'ar' ? category.nameAr : category.nameEn,
      imposters: imposterPlayers.map((p) => p.name),
      assistant: assistantPlayer?.name,
      winner: winningSide,
      eliminationHistory: [],
      finalGuessCorrect,
    };

    storageService.addHistory(summary);
    setHistory(storageService.getHistory());
  };

  const handleAssistantExposed = (assistantName: string, isExposed: boolean) => {
    if (isExposed) {
      const record: PastAssistantRecord = {
        roundNumber,
        assistantName,
        date: new Date().toLocaleDateString(),
      };
      storageService.setPastAssistant(record);
      setPastAssistant(record);
    } else {
      storageService.setPastAssistant(null);
      setPastAssistant(null);
    }
  };

  const handlePlayAgain = () => {
    const nextRound = storageService.incrementRoundCount();
    setRoundNumber(nextRound);
    setAssistantPlayer(null);
    setSecretWord(null);
    setCategory(null);
    setAssignedHint(null);
    setCurrentEliminatedSuspect(null);
    setGamePhase('SETUP');
  };

  const handleBackHome = () => {
    soundService.stopMusic();
    setAssistantPlayer(null);
    setSecretWord(null);
    setCategory(null);
    setAssignedHint(null);
    setCurrentEliminatedSuspect(null);
    setGamePhase('HOME');
  };

  return (
    <div
      dir={settings.language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-950 text-slate-100 font-cairo flex flex-col selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden safe-area-inset"
    >
      {/* Top Navigation */}
      <Navbar
        language={settings.language}
        onLanguageChange={handleLanguageChange}
        onOpenRules={() => setShowRulesModal(true)}
        isMusicMuted={isMusicMuted}
        onToggleMusic={handleToggleMusic}
        roundNumber={gamePhase !== 'HOME' ? roundNumber : undefined}
        showBackHome={gamePhase !== 'HOME'}
        onBackHome={handleBackHome}
      />

      {/* Main Screen Views */}
      <main className="flex-1 flex flex-col items-center justify-start w-full relative">
        {gamePhase === 'HOME' && (
          <HomeScreen
            language={settings.language}
            roundNumber={roundNumber}
            onStartGame={() => setGamePhase('SETUP')}
            onOpenAlbum={() => setGamePhase('ALBUM')}
            onOpenRules={() => setShowRulesModal(true)}
            onOpenLibrary={() => setShowLibraryModal(true)}
            onOpenEasterEgg={() => setShowEasterEggModal(true)}
          />
        )}

        {gamePhase === 'SETUP' && (
          <SetupScreen
            language={settings.language}
            players={players}
            settings={settings}
            pastAssistant={pastAssistant}
            onClearPastAssistant={() => {
              storageService.setPastAssistant(null);
              setPastAssistant(null);
            }}
            onUpdatePlayers={handleUpdatePlayers}
            onUpdateSettings={handleUpdateSettings}
            onStartGame={handleStartRound}
          />
        )}

        {gamePhase === 'PHOTO_PROMPT' && (
          <PhotoPromptScreen
            language={settings.language}
            roundNumber={roundNumber}
            onTakePhoto={() => setGamePhase('CAMERA')}
            onSkipPhoto={() => setGamePhase('CARD_DISTRIBUTION')}
          />
        )}

        {gamePhase === 'CAMERA' && (
          <CameraScreen
            language={settings.language}
            roundNumber={roundNumber}
            players={activeGamePlayers}
            imposterCount={imposterPlayers.length}
            onSavePhotoAndContinue={handleSavePhotoAndProceed}
            onCancel={() => setGamePhase('CARD_DISTRIBUTION')}
          />
        )}

        {gamePhase === 'CARD_DISTRIBUTION' && secretWord && category && (
          <CardDistributionScreen
            language={settings.language}
            players={activeGamePlayers}
            secretWord={secretWord}
            category={category}
            assignedHint={assignedHint}
            assistantPlayer={settings.assistantEnabled ? assistantPlayer : null}
            assistantEnabled={settings.assistantEnabled}
            imposterPlayers={imposterPlayers}
            onFinishDistribution={handleFinishCardDistribution}
          />
        )}

        {gamePhase === 'INVESTIGATION' && (
          <InvestigationScreen
            language={settings.language}
            roundNumber={roundNumber}
            durationSeconds={settings.durationSeconds}
            onGoToVoting={() => setGamePhase('VOTING')}
            onOpenRules={() => setShowRulesModal(true)}
            onSaveRecording={handleSaveRecording}
          />
        )}

        {gamePhase === 'VOTING' && (
          <VotingScreen
            language={settings.language}
            activePlayers={activeSuspects}
            onConfirmElimination={handleConfirmElimination}
          />
        )}

        {gamePhase === 'REVEAL_ELIMINATION' && currentEliminatedSuspect && (
          <RevealEliminationScreen
            language={settings.language}
            suspectPlayer={currentEliminatedSuspect}
            remainingImposterCount={activeSuspects.filter((p) => p.isImposter).length}
            onImpostersWin={handleImpostersWin}
            onNextVote={handleNextVote}
            onFinalGuess={handleProceedToFinalGuess}
          />
        )}

        {gamePhase === 'FINAL_GUESS' && secretWord && category && (
          <FinalGuessScreen
            language={settings.language}
            lastImposter={currentEliminatedSuspect || imposterPlayers[0]}
            secretWord={secretWord}
            category={category}
            onFinalGuessResult={handleFinalGuessResult}
          />
        )}

        {gamePhase === 'GAME_OVER' && secretWord && category && (
          <GameOverScreen
            language={settings.language}
            roundNumber={roundNumber}
            winner={winner}
            imposters={imposterPlayers}
            assistant={settings.assistantEnabled ? assistantPlayer : null}
            secretWord={secretWord}
            category={category}
            onPlayAgain={handlePlayAgain}
            onBackHome={handleBackHome}
            onAssistantExposed={handleAssistantExposed}
          />
        )}

        {gamePhase === 'ALBUM' && (
          <AlbumScreen
            language={settings.language}
            photos={photos}
            recordings={recordings}
            history={history}
            onDeletePhoto={(id) => {
              storageService.deletePhoto(id);
              setPhotos(storageService.getPhotos());
            }}
            onDeleteRecording={(id) => {
              storageService.deleteRecording(id);
              setRecordings(storageService.getRecordings());
            }}
            onDeleteHistory={(id) => {
              storageService.deleteHistory(id);
              setHistory(storageService.getHistory());
            }}
            onBack={handleBackHome}
          />
        )}
      </main>

      {/* Rules Modal */}
      {showRulesModal && (
        <RulesModal
          language={settings.language}
          onClose={() => setShowRulesModal(false)}
        />
      )}

      {/* Easter Egg Modal */}
      {showEasterEggModal && (
        <NarcissisticModal
          language={settings.language}
          onClose={() => setShowEasterEggModal(false)}
        />
      )}

      {/* Library Modal */}
      {showLibraryModal && (
        <LibraryModal
          language={settings.language}
          customWordsCount={customWords.length}
          onAddCustomWord={(word, categoryId) => {
            const result = storageService.addCustomWord(word, categoryId);
            if (result.success) {
              setCustomWords(storageService.getCustomWords());
            }
            return result;
          }}
          onClose={() => setShowLibraryModal(false)}
        />
      )}
    </div>
  );
};
