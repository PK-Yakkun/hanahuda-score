export type Player = {
  name: string;
  score: number;
  isParent: boolean;
};

export type GameState = {
  players: [Player, Player];  // 必ず2人のプレイヤー
  currentMonth: number;
  monthCount: 3 | 6 | 12;
  koikoiPlayers: boolean[]; // [プレイヤー1のこいこい状態, プレイヤー2のこいこい状態]
}; 