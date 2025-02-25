import { useState } from 'react';

type GameSetupInputProps = {
  player1: string;
  player2: string;
  onSubmit: (monthCount: 3 | 6 | 12, parentPlayer: string) => void;
};

export const GameSetupInput = ({ player1, player2, onSubmit }: GameSetupInputProps) => {
  const [monthCount, setMonthCount] = useState<3 | 6 | 12 | null>(null);
  
  const handleParentSelect = (parentPlayer: string) => {
    if (monthCount) {
      onSubmit(monthCount, parentPlayer);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">何ヶ月戦にしますか？</h3>
        <div className="grid grid-cols-3 gap-3">
          {[3, 6, 12].map((count) => (
            <button
              key={count}
              onClick={() => setMonthCount(count as 3 | 6 | 12)}
              className={`
                py-2 px-4 rounded-md text-center
                ${monthCount === count
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {count}ヶ月
            </button>
          ))}
        </div>
      </div>

      {monthCount && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">親を選択してください</h3>
          <div className="grid grid-cols-2 gap-3">
            {[player1, player2].map((player) => (
              <button
                key={player}
                onClick={() => handleParentSelect(player)}
                className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
              >
                {player}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 