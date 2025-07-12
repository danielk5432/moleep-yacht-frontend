'use client';
// src/pages/Dice.tsx
import React from 'react';
import DiceRoller from '../components/DiceRoller';

const Dice: React.FC = () => {
  return (
    <div>
      <h1 className = 'text-center'>🎲 Dice Game</h1>
      <DiceRoller />
    </div>
  );
};

export default Dice;
