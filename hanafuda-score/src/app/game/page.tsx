'use client';

import { useEffect, useState } from 'react';
import { MonthPopup } from '@/components/ui/MonthPopup';
import { MONTHS } from '@/constants/months';

export default function Game() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [showMonthPopup, setShowMonthPopup] = useState(true);

  // 初回レンダリング時にポップアップを表示
  useEffect(() => {
    setShowMonthPopup(true);
  }, []);

  const handleMonthPopupClose = () => {
    setShowMonthPopup(false);
  };

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">ゲーム画面</h1>
      
      {/* 月表示 */}
      <div className="text-xl font-medium mb-8">
        現在の月: {MONTHS[currentMonthIndex]}
      </div>

      {/* TODO: プレイヤー情報や得点表示などの実装 */}

      {/* 月切り替えポップアップ */}
      <MonthPopup
        month={MONTHS[currentMonthIndex]}
        isVisible={showMonthPopup}
        onClose={handleMonthPopupClose}
      />
    </main>
  );
} 