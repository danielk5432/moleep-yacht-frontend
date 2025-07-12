// components/ScoreTable.tsx
'use client';

import React from 'react';
import { calculateScores } from '../utils/calculateScores';
import { Dice } from '../types/dice';

interface ScoreTableProps {
  dice: number[];
  onScoreClick: (category: string, score: number) => void;
  savedScores: Map<string, number>;
}

const ScoreTable: React.FC<ScoreTableProps> = ({ dice, onScoreClick, savedScores}) => {
  // 빈 배열이면 모든 점수를 0으로 표시
  if (dice.length === 0) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4">🎲 Yacht Dice 점수표</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes', 'Choice', 'Four of a Kind', 'Full House', 'Little Straight', 'Big Straight', 'Yacht'].map((category) => (
            <React.Fragment key={category}>
              <div className="font-medium text-gray-700">{category}</div>
              <div className="text-right text-gray-900">0</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  // Create mock Dice objects from the number array
  const mockDice: Dice[] = dice.map((value, index) => {
    const mockDice = new Dice(index);
    // Override getScore to return the provided value
    mockDice.getScore = () => value;
    return mockDice;
  });

  const scores = calculateScores(mockDice);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">🎲 Yacht Dice 점수표</h2>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {Object.entries(scores).map(([category, scoreData]) => {
          const score = parseInt(Object.keys(scoreData)[0], 10);
          const isUsed = savedScores.has(category);
          return (
            <React.Fragment key={category}>
              <div className={`font-medium text-gray-700 ${isUsed ? 'opacity-50' : ''}`}>{category}</div>
              <div
                className={`text-right text-gray-900 cursor-pointer hover:text-blue-600 ${isUsed ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isUsed && onScoreClick(category, score)}
              >
                {score}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ScoreTable;
