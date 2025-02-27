import { Modal } from '@/components/ui/Modal';
import { roles, Role } from '@/constants/roles';
import { useState } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

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
  const [additionalCounts, setAdditionalCounts] = useState<Record<number, number>>({});

  const handleRoleToggle = (role: Role) => {
    const roleId = role.id;
    const roleExists = selectedRoles.includes(roleId);

    if (roleExists) {
      setSelectedRoles(prev => prev.filter(id => id !== roleId));
      if (role.countable) {
        setAdditionalCounts(prev => {
          const newCounts = { ...prev };
          delete newCounts[roleId];
          return newCounts;
        });
      }
    } else {
      setSelectedRoles(prev => [...prev, roleId]);
      if (role.countable) {
        setAdditionalCounts(prev => ({
          ...prev,
          [roleId]: 0
        }));
      }
    }
  };

  const handleCountChange = (roleId: number, increment: boolean) => {
    setAdditionalCounts(prev => {
      const currentCount = prev[roleId] || 0;
      return {
        ...prev,
        [roleId]: increment ? currentCount + 1 : Math.max(0, currentCount - 1)
      };
    });
  };

  const calculateScore = () => {
    return selectedRoles.reduce((total, roleId) => {
      const role = roles.find(r => r.id === roleId);
      if (!role) return total;

      if (role.countable) {
        const count = additionalCounts[roleId] || 0;
        return total + role.baseScore + (count * (role.perCount || 0));
      }

      return total + role.baseScore;
    }, 0);
  };

  const calculateMultiplier = (baseScore: number) => {
    let multiplier = 1;
    if (isKoikoi) multiplier *= 2;
    if (baseScore >= 7) multiplier *= 2;
    return multiplier;
  };

  const calculateFinalScore = () => {
    const baseScore = calculateScore();
    return baseScore * calculateMultiplier(baseScore);
  };

  const handleSubmit = () => {
    const baseScore = calculateScore();
    onSubmit(baseScore);
    setSelectedRoles([]);
    setAdditionalCounts({});
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
            <div
              key={role.id}
              className="space-y-2"
            >
              <button
                onClick={() => handleRoleToggle(role)}
                className={`
                  w-full p-2 rounded-md text-sm text-left
                  ${selectedRoles.includes(role.id)
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }
                `}
              >
                <div>{role.label}</div>
                <div className="text-xs">{role.baseScore}点</div>
              </button>

              {/* 枚数カウンター */}
              {role.countable && selectedRoles.includes(role.id) && (
                <div className="flex items-center justify-between px-2">
                  <button
                    onClick={() => handleCountChange(role.id, false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="text-sm">
                    {selectedRoles.includes(role.id) ? (additionalCounts[role.id] || 0) : 0}枚
                  </span>
                  <button
                    onClick={() => handleCountChange(role.id, true)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div>
            <div className="text-lg font-bold mb-1">
              合計得点: {calculateFinalScore()}点
            </div>
            <div className="text-xs text-red-600 space-y-0.5">
              {calculateScore() >= 7 && <div>・7点以上: 2倍</div>}
              {isKoikoi && <div>・相手こいこい: 2倍</div>}
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={selectedRoles.length === 0}
            className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300"
          >
            決定
          </button>
        </div>
      </div>
    </Modal>
  );
}; 