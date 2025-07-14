'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const Wheel = dynamic(
  () => import('react-custom-roulette').then(mod => mod.Wheel),
  { ssr: false }
);

const data = [
  { option: 'Good1', image: {uri: '/images/456_dice.png', sizeMultiplier: 1.2, offsetY: 120,}, style: { backgroundColor: 'white', textColor: 'black' } },
  { option: 'Common1', image: {uri: '/images/constant_dice.png',  sizeMultiplier: 1.2, offsetY: 120,}, style: { backgroundColor: 'white', textColor: 'black' } },
  { option: 'Good2', image: {uri: '/images/onemore_dice.png', sizeMultiplier: 1.2, offsetY: 120,}, style: { backgroundColor: 'white', textColor: 'black' } },
  { option: 'Common2', image: {uri: '/images/onemore_dice.png', sizeMultiplier: 1.2, offsetY: 120,}, style: { backgroundColor: 'white', textColor: 'black' } },
  { option: 'Bad', image: {uri: '/images/123_dice.png', sizeMultiplier: 1.2, offsetY: 120,}, style: { backgroundColor: 'white', textColor: 'white' } },
  { option: 'Common3', image: {uri: '/images/oneminus_dice.png', sizeMultiplier: 1.2, offsetY: 120,}, style: { backgroundColor: 'white', textColor: 'black' } },
];

interface DiceRouletteProps {
  onResult: (result: string) => void;
}

const DiceRoulette: React.FC<DiceRouletteProps> = ({ onResult }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  // 페이지 진입 시 자동 룰렛 돌리기
  useEffect(() => {
    const timer = setTimeout(() => {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="w-full max-w-3xl mx-auto rounded-2xl p-4 flex flex-col items-center justify-center"
      style={{ backgroundColor: 'rgba(229, 231, 235, 0.5)' }}
    >
      <h1 className="text-xl font-semibold mb-4 text-center">Your Dice</h1>
      <div className="flex justify-center">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          spinDuration={0.3}
          pointerProps={{ style: { fill: '#000000' } }}
          onStopSpinning={() => {
            setMustSpin(false);
            onResult(data[prizeNumber].option);
          }}
        />
      </div>
    </div>
  );
};

export default DiceRoulette;
