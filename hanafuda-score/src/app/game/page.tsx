'use client';

import { useEffect, useState } from 'react';
import { MonthPopup } from '@/components/ui/MonthPopup';
import { GameBoard } from '@/features/game/components/GameBoard';
import { ScoreModal } from '@/features/game/components/ScoreModal';
import { MONTHS } from '@/constants/months';
import type { GameState, Player } from '@/types/game';

export default function Game() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [showMonthPopup, setShowMonthPopup] = useState(true);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [scoringPlayerIndex, setScoringPlayerIndex] = useState<0 | 1 | null>(null);
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
    const nextMonthIndex = currentMonthIndex + 1;
    setCurrentMonthIndex(nextMonthIndex);
    setGameState(prev => ({
      ...prev,
      currentMonth: nextMonthIndex,
      koikoiPlayer: null
    }));
    // 少し遅延を入れてポップアップを表示（前のポップアップとの重複を避ける）
    setTimeout(() => {
      setShowMonthPopup(true);
    }, 100);
  };

  const handleKoikoi = (playerIndex: 0 | 1) => {
    setGameState(prev => ({
      ...prev,
      koikoiPlayer: playerIndex
    }));
  };

  const handleAgari = (playerIndex: 0 | 1) => {
    setScoringPlayerIndex(playerIndex);
    setShowScoreModal(true);
  };

  const handleDraw = () => {
    proceedToNextMonth();
  };

  // 得点計算と更新
  const calculateFinalScore = (baseScore: number, playerIndex: 0 | 1) => {
    let multiplier = 1;

    // こいこいによる2倍
    if (gameState.koikoiPlayer !== null) {
      multiplier *= 2;
    }

    // 7点以上による2倍
    if (baseScore >= 7) {
      multiplier *= 2;
    }

    return baseScore * multiplier;
  };

  const handleScoreSubmit = (baseScore: number) => {
    if (scoringPlayerIndex === null) return;

    const finalScore = calculateFinalScore(baseScore, scoringPlayerIndex);

    // 得点を更新
    setGameState(prev => ({
      ...prev,
      players: prev.players.map((player, index) => ({
        ...player,
        score: index === scoringPlayerIndex 
          ? player.score + finalScore 
          : player.score
      })) as [Player, Player]
    }));

    // モーダルを閉じて次の月へ
    setShowScoreModal(false);
    setScoringPlayerIndex(null);
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

      {/* 役選択モーダル */}
      <ScoreModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        onSubmit={handleScoreSubmit}
        isKoikoi={gameState.koikoiPlayer !== null}
      />
    </main>
  );
} 