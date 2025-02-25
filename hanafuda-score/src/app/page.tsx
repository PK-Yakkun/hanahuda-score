'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { PlayerNameInput } from '@/features/game/components/PlayerNameInput';
import { GameSetupInput } from '@/features/game/components/GameSetupInput';

type GameSetupStep = 'players' | 'setup';

export default function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<GameSetupStep>('players');
  const [players, setPlayers] = useState<{ player1: string; player2: string } | null>(null);

  const handlePlayerNames = (player1: string, player2: string) => {
    setPlayers({ player1, player2 });
    setStep('setup');
  };

  const handleGameSetup = (monthCount: 3 | 6 | 12, parentPlayer: string) => {
    // TODO: ゲーム設定を保存する処理を実装
    setIsModalOpen(false);
    router.push('/game');
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setStep('players');
    setPlayers(null);
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
        ) : players && (
          <GameSetupInput
            player1={players.player1}
            player2={players.player2}
            onSubmit={handleGameSetup}
          />
        )}
      </Modal>
    </main>
  );
} 