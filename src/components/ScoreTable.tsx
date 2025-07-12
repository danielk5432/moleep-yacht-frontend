// components/ScoreTable.tsx
'use client';

import React from 'react';
import { calculateScores } from '../utils/calculateScores';

interface ScoreTableProps {
  dice: number[];
}

const ScoreTable: React.FC<ScoreTableProps> = ({ dice }) => {
  const scores = calculateScores(dice);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">🎲 Yacht Dice 점수표</h2>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {Object.entries(scores).map(([category, score]) => (
          <React.Fragment key={category}>
            <div className="font-medium text-gray-700">{category}</div>
            <div className="text-right text-gray-900">{score}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ScoreTable;
