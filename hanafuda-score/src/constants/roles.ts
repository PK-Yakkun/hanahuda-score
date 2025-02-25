// 役の種類を定義
export type RoleType = 'light' | 'seed' | 'ribbon' | 'basic';

// 役の定義
export type Role = {
  id: number;
  label: string;
  baseScore: number;
  type: RoleType;
  countable?: boolean;  // 枚数カウントが必要な役か
  perCount?: number;    // 1枚あたりの加算点
  conflicts?: number[]; // 同時に成立しない役のID
};

// 役一覧
export const roles: Role[] = [
  { id: 1, label: '五光', baseScore: 10, type: 'light', conflicts: [2, 3, 4] },
  { id: 2, label: '四光', baseScore: 8, type: 'light', conflicts: [1, 3, 4] },
  { id: 3, label: '雨四光', baseScore: 7, type: 'light', conflicts: [1, 2, 4] },
  { id: 4, label: '三光', baseScore: 5, type: 'light', conflicts: [1, 2, 3] },
  { id: 5, label: '花見で一杯', baseScore: 5, type: 'basic' },
  { id: 6, label: '月見で一杯', baseScore: 5, type: 'basic' },
  { id: 7, label: '猪鹿蝶', baseScore: 5, type: 'seed' },
  { id: 8, label: '赤たん', baseScore: 1, type: 'ribbon', countable: true, perCount: 1 },
  { id: 9, label: '青たん', baseScore: 1, type: 'ribbon', countable: true, perCount: 1 },
  { id: 10, label: 'たね', baseScore: 1, type: 'seed', countable: true, perCount: 1 },
  { id: 11, label: 'かす', baseScore: 1, type: 'basic', countable: true, perCount: 1 }
]; 