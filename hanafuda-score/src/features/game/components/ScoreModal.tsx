import { Modal } from '@/components/ui/Modal';
import { roles, Role } from '@/constants/roles';
import { useState } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

type RoleSelection = {
  roleId: number;
  count: number;
};

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
  const [selectedRoles, setSelectedRoles] = useState<RoleSelection[]>([]);

  const handleRoleToggle = (role: Role) => {
    setSelectedRoles(prev => {
      // 既に選択されている場合は削除
      if (prev.some(r => r.roleId === role.id)) {
        return prev.filter(r => r.roleId !== role.id);
      }

      // 競合する役を削除
      const newSelection = prev.filter(r => 
        !role.conflicts?.includes(r.roleId)
      );

      // 新しい役を追加
      return [...newSelection, { 
        roleId: role.id, 
        count: role.countable ? 0 : 1 
      }];
    });
  };

  const handleCountChange = (roleId: number, increment: boolean) => {
    setSelectedRoles(prev => 
      prev.map(role => 
        role.roleId === roleId
          ? { ...role, count: increment ? role.count + 1 : Math.max(0, role.count - 1) }
          : role
      )
    );
  };

  const calculateBaseScore = () => {
    return selectedRoles.reduce((total, selection) => {
      const role = roles.find(r => r.id === selection.roleId);
      if (!role) return total;

      const countScore = role.countable
        ? selection.count * (role.perCount || 0)
        : role.baseScore;

      return total + countScore;
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
            <div
              key={role.id}
              className="space-y-2"
            >
              <button
                onClick={() => handleRoleToggle(role)}
                className={`
                  w-full p-2 rounded-md text-sm text-left
                  ${selectedRoles.some(r => r.roleId === role.id)
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }
                `}
              >
                <div>{role.label}</div>
                <div className="text-xs">{role.baseScore}点</div>
              </button>

              {/* 枚数カウンター */}
              {role.countable && selectedRoles.some(r => r.roleId === role.id) && (
                <div className="flex items-center justify-between px-2">
                  <button
                    onClick={() => handleCountChange(role.id, false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="text-sm">
                    {selectedRoles.find(r => r.roleId === role.id)?.count || 0}枚
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