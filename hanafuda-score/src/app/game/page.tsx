'use client';

import { useEffect, useState } from 'react';
import { MonthPopup } from '@/components/ui/MonthPopup';
import { GameBoard } from '@/features/game/components/GameBoard';
import { ScoreModal } from '@/features/game/components/ScoreModal';
import { MONTHS } from '@/constants/months';
import type { GameState, Player } from '@/types/game';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';

export default function Game() {
  const router = useRouter();
  const { gameState, updateGameState, resetGame } = useGameStore();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [showMonthPopup, setShowMonthPopup] = useState(true);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [scoringPlayerIndex, setScoringPlayerIndex] = useState<0 | 1 | null>(null);

  // gameStateがnullの場合はトップページにリダイレクト
  useEffect(() => {
    if (!gameState) {
      router.push('/');
    }
  }, [gameState, router]);

  if (!gameState) return null;

  // 初回レンダリング時にポップアップを表示
  useEffect(() => {
    setShowMonthPopup(true);
  }, []);

  const handleMonthPopupClose = () => {
    setShowMonthPopup(false);
  };

  // ゲーム終了判定
  const isGameEnd = currentMonthIndex === 11; // 12月（配列では11）

  // 次の月へ進む処理を更新
  const proceedToNextMonth = () => {
    if (isGameEnd) {
      navigateToResult();
      return;
    }

    const nextMonthIndex = currentMonthIndex + 1;
    setCurrentMonthIndex(nextMonthIndex);
    
    updateGameState((prev: GameState) => ({
      ...prev,
      currentMonth: nextMonthIndex,
      koikoiPlayer: null
    }));

    setTimeout(() => {
      setShowMonthPopup(true);
    }, 100);
  };

  const handleKoikoi = (playerIndex: 0 | 1) => {
    updateGameState((prev: GameState) => ({
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
    if (scoringPlayerIndex === null || !gameState) return;

    const finalScore = calculateFinalScore(baseScore, scoringPlayerIndex);

    // 得点を更新
    updateGameState((prev: GameState) => ({
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

  // 結果画面への遷移を更新
  const navigateToResult = () => {
    const params = new URLSearchParams({
      player1Name: gameState.players[0].name,
      player1Score: gameState.players[0].score.toString(),
      player2Name: gameState.players[1].name,
      player2Score: gameState.players[1].score.toString()
    });
    router.push(`/result?${params.toString()}`);
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