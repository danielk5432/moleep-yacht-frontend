'use client';
// src/pages/Dice.tsx
import React from 'react';
import DiceRoller from '../components/DiceRoller';

const Dice: React.FC = () => {
  return (
    <div>
      <h2>🎲 Dice Game</h2>
      <DiceRoller />
    </div>
  );
};

export default Dice;
