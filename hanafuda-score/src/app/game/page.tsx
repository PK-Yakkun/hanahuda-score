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
  const { gameState, updateGameState } = useGameStore();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [showMonthPopup, setShowMonthPopup] = useState(true);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [scoringPlayerIndex, setScoringPlayerIndex] = useState<0 | 1 | null>(null);

  // 初回レンダリング時にポップアップを表示
  useEffect(() => {
    setShowMonthPopup(true);
  }, []);

  // gameStateがnullの場合はトップページにリダイレクト
  useEffect(() => {
    if (!gameState) {
      router.push('/');
      return;
    }
  }, [gameState, router]);

  // gameStateがnullの場合はnullを返す
  if (!gameState) return null;

  // ゲーム終了判定を修正
  const isGameEnd = currentMonthIndex === (gameState?.monthCount || 12) - 1;

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
      koikoiPlayers: [false, false] // 両プレイヤーのこいこい状態をリセット
    }));

    setTimeout(() => {
      setShowMonthPopup(true);
    }, 100);
  };

  const handleKoikoi = (playerIndex: number) => {
    updateGameState((prev: GameState) => ({
      ...prev,
      koikoiPlayers: prev.koikoiPlayers.map((state, index) => 
        index === playerIndex ? true : state
      )
    }));
  };

  const handleAgari = (playerIndex: number) => {
    setScoringPlayerIndex(playerIndex as 0 | 1);
    setShowScoreModal(true);
  };

  const handleDraw = () => {
    proceedToNextMonth();
  };

  // 得点計算と更新
  const calculateFinalScore = (baseScore: number, playerIndex: 0 | 1) => {
    let multiplier = 1;

    // こいこいによる2倍（相手プレイヤーがこいこいしていた場合のみ）
    const opponentIndex = playerIndex === 0 ? 1 : 0;
    if (gameState.koikoiPlayers[opponentIndex]) {
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
    const koikoiPlayers = gameState.players.filter((_, index) => 
      gameState.koikoiPlayers[index]
    );

    if (koikoiPlayers.length > 0) {
      return koikoiPlayers.map(player => 
        `${player.name}がこいこいしています`
      ).join('、');
    }
    return null;
  };

  // 結果画面への遷移を更新
  const navigateToResult = () => {
    router.push('/result');
  };

  return (
    <main className="min-h-screen p-4">
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
        koikoiPlayers={gameState.koikoiPlayers}
        currentMonth={currentMonthIndex}
      />

      {/* 月切り替えポップアップ */}
      <MonthPopup
        month={MONTHS[currentMonthIndex]}
        isVisible={showMonthPopup}
        onClose={() => setShowMonthPopup(false)}
      />

      {/* 役選択モーダル */}
      <ScoreModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        onSubmit={handleScoreSubmit}
        isKoikoi={gameState.koikoiPlayers.some(isKoikoi => isKoikoi)}
      />
    </main>
  );
} 