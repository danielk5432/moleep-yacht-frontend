'use client';

import React, { useState } from 'react';
import DiceRoulette from '@/components/DiceRoulette'; // 룰렛 컴포넌트 경로

const MainPage: React.FC = () => {
  // 1. 룰렛 결과를 저장할 state를 부모 페이지에 만듭니다.
  const [rouletteResult, setRouletteResult] = useState<string | null>(null);

  // 2. 자식(룰렛)이 호출할 함수입니다. 이 함수는 state를 업데이트합니다.
  const handleRouletteResult = (result: string) => {
    console.log('룰렛 결과가 도착했습니다:', result);
    setRouletteResult(result);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-black-200 p-24">
      <h1 className="text-4xl font-bold mb-8">메인 페이지</h1>
      
      {/* 3. 룰렛 컴포넌트를 불러오고, props로 함수를 전달합니다. */}
      <DiceRoulette onResult={handleRouletteResult} />

      <div className="mt-12 p-6 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">룰렛 결과 표시</h2>
        {rouletteResult ? (
          <p className="text-xl mt-4">
            최종 결과: <span className="font-bold text-red-500">{rouletteResult}</span>
          </p>
        ) : (
          <p className="text-gray-500 mt-4">아직 룰렛을 돌리지 않았습니다.</p>
        )}
      </div>
    </main>
  );
};

export default MainPage;