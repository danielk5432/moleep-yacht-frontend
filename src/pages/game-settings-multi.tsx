'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useSocketStore } from "../stores/socketStore";
import { playSound } from '../utils/playSound';

const good_data = [
  { option: '456Dice', image: { uri: '/images/456_dice_only.png' } },
  { option: 'OneMoreDice', image: { uri: '/images/onemore_dice_only.png' } },
  { option: 'HighDice', image: { uri: '/images/high_dice_only.png' } },
  { option: 'WildDice', image: { uri: '/images/wild_dice_only.png' } },
];

interface Player {
  id: string;
  nickname: string;
  joinedAt: Date;
  goodDiceRecord: Record<string, number>;
}

interface MatchData {
  roomId: string;
  players: Player[];
  dicePool: string[];
  createdAt: Date;
}


const MAX_TOTAL = 4;

const GoodDiceSelectionPage: React.FC = () => {
  const router = useRouter();
  const [matching, setMatching] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(good_data.map(d => [d.option, 0]))
  );

  const { socket, isConnected, connect, disconnect } = useSocketStore();

  const totalSelected = Object.values(counts).reduce((a, b) => a + b, 0);

  const handleChange = (option: string, delta: number) => {
    setCounts(prev => {
      const newCount = prev[option] + delta;
      const nextTotal = totalSelected + delta;
      if (newCount < 0 || newCount > MAX_TOTAL || nextTotal > MAX_TOTAL) return prev;
      return { ...prev, [option]: newCount };
    });
  };

  // "게임 시작" 버튼 로직: UI 변경 및 연결 시작만 담당합니다.
  const handleStart = () => {
    setMatching(true);
    // 이 함수는 단순히 연결을 시작하라는 신호를 보냅니다.
    // 실제 register, joinQueue 등은 아래 useEffect에서 상태에 따라 자동으로 처리됩니다.
    connect(); 
  };

  // "매칭 취소" 버튼 로직
  const handleCancel = () => {
    if (matching) {
      // 서버에 leaveQueue 이벤트가 구현되어 있다면 유효합니다.
      socket?.emit('leaveQueue'); 
      disconnect();
      setMatching(false);
    } else {
      router.push('/');
    }
  };

  // 소켓 연결 및 매칭 요청을 처리하는 useEffect
  useEffect(() => {
    // 1. "게임 시작"을 눌렀고 (matching=true),
    // 2. 소켓 연결이 성공했을 때 (isConnected=true, socket 존재)
    // 이 모든 조건이 만족되면 아래 로직이 단 한번 실행됩니다.
    if (matching && isConnected && socket) {
      const playerId = localStorage.getItem("userId");
      const nickname = localStorage.getItem("nickname") || "anonymous";

      if (!playerId) {
        alert("플레이어 ID가 없어 매칭을 시작할 수 없습니다.");
        setMatching(false);
        disconnect();
        return;
      }
      
      // 백엔드에 플레이어 등록 요청
      console.log(`Sending 'register' with: ${playerId}`);
      socket.emit('register', playerId);

      // 백엔드에 매칭 대기열 참가 요청
      console.log(`Sending 'matchmaking:joinQueue' with:`, { playerId, nickname, goodDiceRecord: counts });
      socket.emit('matchmaking:joinQueue', {
        playerId,
        nickname,
        goodDiceRecord: counts,
      });
    }
  }, [matching, isConnected, socket, counts, disconnect]);


  // 서버로부터 오는 이벤트를 수신 대기하는 useEffect
  useEffect(() => {
    // 소켓 객체가 있을 때만 이벤트 리스너를 등록합니다.
    if (socket) {
      const handleMatchFound = (matchData: MatchData) => {
        console.log(`✅ Match found! Navigating to room: ${matchData.roomId}`);
        setMatching(false); // 매칭 완료되었으므로 상태 초기화
        router.push(`/dice?multiplay=true&roomId=${matchData.roomId}`);
      };

      const handleMatchWaiting = () => {
        console.log('...Waiting for other players.');
        // 필요하다면 "매칭 대기 중..." UI에 애니메이션 효과 등을 추가할 수 있습니다.
      };

      // 이벤트 리스너 등록
      socket.on('matchmaking:matched', handleMatchFound);
      socket.on('matchmaking:waiting', handleMatchWaiting);

      // 컴포넌트가 사라질 때(Cleanup) 반드시 리스너를 제거해야 합니다.
      // 이렇게 하지 않으면 메모리 누수나 이벤트 중복 발생의 원인이 됩니다.
      return () => {
        socket.off('matchmaking:matched', handleMatchFound);
        socket.off('matchmaking:waiting', handleMatchWaiting);
      };
    }
  }, [socket, router]);


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
                  disabled={matching}
                  onClick={() => {
                    playSound('/sounds/click_button.wav');
                    handleChange(option, -1);
                  }}
                  className="px-3 py-0.5 text-lg rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >−</button>
                <span className="text-lg font-medium"> {counts[option]} </span>
                <button
                  disabled={matching}
                  onClick={() => {
                    playSound('/sounds/click_button.wav');
                    handleChange(option, 1);
                  }}
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
        onClick={() => {
            playSound('/sounds/click_button.wav');
            handleStart();
          }}
          disabled={totalSelected !== MAX_TOTAL || matching}
          className={`w-full py-2 rounded-md text-white font-semibold transition
            disabled:bg-gray-400 disabled:cursor-not-allowed
            ${totalSelected === MAX_TOTAL && !matching ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
          `}
        >
          {totalSelected !== MAX_TOTAL ? '주사위를 4개 선택해주세요' : matching ? '매칭 대기중...' : '게임 시작'}
        </button>
        
        <button
          onClick={() => {
          playSound('/sounds/click_button.wav');
          handleCancel();
        }}
          className={`w-full mt-2 py-2 rounded-md text-white font-semibold transition bg-gray-300 hover:bg-gray-400`}
        >
          {matching ? '매칭 취소' : '뒤로 가기'}
        </button>
      </div>
    </div>
  );
};

export default GoodDiceSelectionPage;