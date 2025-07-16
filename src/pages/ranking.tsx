'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../utils/api';
import Image from 'next/image';

// 랭킹 데이터 타입을 정의합니다.
interface RankEntry {
  rank: number;
  nickname: string;
  score: number;
  picture: string;
}

const RankingPage: React.FC = () => {
  const [normalRanks, setNormalRanks] = useState<RankEntry[]>([]);
  const [multiRanks, setMultiRanks] = useState<RankEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setIsLoading(true);
        // 두 개의 랭킹 정보를 동시에 요청합니다.
        const [normalData, multiData] = await Promise.all([
          api.getNormalRankings(),
          api.getMultiplayerRankings(),
        ]);
        setNormalRanks(normalData);
        setMultiRanks(multiData);
      } catch (err) {
        console.error('Failed to fetch rankings:', err);
        setError('랭킹 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankings();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 font-[DungGeunMo]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 font-[DungGeunMo]">
        <p className="text-2xl text-red-600 mb-4">{error}</p>
        <Link href="/" className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          메인으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-green-100 font-[DungGeunMo] p-4 sm:p-6 lg:p-8">
      <header className="mb-10">
        {/* 왼쪽 상단에 메인으로 돌아가기 */}
        <div className="bg-white w-full px-4 py-3 shadow-sm">
          <Link href="/" className="text-green-600 hover:underline text-base">
            &larr; 메인으로 돌아가기
          </Link>
        </div>

        {/* 중앙 정렬 제목과 설명 */}
        <div className="text-center">
          <h1 className="pt-8 text-4xl sm:text-5xl font-bold text-gray-900 mb-2">게임랭킹</h1>
          <p className="text-lg text-gray-600">최고의 플레이어들을 확인하세요!</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RankingList title="일반 모드" rankings={normalRanks} />
        <RankingList title="멀티플레이 모드" rankings={multiRanks} />
      </main>
    </div>
  );
};

// 랭킹 리스트를 표시하는 재사용 가능한 컴포넌트
const RankingList: React.FC<{ title: string; rankings: RankEntry[] }> = ({ title, rankings }) => (
  <div className="bg-white rounded-2xl shadow-xl p-6">
    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">{title}</h2>
    <div className="space-y-4">
      {rankings.length > 0 ? (
        rankings.map((entry, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-50 p-3 rounded-lg transition hover:bg-gray-100"
          >
            <span className="text-lg font-bold w-10 text-center text-gray-500">{entry.rank}</span>
            <Image
              src={entry.picture || '/images/default-avatar.png'}
              alt={entry.nickname}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full mx-4 border"
            />
            <span className="flex-1 font-medium text-gray-800 truncate">{entry.nickname}</span>
            <span className="text-lg font-bold text-green-600">{entry.score.toLocaleString()}점</span>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-8">아직 랭킹 데이터가 없습니다.</p>
      )}
    </div>
  </div>
);

export default RankingPage;