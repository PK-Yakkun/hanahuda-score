'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { PlayerNameInput } from '@/features/game/components/PlayerNameInput';
import { GameSetupInput } from '@/features/game/components/GameSetupInput';

export default function Result() {
  const router = useRouter();
  const { gameState, players, resetGame, initializeGame, setPlayers } = useGameStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<'players' | 'setup'>('players');

  // gameStateがない場合はトップページにリダイレクト
  if (!gameState) {
    router.push('/');
    return null;
  }

  // 勝者を判定
  const winner = gameState.players[0].score > gameState.players[1].score
    ? gameState.players[0]
    : gameState.players[1];

  const isDraw = gameState.players[0].score === gameState.players[1].score;

  const handleRestart = () => {
    if (players) {
      setStep('setup');
      setIsModalOpen(true);
    } else {
      router.push('/');
    }
  };

  const handlePlayerNamesSubmit = (player1: string, player2: string) => {
    // プレイヤー名を設定
    resetGame(); // 前回のゲーム状態をリセット
    setPlayers(player1, player2); // プレイヤー名を設定
    setStep('setup');
  };

  const handleGameSetup = (monthCount: 3 | 6 | 12, parentPlayer: string) => {
    // ゲーム設定を初期化
    initializeGame(monthCount, parentPlayer);
    setIsModalOpen(false);
    router.push('/game');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">ゲーム終了</h1>

        {/* 勝敗結果 */}
        <div className="text-center mb-8">
          {isDraw ? (
            <p className="text-2xl font-bold text-gray-700">引き分け</p>
          ) : (
            <p className="text-2xl font-bold text-red-600">
              {winner.name}の勝利！
            </p>
          )}
        </div>

        {/* スコア表示 */}
        <div className="space-y-4 mb-12">
          {gameState.players.map((player, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
            >
              <span className="text-lg font-medium">{player.name}</span>
              <span className="text-2xl font-bold">{player.score}点</span>
            </div>
          ))}
        </div>

        {/* アクションボタン */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              resetGame();
              router.push('/');
            }}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            TOPへ戻る
          </button>
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            再戦
          </button>
        </div>
      </div>

      {/* 再戦用モーダル */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={step === 'players' ? "プレイヤー名の入力" : "ゲーム設定"}
      >
        {step === 'players' ? (
          <PlayerNameInput
            onSubmit={handlePlayerNamesSubmit}
            onClose={() => setIsModalOpen(false)}
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