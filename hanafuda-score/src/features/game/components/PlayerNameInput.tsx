import { useState } from 'react';

type PlayerNameInputProps = {
  onSubmit: (player1: string, player2: string) => void;
  onClose: () => void;
};

export const PlayerNameInput = ({ onSubmit, onClose }: PlayerNameInputProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && player1) {
      setStep(2);
    } else if (step === 2 && player2) {
      onSubmit(player1, player2);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        {step === 2 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">操作者</p>
            <p className="text-lg font-medium">{player1}</p>
          </div>
        )}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {step === 1 ? '操作者の名前を入力してください' : '対戦相手の名前を入力してください'}
        </label>
        <input
          type="text"
          value={step === 1 ? player1 : player2}
          onChange={(e) => step === 1 ? setPlayer1(e.target.value) : setPlayer2(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          maxLength={10}
          autoFocus
          placeholder={step === 1 ? "操作者の名前" : "対戦相手の名前"}
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={step === 1 ? !player1 : !player2}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {step === 1 ? '次へ' : '決定'}
        </button>
      </div>
    </form>
  );
}; 