// components/ScoreTable.tsx
'use client';

import React from 'react';
import { calculateScores } from '../utils/calculateScores';
import { Dice } from '../types/dice';

interface ScoreTableProps {
  dice: number[];
}

const ScoreTable: React.FC<ScoreTableProps> = ({ dice }) => {
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
          // Extract the score from the object (first key is the score)
          const score = Object.keys(scoreData)[0];
          return (
            <React.Fragment key={category}>
              <div className="font-medium text-gray-700">{category}</div>
              <div className="text-right text-gray-900">{score}</div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ScoreTable;
