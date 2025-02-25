import { useEffect, useState } from 'react';

type MonthPopupProps = {
  month: string;
  isVisible: boolean;
  onClose: () => void;
};

/**
 * 月名表示用のポップアップコンポーネント
 * @param month 表示する月名
 * @param isVisible 表示状態
 * @param onClose 閉じる時のコールバック
 */
export const MonthPopup = ({ month, isVisible, onClose }: MonthPopupProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // 2秒後に非表示にする
      const timer = setTimeout(() => {
        setIsAnimating(false);
        // フェードアウトアニメーション後にonCloseを呼び出す
        setTimeout(onClose, 500);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className={`
          bg-white/90 px-12 py-8 rounded-lg shadow-lg
          transition-opacity duration-500
          ${isAnimating ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <p className="text-4xl font-bold text-gray-900">{month}</p>
      </div>
    </div>
  );
}; 