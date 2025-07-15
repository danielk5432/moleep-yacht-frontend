'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const good_data = [
  { option: '456Dice', image: { uri: '/images/456_dice_only.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } },
  { option: 'OneMoreDice', image: { uri: '/images/onemore_dice_only.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } },
  { option: 'HighDice', image: { uri: '/images/high_dice_only.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } },
  { option: 'WildDice', image: { uri: '/images/wild_dice_only.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } },
];

const MAX_TOTAL = 4;

const GoodDiceSelectionPage: React.FC = () => {
  const router = useRouter();

  // 기본값: 각 주사위 1개
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(good_data.map(d => [d.option, 0]))
  );

  const totalSelected = Object.values(counts).reduce((a, b) => a + b, 0);

  const handleChange = (option: string, delta: number) => {
    setCounts(prev => {
      const newCount = prev[option] + delta;
      const nextTotal = totalSelected + delta;

      if (newCount < 0 || newCount > MAX_TOTAL || nextTotal > MAX_TOTAL) return prev;

      return { ...prev, [option]: newCount };
    });
  };

  const handleStart = () => {
    localStorage.setItem('goodDiceSelection', JSON.stringify(counts));
    router.push('/dice');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50" style={{ fontFamily: 'DungGeunMo' }}>
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">주사위 구성 선택</h2>
        <p className="text-sm text-gray-600 text-center mb-6">※ 총 4개의 주사위를 선택해야 합니다.</p>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {good_data.map(({ option, image }) => (
            <div key={option} className="flex flex-col items-center bg-gray-50 rounded-lg p-4 shadow">
              <Image src={image.uri} width={80} height={80} alt={option} className="mb-2" />
              <div className="font-semibold mb-2">{option}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleChange(option, -1)}
                  className="px-3 py-0.5 text-lg rounded bg-gray-200 hover:bg-gray-300"
                >−</button>
                <span className="text-lg font-medium"> {counts[option]} </span>
                <button
                  onClick={() => handleChange(option, 1)}
                  className="px-3 py-0.5 text-lg rounded bg-gray-200 hover:bg-gray-300"
                >+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-gray-600 mb-4">
          총 선택: <strong>{totalSelected}</strong> / {MAX_TOTAL}
        </div>

        <button
          onClick={handleStart}
          disabled={totalSelected !== MAX_TOTAL}
          className={`w-full py-2 rounded-md text-white font-semibold transition
            ${totalSelected === MAX_TOTAL ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-400 cursor-not-allowed'}
          `}
        >
          게임 시작
        </button>
      </div>
    </div>
  );
};

export default GoodDiceSelectionPage;
