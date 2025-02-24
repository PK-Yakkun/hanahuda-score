export type Role = {
  id: number;
  label: string;
  score: number;
  description?: string;
};

export const roles: Role[] = [
  { id: 1, label: '五光', score: 10, description: '全ての光札を集めた場合' },
  { id: 2, label: '四光', score: 8, description: '光札を4枚集めた場合' },
  { id: 3, label: '雨四光', score: 7, description: '雨の光札を含む4枚の光札を集めた場合' },
  { id: 4, label: '三光', score: 5, description: '光札を3枚集めた場合' },
  { id: 5, label: '花見で一杯', score: 5, description: '桜に幕と盃が揃った場合' },
  { id: 6, label: '月見で一杯', score: 5, description: '芒に幕と盃が揃った場合' },
  { id: 7, label: '猪鹿蝶', score: 5, description: '猪・鹿・蝶の札が揃った場合' },
  { id: 8, label: '赤たん', score: 5, description: '赤短冊を3枚以上集めた場合' },
  { id: 9, label: '青たん', score: 5, description: '青短冊を3枚以上集めた場合' },
  { id: 10, label: 'たね', score: 1, description: '種札を5枚以上集めた場合' },
  { id: 11, label: 'かす', score: 1, description: 'かす札を10枚以上集めた場合' }
]; 