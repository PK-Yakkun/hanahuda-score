import { Player } from '@/types/game';

type GameBoardProps = {
  players: [Player, Player];
  onKoikoi: (playerIndex: number) => void;
  onAgari: (playerIndex: number) => void;
  onDraw: () => void;
  koikoiPlayers: boolean[];
};

/**
 * ゲームボードコンポーネント
 * プレイヤー情報、得点、各種ボタンを表示
 */
export const GameBoard = ({
  players,
  onKoikoi,
  onAgari,
  onDraw,
  koikoiPlayers,
  currentMonth
}: GameBoardProps & { currentMonth: number }) => {
  // 親の判定（月が偶数か奇数かで親が変わる）
  const isParent = (index: number) => {
    const isFirstPlayerParent = currentMonth % 2 === 0;
    return index === 0 ? isFirstPlayerParent : !isFirstPlayerParent;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {players.map((player, index) => (
        <div
          key={index}
          className="p-4 rounded-lg bg-white shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-bold">{player.name}</div>
            {isParent(index) && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white text-sm">
                親
              </div>
            )}
          </div>
          <div className="text-lg mb-4">得点: {player.score}</div>
          <div className="space-x-2">
            <button
              onClick={() => onKoikoi(index)}
              className={`px-4 py-2 rounded-md ${
                koikoiPlayers[index]
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              }`}
              disabled={koikoiPlayers[index]}
            >
              こいこい
            </button>
            <button
              onClick={() => onAgari(index)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              あがり
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={onDraw}
        className="col-span-1 md:col-span-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
      >
        引き分け
      </button>
    </div>
  );
}; 