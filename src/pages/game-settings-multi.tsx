'use client';

import React, { useEffect, useState } from 'react'; // useEffect 추가
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useSocketStore } from "../stores/socketStore";
// import { useUserStore } from "../stores/userStore"; // 닉네임 등을 가져올 유저 스토어 (가정)

// 'assert'는 서버사이드 모듈이므로 클라이언트 코드에서 제거해야 합니다.
// import { match } from 'assert';

const good_data = [
  { option: '456Dice', image: { uri: '/images/456_dice_only.png' } },
  { option: 'OneMoreDice', image: { uri: '/images/onemore_dice_only.png' } },
  { option: 'HighDice', image: { uri: '/images/high_dice_only.png' } },
  { option: 'WildDice', image: { uri: '/images/wild_dice_only.png' } },
];

const MAX_TOTAL = 4;

const GoodDiceSelectionPage: React.FC = () => {
  const router = useRouter();
  const [matching, setMatching] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(good_data.map(d => [d.option, 0]))
  );

  // 1. Zustand 스토어에서 소켓 관련 함수와 상태를 가져옵니다.
  const { socket, isConnected, connect, disconnect } = useSocketStore();
  // const { nickname } = useUserStore(); // 실제로는 유저 스토어에서 닉네임을 가져옵니다.

  const totalSelected = Object.values(counts).reduce((a, b) => a + b, 0);

  const handleChange = (option: string, delta: number) => {
    setCounts(prev => {
      const newCount = prev[option] + delta;
      const nextTotal = totalSelected + delta;
      if (newCount < 0 || newCount > MAX_TOTAL || nextTotal > MAX_TOTAL) return prev;
      return { ...prev, [option]: newCount };
    });
  };

  // "게임 시작" 버튼 클릭 시 실행
  const handleStart = () => {
    // 소켓 연결을 시작하고, 매칭 상태로 전환
    connect();
    setMatching(true);
  };

  // "뒤로가기" 또는 "매칭취소" 버튼 클릭 시 실행
  const handleCancel = () => {
    if (matching) {
      // 매칭 중일 경우, 큐에서 나가고 소켓 연결을 끊습니다.
      if (socket) {
        socket.emit('leaveQueue'); // 서버에 큐 이탈 알림
      }
      disconnect();
      setMatching(false);
    } else {
      // 매칭 중이 아닐 경우, 메인 페이지로 이동
      router.push('/');
    }
  };

  // 2. 소켓의 상태가 변경될 때마다 특정 로직을 실행하는 useEffect
  useEffect(() => {
    // 소켓이 연결되었고, 사용자가 '매칭' 상태일 때
    if (isConnected && socket && matching) {
      console.log('Socket connected. Emitting joinQueue...');
      // 서버에 'joinQueue' 이벤트를 보내 매칭 대기열에 참가합니다.
      // 실제로는 닉네임, 유저ID 등의 정보를 함께 보냅니다.
      socket.emit('joinQueue', {
        id : localStorage.getItem("id"),
        nickname: localStorage.getItem("nickname") || "annoymous" ,
        goodDiceRecord: counts
      });

      // 서버로부터 'matchFound' 이벤트를 수신 대기합니다.
      socket.on('matchFound', (data: { roomId: string }) => {
        console.log(`Match found! Navigating to room: ${data.roomId}`);
        // 매칭이 성공하면 게임방으로 이동합니다.
        router.push(`/game/${data.roomId}`);
      });
    }

    // 3. Cleanup 함수: 이 컴포넌트가 사라질 때 실행됩니다.
    // 이벤트 리스너가 중복으로 쌓이는 것을 방지합니다.
    return () => {
      if (socket) {
        socket.off('matchFound');
      }
    };
  }, [isConnected, socket, matching, counts, router]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50" style={{ fontFamily: 'DungGeunMo' }}>
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">주사위 구성 선택</h2>
        <p className="text-sm text-gray-600 text-center mb-6">※ 총 4개의 주사위를 선택해야 합니다.</p>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {good_data.map(({ option, image }) => (
            <div key={option} className="flex flex-col items-center bg-gray-50 rounded-lg p-4 shadow">
              <Image src={image.uri} width={80} height={80} alt={option} className="mb-2" />
              <div className="font-semibold mb-2">{option}</div>
              <div className="flex items-center gap-2">
                <button
                  disabled={matching} // 매칭 중에는 비활성화
                  onClick={() => handleChange(option, -1)}
                  className="px-3 py-0.5 text-lg rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >−</button>
                <span className="text-lg font-medium"> {counts[option]} </span>
                <button
                  disabled={matching} // 매칭 중에는 비활성화
                  onClick={() => handleChange(option, 1)}
                  className="px-3 py-0.5 text-lg rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-gray-600 mb-4">
          총 선택: <strong>{totalSelected}</strong> / {MAX_TOTAL}
        </div>

        <button
          onClick={handleStart}
          disabled={totalSelected !== MAX_TOTAL || matching} // 4개를 선택하지 않았거나, 매칭 중이면 비활성화
          className={`w-full py-2 rounded-md text-white font-semibold transition
            disabled:bg-gray-400 disabled:cursor-not-allowed
            ${totalSelected === MAX_TOTAL && !matching ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
          `}
        >
          {totalSelected !== MAX_TOTAL ? '주사위를 4개 선택해주세요' : matching ? '매칭 대기중...' : '게임 시작'}
        </button>
        
        <button
          onClick={handleCancel}
          className={`w-full mt-2 py-2 rounded-md text-white font-semibold transition bg-red-500 hover:bg-red-600`}
        >
          {matching ? '매칭 취소' : '뒤로 가기'}
        </button>
      </div>
    </div>
  );
};

export default GoodDiceSelectionPage;