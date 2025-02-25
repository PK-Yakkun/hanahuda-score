import { Player } from '@/types/game';

type GameBoardProps = {
  players: [Player, Player];
  onKoikoi: (playerIndex: 0 | 1) => void;
  onAgari: (playerIndex: 0 | 1) => void;
  onDraw: () => void;
};

/**
 * ゲームボードコンポーネント
 * プレイヤー情報、得点、各種ボタンを表示
 */
export const GameBoard = ({
  players,
  onKoikoi,
  onAgari,
  onDraw
}: GameBoardProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* プレイヤー1（上側） */}
      <div className="order-2 md:order-1 flex flex-col items-center space-y-4 p-6 border rounded-lg">
        <h2 className="text-2xl font-bold">{players[0].name}</h2>
        <p className="text-3xl font-bold">{players[0].score}点</p>
        <div className="flex space-x-4">
          <button
            onClick={() => onKoikoi(0)}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
          >
            こいこい
          </button>
          <button
            onClick={() => onAgari(0)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            あがり
          </button>
        </div>
      </div>

      {/* 中央の引き分けボタン */}
      <div className="order-1 md:order-2 col-span-1 md:col-span-2 flex justify-center">
        <button
          onClick={onDraw}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
        >
          引き分け
        </button>
      </div>

      {/* プレイヤー2（下側） */}
      <div className="order-3 flex flex-col items-center space-y-4 p-6 border rounded-lg">
        <h2 className="text-2xl font-bold">{players[1].name}</h2>
        <p className="text-3xl font-bold">{players[1].score}点</p>
        <div className="flex space-x-4">
          <button
            onClick={() => onKoikoi(1)}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
          >
            こいこい
          </button>
          <button
            onClick={() => onAgari(1)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            あがり
          </button>
        </div>
      </div>
    </div>
  );
}; 