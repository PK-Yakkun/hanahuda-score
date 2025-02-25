'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { PlayerNameInput } from '@/features/game/components/PlayerNameInput';

export default function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlayerNames = (player1: string, player2: string) => {
    // TODO: プレイヤー名を保存する処理を実装
    setIsModalOpen(false);
    router.push('/game/setup');
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
        onClose={() => setIsModalOpen(false)}
        title="プレイヤー名の入力"
      >
        <PlayerNameInput
          onSubmit={handlePlayerNames}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </main>
  );
} 