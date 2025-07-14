'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface MatchData {
  roomId: string;
  players: Array<{
    id: string;
    nickname: string;
  }>;
  opponent: {
    id: string;
    nickname: string;
  };
  myTurn: boolean;
}

const MatchPage: React.FC = () => {
  const router = useRouter();
  const [isMatching, setIsMatching] = useState(false);
  const [matchMessage, setMatchMessage] = useState('');
  const [matchData, setMatchData] = useState<MatchData | null>(null);

  // 매칭 성공 시 자동 이동
  useEffect(() => {
    console.log('🔍 matchData changed:', matchData);
    if (matchData) {
      console.log('🚀 Redirecting to /dice...');
      router.push('/dice');
    }
  }, [matchData, router]);

  const requestMatch = async () => {
    console.log('🎯 Requesting match...');
    
    // 사용자 정보 가져오기
    const token = localStorage.getItem('authToken');
    let playerId = localStorage.getItem('userId') || `player_${Date.now()}`;
    let nickname = localStorage.getItem('nickname') || 'Anonymous';
    
    // 토큰이 있으면 사용자 정보 가져오기
    if (token) {
      try {
        const response = await fetch('http://localhost:8443/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          playerId = userData.id || playerId;
          nickname = userData.nickname || userData.name || nickname;
          console.log('👤 User data loaded:', { playerId, nickname });
        }
      } catch (error) {
        console.error('❌ Failed to load user data:', error);
      }
    }
    
    console.log('🎯 Sending match request with:', { playerId, nickname });
    
    try {
      const response = await fetch('http://localhost:8443/api/multiplayer/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ playerId, nickname }),
      });
      
      if (response.ok) {
        const matchResult = await response.json();
        if (matchResult.status === 'matched') {
          setMatchData(matchResult.data);
          setIsMatching(false);
          setMatchMessage(`매칭 성공! ${matchResult.data.opponent.nickname}님과 게임을 시작합니다.`);
          
          // 매칭 성공 시 dice 페이지로 이동
        } else {
          setIsMatching(true);
          setMatchMessage('매칭 중입니다...');
          
          // 폴링으로 매칭 상태 확인
          pollMatchStatus(playerId);
        }
      } else {
        console.error('❌ Match request failed');
        setMatchMessage('매칭 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ Match request error:', error);
      setMatchMessage('매칭 요청 중 오류가 발생했습니다.');
    }
  };

  const pollMatchStatus = async (playerId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8443/api/multiplayer/match/status/${playerId}`);
        if (response.ok) {
          const status = await response.json();
          console.log('📊 Polling response:', status);
          if (status.status === 'matched') {
            console.log('✅ Match found, setting matchData:', status.data);
            clearInterval(pollInterval);
            setMatchData(status.data);
            setIsMatching(false);
            setMatchMessage(`매칭 성공! ${status.data.opponent.nickname}님과 게임을 시작합니다.`);
            
          }
        }
      } catch (error) {
        console.error('❌ Polling error:', error);
      }
    }, 2000); // 2초마다 확인
    
    // 30초 후 폴링 중단
    setTimeout(() => {
      clearInterval(pollInterval);
      if (isMatching) {
        setIsMatching(false);
        setMatchMessage('매칭 시간이 초과되었습니다.');
      }
    }, 30000);
  };

  const cancelMatch = async () => {
    const playerId = localStorage.getItem('userId') || `player_${Date.now()}`;
    
    try {
      const response = await fetch(`http://localhost:8443/api/multiplayer/match/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId }),
      });
      
      if (response.ok) {
        setIsMatching(false);
        setMatchMessage('');
      }
    } catch (error) {
      console.error('❌ Cancel match error:', error);
    }
  };

  const goBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎮 멀티플레이어</h1>
          <p className="text-gray-600 mb-8">다른 플레이어와 매칭하여 게임을 시작하세요!</p>
          
          {!isMatching ? (
            <div className="space-y-4">
              <button
                onClick={requestMatch}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors"
              >
                🎯 매칭 시작
              </button>
              <button
                onClick={goBack}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                ← 뒤로 가기
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto"></div>
              <p className="text-gray-700 text-lg">{matchMessage}</p>
              <button
                onClick={cancelMatch}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                ❌ 매칭 취소
              </button>
            </div>
          )}
          
          {matchData && (
            <div className="mt-6 p-4 bg-green-100 rounded-lg">
              <p className="text-green-800 font-semibold">
                매칭 성공! {matchData.opponent.nickname}님과 게임을 시작합니다...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchPage; 