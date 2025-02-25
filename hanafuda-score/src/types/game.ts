export type Player = {
  name: string;
  score: number;
  isParent: boolean;
};

export type GameState = {
  players: [Player, Player];  // 必ず2人のプレイヤー
  currentMonth: number;
  monthCount: 3 | 6 | 12;
  koikoiPlayer: number | null; // こいこいを行ったプレイヤーのインデックス
}; 