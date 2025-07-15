'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { playSound } from '../utils/playSound';

const Wheel = dynamic(
  () => import('react-custom-roulette').then(mod => mod.Wheel),
  { ssr: false }
);

  // 유틸: 배열에서 n개 무작위 추출
  function getRandomItems<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // 예시 데이터
  const good_data = [
    { option: '456Dice', image: { uri: '/images/456_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } },
    { option: 'OneMoreDice', image: { uri: '/images/onemore_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } },
    { option: 'HighDice', image: { uri: '/images/high_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } },
    { option: 'WildDice', image: { uri: '/images/wild_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } },
  ];

  const bad_data = [
    { option: '123Dice', image: { uri: '/images/123_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'white' } },
    { option: 'OneMinusDice', image: { uri: '/images/oneminus_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } },
    { option: 'RiskDice', image: { uri: '/images/risk_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } }, 
  ];

  const common_data = [
    { option: '1or6Dice', image: { uri: '/images/1or6_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } },
    { option: 'ConstantDice', image: { uri: '/images/constant_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } }, 
    { option: 'OddDice', image: { uri: '/images/odd_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } }, 
    { option: 'EvenDice', image: { uri: '/images/even_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } }, 
  ];
  // 구성

  function generateData() {
    return [
      ...getRandomItems(good_data, 2),
      ...getRandomItems(bad_data, 1),
      ...getRandomItems(common_data, 3),
    ];
  }

interface DiceRouletteProps {
  onResult: (result: string) => void;
}

const DiceRoulette: React.FC<DiceRouletteProps> = ({ onResult }) => {
  const [data, setData] = useState(() => generateData());
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  // 페이지 진입 시 자동 룰렛 돌리기
  useEffect(() => {
    setTimeout(() => {
      playSound('/sounds/roulette_5.wav',500);
      const prizeTimer = setTimeout(() => {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);

      // 약간의 멈춤 후 spin 시작
      const spinTimer = setTimeout(() => {
        
        setMustSpin(true);
      }, 300); // 0.3초 멈췄다가 spin

      return () => clearTimeout(spinTimer);
    }, 500); // 0.5초 후에 prize 결정

    return () => clearTimeout(prizeTimer);
    }, 1000);
  
}, []);

  return (
    <div
      className="w-full max-w-3xl mx-auto rounded-2xl p-4 flex flex-col items-center justify-center"
      style={{ backgroundColor: 'rgba(240, 240, 240, 1)' }}
    >
      <h1 className="text-3xl font-semibold mb-4 text-center">Your Dice</h1>
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
