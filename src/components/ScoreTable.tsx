// components/ScoreTable.tsx
'use client';

import React, {useState} from 'react';
import { calculateScores } from '../utils/calculateScores';
import { Dice } from '../types/dice';
import { DiceWild } from '../types/wilddice';

interface ScoreTableProps {
  dice: (number|string)[];
  onScoreClick: (category: string, score: number, diceArr: Dice[]) => void;
  savedScores: Map<string, number>;
  unSelected_category?: string[];
}

const ScoreTable: React.FC<ScoreTableProps> = ({ dice, onScoreClick, savedScores, unSelected_category = []}) => {
  const [isOpen, setIsOpen] = useState(false);
  // Create mock Dice objects from the number array
  const mockDice: Dice[] = dice.map((value: number | string, index: number) => {
    const mockDice =
    value === '⭐️'
      ? new DiceWild(index)
      : new Dice(index);
    // Override getScore to return the provided value
    mockDice.getScore = () => typeof value === 'number' ? value : 0; // Assuming 0 for non-number values
    return mockDice;
  });

  const scores = calculateScores(mockDice);

  
  const upperCategories = ['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes'];

  const upperCategoryMax = {
    Ones: 3,
    Twos: 6,
    Threes: 9,
    Fours: 12,
    Fives: 15,
    Sixes: 18,
  };

  // 보너스 대상 카테고리만 필터링
  const availableUpper = upperCategories.filter(cat => !unSelected_category.includes(cat));

  // 현재 점수 합
  const upperSum = availableUpper.reduce((sum, cat) => {
    return sum + (savedScores.get(cat) ?? 0);
  }, 0);

  // 기준 점수 합
  const bonusThreshold = availableUpper.reduce((sum, cat) => {
    return sum + upperCategoryMax[cat as keyof typeof upperCategoryMax];
  }, 0);

  const bonus = upperSum >= bonusThreshold ? 35 : 0;
  const total = Array.from(savedScores.values()).reduce((a, b) => a + b, 0) + bonus;

   return (
    <div className="max-w-md w-full ml-auto sm:mx-auto bg-white rounded-xl shadow-md p-2 sm:p-4 mt-2">
      {/* 모바일 전용 토글 버튼 */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="sm:hidden w-full text-left text-base font-semibold text-gray-800 mb-2"
      >
        {isOpen ? '▼ 점수표 접기' : '▶ 점수표 열기'}
      </button>

      {/* 점수표 본체 */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:block transition-all`}>
        <h2 className="text-xl text-center font-semibold mb-4 hidden sm:block">YachTiFy Score Table</h2>

        <div className="grid grid-cols-2 gap-2 text-sm">
          {/* 점수 항목 렌더링 부분 그대로 유지 */}
          {Object.entries(scores).map(([category, scoreData]) => {
            if (unSelected_category.includes(category)) return null;
            const score = parseInt(Object.keys(scoreData)[0], 10);
            const isUsed = savedScores.has(category);
            const displayScore = isUsed ? savedScores.get(category) : score;

            return (
              <React.Fragment key={category}>
                <div className={`text-gray-700 text-[18px] ${isUsed ? 'opacity-50' : ''}`}>{category}</div>
                <div className="relative group">
                  <div
                    className={
                      `text-right ` +
                      (isUsed
                        ? 'text-red-500 text-[18px] cursor-not-allowed opacity-80 '
                        : displayScore === 0
                          ? 'text-gray-400 text-[18px] cursor-pointer hover:text-blue-400'
                          : 'text-gray-900 text-[18px] cursor-pointer hover:text-blue-600')
                    }
                    onClick={() => {
                      if (!isUsed) onScoreClick(category, score, scoreData[score]);
                    }}
                  >
                    {displayScore}
                  </div>

                  {displayScore === 0 && !isUsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded shadow hidden group-hover:block whitespace-nowrap">
                      0점입니다
                    </div>
                  )}
                </div>
                {category === 'Sixes' && (
                  <>
                    <hr className="col-span-2 border-gray-400 " />
                    <div className="font-medium text-gray-700 text-[18px]">+Bonus</div>
                    <div className={`font-bold text-right text-[18px] ${bonus === 0 ? 'text-gray-400' : 'text-red-500'}`}>
                      {bonus > 0 ?  ` 🎉${bonus} ` : '-'}
                    </div>
                    <hr className="col-span-2 border-gray-400" />
                  </>
                )}
              </React.Fragment>
            );
          })}

          {/* Total */}
          <hr className="col-span-2 border-gray-400 my-1" />
          <div className="font-medium text-gray-700 text-xl">Total</div>
          <div className="font-bold text-right text-gray-900 text-xl">{total}</div>
        </div>
      </div>
    </div>
  );
};
export default ScoreTable;
