'use client';

import { useEffect, useState } from 'react';
import { MonthPopup } from '@/components/ui/MonthPopup';
import { GameBoard } from '@/features/game/components/GameBoard';
import { MONTHS } from '@/constants/months';
import type { GameState } from '@/types/game';

export default function Game() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [showMonthPopup, setShowMonthPopup] = useState(true);
  const [gameState, setGameState] = useState<GameState>({
    players: [
      { name: "プレイヤー1", score: 0, isParent: true },
      { name: "プレイヤー2", score: 0, isParent: false }
    ],
    currentMonth: 0,
    monthCount: 12,
    koikoiPlayer: null
  });

  // 初回レンダリング時にポップアップを表示
  useEffect(() => {
    setShowMonthPopup(true);
  }, []);

  const handleMonthPopupClose = () => {
    setShowMonthPopup(false);
  };

  // 次の月へ進む処理
  const proceedToNextMonth = () => {
    setGameState(prev => ({
      ...prev,
      currentMonth: prev.currentMonth + 1,
      koikoiPlayer: null // こいこい状態をリセット
    }));
    setShowMonthPopup(true);
  };

  const handleKoikoi = (playerIndex: 0 | 1) => {
    setGameState(prev => ({
      ...prev,
      koikoiPlayer: playerIndex
    }));
  };

  const handleAgari = (playerIndex: 0 | 1) => {
    // TODO: 役選択モーダルを表示する処理を追加
    console.log(`${gameState.players[playerIndex].name}があがりを選択`);
  };

  const handleDraw = () => {
    proceedToNextMonth();
  };

  // こいこい状態の表示
  const getKoikoiStatus = () => {
    if (gameState.koikoiPlayer !== null) {
      return `${gameState.players[gameState.koikoiPlayer].name}がこいこいしています`;
    }
    return null;
  };

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">ゲーム画面</h1>
      
      {/* 月表示 */}
      <div className="text-xl font-medium mb-4 text-center">
        現在の月: {MONTHS[currentMonthIndex]}
      </div>

      {/* こいこい状態の表示 */}
      {getKoikoiStatus() && (
        <div className="text-lg text-yellow-600 font-medium mb-8 text-center">
          {getKoikoiStatus()}
        </div>
      )}

      {/* ゲームボード */}
      <GameBoard
        players={gameState.players}
        onKoikoi={handleKoikoi}
        onAgari={handleAgari}
        onDraw={handleDraw}
      />

      {/* 月切り替えポップアップ */}
      <MonthPopup
        month={MONTHS[currentMonthIndex]}
        isVisible={showMonthPopup}
        onClose={handleMonthPopupClose}
      />
    </main>
  );
} 