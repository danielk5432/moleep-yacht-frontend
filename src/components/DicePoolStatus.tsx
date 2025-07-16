'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSocketStore } from '../stores/socketStore';

// 1. 표시할 4개의 좋은 주사위 상세 정보를 미리 정의합니다.
const GOOD_DICE_DETAILS = [
  { name: '456Dice', src: '/images/456_dice.png' },
  { name: 'OneMoreDice', src: '/images/onemore_dice.png' },
  { name: 'HighDice', src: '/images/high_dice.png' },
  { name: 'WildDice', src: '/images/wild_dice.png' },
];

// 서버가 보내주는 데이터의 타입 정의
type DiceCounts = Record<string, number>;

const DicePoolStatus: React.FC = () => {
  // 2. 주사위 개수를 저장할 state
  const [counts, setCounts] = useState<DiceCounts>({});
  const { socket } = useSocketStore();

  // 3. 소켓 이벤트를 수신하여 state를 업데이트하는 useEffect
  useEffect(() => {
    // 소켓 연결이 없으면 아무것도 하지 않음
    if (!socket) return;

    // 서버로부터 좋은 주사위 개수 정보를 받는 리스너
    const handleUpdate = (newCounts: DiceCounts) => {
      console.log('Received good dice update:', newCounts);
      setCounts(newCounts);
    };

    socket.on('game:goodDiceUpdate', handleUpdate);

    // 컴포넌트가 사라질 때 이벤트 리스너를 정리하여 메모리 누수 방지
    return () => {
      socket.off('game:goodDiceUpdate', handleUpdate);
    };
  }, [socket]); // socket 객체가 변경될 때만 이 효과를 재실행

  return (
    <div className="flex justify-end">
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg w-72 border">
    <h3 className="text-center font-bold text-gray-800 mb-3 border-b pb-2 text-md">남은 좋은 주사위</h3>
    <div className="grid grid-cols-2 gap-4">
      {GOOD_DICE_DETAILS.map(dice => (
        <div
          key={dice.name}
          className="flex items-center justify-between bg-white/60 p-3 rounded-md shadow-sm min-h-[70px]"
        >
          <div className="flex flex-col items-start">
            <Image src={dice.src} alt={dice.name} width={64} height={64} />
          </div>
          <span className="font-bold text-blue-600 text-lg">
            x {counts[dice.name] || 0}
          </span>
        </div>
      ))}
    </div>
  </div>
  </div>
  );
};

export default DicePoolStatus;