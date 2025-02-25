import { create } from 'zustand';
import type { Player, GameState } from '@/types/game';

interface GameStore {
  // プレイヤー情報
  players: [Player, Player] | null;
  setPlayers: (player1Name: string, player2Name: string) => void;
  
  // ゲームの状態
  gameState: GameState | null;
  initializeGame: (monthCount: 3 | 6 | 12, parentPlayer: string) => void;
  updateGameState: (updater: (prev: GameState) => GameState) => void;
  
  // 状態のリセット
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  players: null,
  gameState: null,

  setPlayers: (player1Name, player2Name) => {
    set({
      players: [
        { name: player1Name, score: 0, isParent: false },
        { name: player2Name, score: 0, isParent: false }
      ]
    });
  },

  initializeGame: (monthCount, parentPlayer) => {
    set((state) => {
      if (!state.players) return state;

      const players: [Player, Player] = state.players.map(player => ({
        ...player,
        score: 0,
        isParent: player.name === parentPlayer
      })) as [Player, Player];

      return {
        gameState: {
          players,
          currentMonth: 0,
          monthCount,
          koikoiPlayers: [false, false]
        }
      };
    });
  },

  updateGameState: (updater) => {
    set((state) => ({
      gameState: state.gameState ? updater(state.gameState) : null
    }));
  },

  resetGame: () => {
    set({
      gameState: null
    });
  }
})); 