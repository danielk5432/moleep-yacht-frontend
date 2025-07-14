'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { io, Socket } from 'socket.io-client';
import DiceRoller from '../../components/DiceRoller';
import { GameAction } from '../../types/game';

interface GameParams {
  roomId: string;
  myTurn: string;
  opponentNickname: string;
  playerId: string;
  opponentId: string;
}

const MultiplayerGamePage: React.FC = () => {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameParams, setGameParams] = useState<GameParams | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      const params = router.query as unknown as GameParams;
      if (params.roomId) {
        setGameParams(params);
        console.log('🎮 Game params:', params);
      } else {
        console.error('❌ No game parameters found');
        router.push('/multiplayer/match');
      }
    }
  }, [router.isReady, router.query, router]);

  // Socket 초기화
  useEffect(() => {
    if (!gameParams) return;

    console.log('🔌 Initializing game socket connection...');
    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8443', {
      transports: ['websocket', 'polling'],
      path: '/api/websocket',
      forceNew: true,
    });

    newSocket.on('connect', () => {
      console.log('🔌 Game socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔌 Game socket connection error:', error);
    });

    newSocket.on('gameAction', (action: GameAction) => {
      console.log('📥 Received game action:', action);
      // DiceRoller에 액션 전달
      // TODO: DiceRoller에서 액션을 받을 수 있도록 수정
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Game socket disconnected');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [gameParams]);

  const handleGameAction = (action: GameAction) => {
    if (socket && gameParams) {
      console.log('📤 Sending game action:', action);
      socket.emit('gameAction', { roomId: gameParams.roomId, action });
    }
  };

  const goBack = () => {
    router.push('/');
  };

  if (!gameParams) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">게임 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 게임 정보 헤더 */}
      <div className="absolute top-4 left-4 z-50 bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-sm text-gray-600">상대방</p>
            <p className="font-semibold">{gameParams.opponentNickname}</p>
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div>
            <p className="text-sm text-gray-600">내 턴</p>
            <p className="font-semibold">{gameParams.myTurn === 'true' ? '✅' : '❌'}</p>
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div>
            <p className="text-sm text-gray-600">연결 상태</p>
            <p className={`font-semibold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? '🟢' : '🔴'}
            </p>
          </div>
        </div>
      </div>

      {/* 뒤로가기 버튼 */}
      <button
        onClick={goBack}
        className="absolute top-4 right-4 z-50 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
      >
        ← 나가기
      </button>

      {/* 게임 컴포넌트 */}
      <DiceRoller 
        multiplayer={true}
        gameParams={gameParams}
        socket={socket}
        onGameAction={handleGameAction}
      />
    </div>
  );
};

export default MultiplayerGamePage; 