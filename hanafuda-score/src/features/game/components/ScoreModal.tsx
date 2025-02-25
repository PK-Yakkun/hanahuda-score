import { Modal } from '@/components/ui/Modal';
import { roles } from '@/constants/roles';
import { useState } from 'react';

type ScoreModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (baseScore: number) => void;
  isKoikoi: boolean;
};

export const ScoreModal = ({
  isOpen,
  onClose,
  onSubmit,
  isKoikoi
}: ScoreModalProps) => {
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const handleRoleToggle = (roleId: number) => {
    setSelectedRoles(prev => 
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const calculateBaseScore = () => {
    return selectedRoles.reduce((total, roleId) => {
      const role = roles.find(r => r.id === roleId);
      return total + (role?.score || 0);
    }, 0);
  };

  const handleSubmit = () => {
    const baseScore = calculateBaseScore();
    onSubmit(baseScore);
    setSelectedRoles([]); // 選択をリセット
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="役の選択"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => handleRoleToggle(role.id)}
              className={`
                p-2 rounded-md text-sm text-left
                ${selectedRoles.includes(role.id)
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
              `}
            >
              <div>{role.label}</div>
              <div className="text-xs">{role.score}点</div>
            </button>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="text-lg font-bold mb-2">
            合計得点: {calculateBaseScore()}点
            {isKoikoi && <span className="text-red-600">（こいこいによる2倍）</span>}
            {calculateBaseScore() >= 7 && <span className="text-red-600">（7点以上による2倍）</span>}
          </div>
          <button
            onClick={handleSubmit}
            disabled={selectedRoles.length === 0}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300"
          >
            決定
          </button>
        </div>
      </div>
    </Modal>
  );
}; 