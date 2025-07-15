// components/ScoreTable.tsx
'use client';

import React from 'react';
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
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">🎲 Yacht Dice 점수표</h2>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {Object.entries(scores).map(([category, scoreData]) => {
        if (unSelected_category.includes(category)) return null; // 제외
        const score = parseInt(Object.keys(scoreData)[0], 10);
        const isUsed = savedScores.has(category);
        // 저장된 점수는 savedScores에서, 아니면 계산된 점수 사용
        const displayScore = isUsed ? savedScores.get(category) : score;
        const total = Array.from(savedScores.values()).reduce((a, b) => a + b, 0) + bonus;

  return (
    <React.Fragment key={category}>
      <div className={`font-medium text-gray-700 ${isUsed ? 'opacity-50' : ''}`}>{category}</div>
      <div className="relative group">
        <div
          className={
            `text-right font-bold ` +
            (isUsed
              ? 'text-red-500 cursor-not-allowed opacity-80'
              : displayScore === 0
                ? 'text-gray-400 cursor-pointer hover:text-blue-400'
                : 'text-gray-900 cursor-pointer hover:text-blue-600')
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
          <hr className="col-span-2 border-gray-400" />
          <div className="font-medium text-gray-700">+Bonus</div>
          <div className={`font-bold text-right ${bonus === 0 ? 'text-gray-400' : 'text-red-500'}`}>
            {bonus > 0 ?  ` 🎉${bonus} ` : '-'}
          </div>
          <hr className="col-span-2 border-gray-400" />
        </>
      )}
    </React.Fragment>
  );
})}

 {/* Total 표시 */}
        <hr className="col-span-2 border-gray-400 my-1" />
        <div className="font-medium text-gray-700 text-xl">Total</div>
        <div className="font-bold text-right text-gray-900 text-xl">{total}</div>
      </div>
    </div>

  );
};
export default ScoreTable;
