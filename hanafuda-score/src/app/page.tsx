'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { PlayerNameInput } from '@/features/game/components/PlayerNameInput';
import { GameSetupInput } from '@/features/game/components/GameSetupInput';
import { useGameStore } from '@/store/gameStore';

type GameSetupStep = 'players' | 'setup';

export default function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<GameSetupStep>('players');
  const { setPlayers, initializeGame } = useGameStore();

  const handlePlayerNames = (player1: string, player2: string) => {
    setPlayers(player1, player2);
    setStep('setup');
  };

  const handleGameSetup = (monthCount: 3 | 6 | 12, parentPlayer: string) => {
    initializeGame(monthCount, parentPlayer);
    setIsModalOpen(false);
    router.push('/game');
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setStep('players');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">花札得点計算</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
      >
        ゲーム開始
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={step === 'players' ? "プレイヤー名の入力" : "ゲーム設定"}
      >
        {step === 'players' ? (
          <PlayerNameInput
            onSubmit={handlePlayerNames}
            onClose={handleModalClose}
          />
        ) : (
          <GameSetupInput
            onSubmit={handleGameSetup}
          />
        )}
      </Modal>
    </main>
  );
} 