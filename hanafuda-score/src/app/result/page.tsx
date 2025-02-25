'use client';

import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { PlayerNameInput } from '@/features/game/components/PlayerNameInput';
import { GameSetupInput } from '@/features/game/components/GameSetupInput';

type GameResult = {
  players: {
    name: string;
    score: number;
  }[];
};

export default function Result() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { players, resetGame } = useGameStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<'players' | 'setup'>('players');

  // URLパラメータからゲーム結果を取得
  const gameResult: GameResult = {
    players: [
      {
        name: searchParams.get('player1Name') || '',
        score: Number(searchParams.get('player1Score')) || 0
      },
      {
        name: searchParams.get('player2Name') || '',
        score: Number(searchParams.get('player2Score')) || 0
      }
    ]
  };

  // 勝者を判定
  const winner = gameResult.players[0].score > gameResult.players[1].score
    ? gameResult.players[0]
    : gameResult.players[1];

  const isDraw = gameResult.players[0].score === gameResult.players[1].score;

  const handleRestart = () => {
    if (players) {
      setStep('setup');  // 親選択画面から開始
      setIsModalOpen(true);
    } else {
      router.push('/');
    }
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
          {gameResult.players.map((player, index) => (
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={step === 'players' ? "プレイヤー名の入力" : "ゲーム設定"}
      >
        {step === 'players' ? (
          <PlayerNameInput
            onSubmit={(player1, player2) => {
              // Handle player names submission
            }}
            onClose={() => setIsModalOpen(false)}
          />
        ) : (
          <GameSetupInput
            onSubmit={(monthCount, parentPlayer) => {
              // Handle game setup submission
            }}
          />
        )}
      </Modal>
    </main>
  );
} 