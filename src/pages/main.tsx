'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { api } from '../utils/api';
import Image from 'next/image';

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  nickname?: string;
}

const MainPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user?.nickname) localStorage.setItem('nickname', user.nickname);
    if (user?.id) localStorage.setItem('userId', user.id);
    if (user?.picture) localStorage.setItem('userPicture', user.picture);
  }, [user]);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return router.push('/login');
    try {
      const userData = await api.getProfile(token);
      if (!userData.nickname || !userData.profileSetup) {
        return router.push('/setup-profile');
      }
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('authToken');
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 font-[DungGeunMo]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-[DungGeunMo]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center justify-between w-full">
              {/* 왼쪽: 로고 */}
              <Link href="/">
                {/* 데스크탑용 로고 */}
                <img
                  src="/images/YyachTify.png"
                  alt="Yacht Game Logo"
                  className="h-16 w-auto object-contain hidden sm:block"
                />
                {/* 모바일용 로고 */}
                <img
                  src="/images/YyachTify_Square.png"
                  alt="Yacht Game Logo Mobile"
                  className="h-12 w-auto object-contain block sm:hidden"
                />
              </Link>

              {/* 오른쪽: 설명서 버튼 (모바일 전용) */}
              <button
                onClick={() => setIsManualOpen(true)}
                className="text-xs mr-2 text-gray-600 underline hover:text-blue-800"
              >
                설명서
              </button>
            </div>
            {user && (
              <div className="relative">
                <img
                  src={user.picture}
                  alt="User Avatar"
                  className="w-9 h-8 rounded-full cursor-pointer border"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                />
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg py-2 z-50">
                    <div className="px-4 py-2 text-gray-800 font-medium">{user.nickname || user.name}</div>
                    <Link href="/settings" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">설정</Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 설명서 모달 */}
      {isManualOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto p-4">
            <img src="/images/manual.jpg" alt="게임 설명서" className="w-full h-auto rounded" />
            <div className="text-right mt-4">
              <button
                onClick={() => setIsManualOpen(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-gray-900 mb-4">Welcome to YachTiFy!</h2>
          <p className="text-xl text-gray-600 mb-8">Have FUN, {user?.nickname || user?.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 게임 카드 */}
          <Card
            image="/images/dice_only.png"
            title="Yacht 게임"
            description="클래식한 Yacht 게임을 즐겨보세요!"
            href="/game-settings-main"
            bgColor="bg-blue-100"
            pointColor = "bg-blue-500"
          />
          <Card
            image="/images/vs.png"
            title="멀티플레이"
            description="실시간 매칭으로 친구와 대결하세요!"
            href="/game-settings-multi"
            bgColor="bg-yellow-100"
            pointColor = "bg-blue-500"
          />
          <Card
            image="/images/rank.png"
            title="랭킹"
            description="당신의 순위를 확인해보세요!"
            href="#"
            bgColor="bg-green-100"
            pointColor = "bg-blue-500"
          />
        </div>
      </main>
    </div>
  );
};

const Card = ({ image, title, description, href, bgColor, pointColor}: { image: string, title: string, description: string, href: string, bgColor: string, pointColor: string }) => (
  <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow flex flex-col items-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4 mt-8 mb-auto">
      <div className={`w-30 h-30 rounded-full flex items-center justify-center p-4 ${bgColor}`}>
        <Image src={image} alt={title} width={100} height={100} className="object-contain" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 text-center">{description}</p>
      <Link href={href} className={`inline-block px-6 py-3 ${pointColor} text-white rounded-md hover:brightness-110 transition-colors`}>
        시작하기
      </Link>
    </div>
  </div>
);

export default MainPage;
