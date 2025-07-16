'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSocketStore } from '../stores/socketStore';
import { playSound } from '../utils/playSound';

const Wheel = dynamic(
  () => import('react-custom-roulette').then(mod => mod.Wheel),
  { ssr: false }
);

// 모든 주사위의 상세 정보를 담고 있는 통합 데이터
const ALL_DICE_DATA = [
    { option: '456Dice', image: { uri: '/images/456_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } },
    { option: 'OneMoreDice', image: { uri: '/images/onemore_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } },
    { option: 'HighDice', image: { uri: '/images/high_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } },
    { option: 'WildDice', image: { uri: '/images/wild_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } },
    { option: '123Dice', image: { uri: '/images/123_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } },
    { option: 'OneMinusDice', image: { uri: '/images/oneminus_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } },
    { option: 'RiskDice', image: { uri: '/images/risk_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } }, 
    { option: '1or6Dice', image: { uri: '/images/1or6_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } },
    { option: 'ConstantDice', image: { uri: '/images/constant_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } }, 
    { option: 'OddDice', image: { uri: '/images/odd_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } }, 
    { option: 'EvenDice', image: { uri: '/images/even_dice.png', sizeMultiplier: 1.2, offsetY: 120 }, style: { backgroundColor: 'white', textColor: 'black' } }, 
];
// 주사위 이름으로 상세 정보를 빠르게 찾기 위한 Map
const DICE_DETAILS_MAP = new Map(ALL_DICE_DATA.map(d => [d.option, d]));

interface DiceRouletteProps {
  onResult: (result: string) => void;
}

const DiceRoulette: React.FC<DiceRouletteProps> = ({ onResult }) => {
  const [data, setData] = useState<typeof ALL_DICE_DATA>([]); // 1. 초기 데이터는 빈 배열로 시작
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  
  const router = useRouter();
  const { socket } = useSocketStore();

  // 2. 컴포넌트 로딩 시, 모드에 따라 룰렛 데이터를 설정하는 useEffect
  useEffect(() => {
    // Next.js 라우터의 쿼리 파라미터가 완전히 로드될 때까지 기다립니다.
    if (!router.isReady) {
      return;
    }

    const { multiplay, roomId } = router.query;

    // 멀티플레이 모드일 경우: 소켓으로 데이터 요청
    if (multiplay === 'true' && roomId && socket) {
      socket.emit('roulette:getDice', roomId, (response : { error?: string; selectedPool?: string[] }) => {
        if (response.error) {
          console.log('socket error: failed to get dice pool');
          alert(response.error);
        } else if (response.selectedPool) {
          // 서버에서 받은 주사위 이름 목록을 룰렛 데이터 형식으로 변환
          const rouletteData = response.selectedPool
            .map(name => DICE_DETAILS_MAP.get(name))
            .filter(Boolean); // 혹시 모를 undefined 값 제거
          
          setData(rouletteData as typeof ALL_DICE_DATA);
        }
      });
    }
    // 싱글플레이 모드일 경우: 랜덤으로 데이터 생성
    else {
      console.log('Single player mode: Generating random dice.');
      
      // ✅ 고유한 이름으로 비교하도록 로직 수정
      const goodNames = new Set(['456Dice', 'OneMoreDice', 'HighDice', 'WildDice']);
      const badNames = new Set(['123Dice', 'OneMinusDice', 'RiskDice']);

      const good = ALL_DICE_DATA.filter(d => goodNames.has(d.option));
      const bad = ALL_DICE_DATA.filter(d => badNames.has(d.option));
      const common = ALL_DICE_DATA.filter(d => !goodNames.has(d.option) && !badNames.has(d.option));
      
      const shuffled = (arr: any[], count: number) => [...arr].sort(() => 0.5 - Math.random()).slice(0, count);

      setData([
        ...shuffled(good, 2),
        ...shuffled(bad, 1),
        ...shuffled(common, 3)
      ]);
    }
  }, [router.isReady, router.query, socket]);

  // 3. 룰렛 데이터(data)가 준비된 후, 룰렛을 돌리는 useEffect
  useEffect(() => {
    // 데이터가 아직 준비되지 않았다면 실행하지 않음
    if (data.length === 0) return;

    // 데이터가 설정된 후, 1초 뒤에 사운드 재생 및 룰렛 돌리기 시작
    const initialTimer = setTimeout(() => {
      playSound('/sounds/roulette_5.wav', 500);
      
      const prizeTimer = setTimeout(() => {
        const newPrizeNumber = Math.floor(Math.random() * data.length);
        setPrizeNumber(newPrizeNumber);

        const spinTimer = setTimeout(() => {
          setMustSpin(true);
        }, 300);

        return () => clearTimeout(spinTimer);
      }, 500);

      return () => clearTimeout(prizeTimer);
    }, 1000);
    
    return () => clearTimeout(initialTimer);
  }, [data]); // data 상태가 변경될 때마다 이 효과가 실행됨

  return (
    <div
      className="w-full max-w-3xl mx-auto rounded-2xl p-4 flex flex-col items-center justify-center"
      style={{ backgroundColor: 'rgba(240, 240, 240, 1)' }}
    >
      <h1 className="text-3xl font-semibold mb-4 text-center">Your Dice</h1>
      <div className="flex justify-center">
        {/* 데이터가 있을 때만 룰렛을 보여주고, 없으면 로딩 텍스트 표시 */}
        {data.length > 0 ? (
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
        ) : (
          <div className="text-center p-8 text-xl">
            주사위를 불러오는 중...
          </div>
        )}
      </div>
    </div>
  );
};

export default DiceRoulette;