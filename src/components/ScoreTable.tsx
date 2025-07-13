// components/ScoreTable.tsx
'use client';

import React from 'react';
import { calculateScores } from '../utils/calculateScores';
import { Dice } from '../types/dice';

interface ScoreTableProps {
  dice: number[];
  onScoreClick: (category: string, score: number, diceArr: Dice[]) => void;
  savedScores: Map<string, number>;
  unSelected_category?: string[];
}

const ScoreTable: React.FC<ScoreTableProps> = ({ dice, onScoreClick, savedScores, unSelected_category = []}) => {
  // Create mock Dice objects from the number array
  const mockDice: Dice[] = dice.map((value, index) => {
    const mockDice = new Dice(index);
    // Override getScore to return the provided value
    mockDice.getScore = () => value;
    return mockDice;
  });

  const scores = calculateScores(mockDice);

  

  const upperCategories = ['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes'];
    const upperSum = upperCategories.reduce((sum, cat) => {
    // 저장된 점수 있으면 그 값, 없으면 0
    return sum + (savedScores.get(cat) ?? 0);
    }, 0);
    const bonus = upperSum >= 63 ? 35 : 0;
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
      <div
        className={
          `text-right font-bold ` +
          (isUsed
            ? 'text-red-500 cursor-not-allowed opacity-80'
            : 'text-gray-900 cursor-pointer hover:text-blue-600')
        }
        onClick={() => {
          if (!isUsed) onScoreClick(category, score, scoreData[score]);
        }}
      >
        {displayScore}
      </div>
      {category === 'Sixes' && (
        <>
          <hr className="col-span-2 border-gray-400" />
          <div className="font-medium text-gray-700">+Bonus</div>
          <div className="font-bold text-right text-gray-900">{bonus} {upperSum >= 63 ? '🎉' : ''}</div>
          <hr className="col-span-2 border-gray-400" />
        </>
      )}
    </React.Fragment>
    
  );
})}

 {/* Total 표시 */}
        <hr className="col-span-2 border-gray-400 my-1" />
        <div className="font-medium text-gray-700">Total</div>
        <div className="font-bold text-right text-gray-900">{total}</div>
      </div>
    </div>

  );
};

export default ScoreTable;
