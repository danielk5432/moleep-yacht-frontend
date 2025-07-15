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

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user && user.nickname) {
      localStorage.setItem('nickname', user.nickname);
    }
  }, [user]);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      console.log('Checking auth with token:', token);
      const userData = await api.getProfile(token);
      
      console.log('User data received:', userData);
      
      // 프로필 설정이 안 되어 있으면 설정 페이지로
      if (!userData.nickname || !userData.profileSetup) {
        console.log('Profile not setup, redirecting to setup-profile');
        router.push('/setup-profile');
        return;
      }
      
      console.log('Profile is setup, setting user data');
      setUser(userData);
    } catch (error) {
      console.error('Auth check error:', error);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'DungGeunMo' }} className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
             <Link href="/">
              <img
                src="/images/YyachTify.png"
                alt="Yacht Game Logo"
                className="h-20 w-auto object-contain"
              />
            </Link>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-700 font-medium">
                    {user.nickname || user.name}
                  </span>
                </div>

                {/* 🛠️ 환경설정 버튼 추가 */}
                <Link
                  href="/settings"
                  className="text-gray-600 border-b border-gray-400 pb-0.3 hover:text-gray-900 hover:border-gray-700 transition-colors"
                >
                  설정
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-gray-600 border-b border-gray-400 pb-0.3 hover:text-gray-900 hover:border-gray-700 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </header>


      {/* Main Content */}
      <main style={{ fontFamily: 'DungGeunMo' }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2  className="text-4xl text-gray-900 mb-4">
            Welcome to YachTiFy!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Have FUN, {user?.nickname || user?.name}!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 게임 카드 */}
        

          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow flex flex-col items-center  min-w-[200px] min-h-[400px]">
            {/* 상단: 아이콘, 제목, 설명 */}
            <div className="flex flex-col items-center gap-4 mt-16 mb-auto">
              <div className="w-30 h-30 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/images/dice_only.png"   // ✅ public/images/dice.png 에 있어야 함
                  alt="VS"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Yacht 게임</h3>
              <p className="text-gray-600 mb-6">
                클래식한 Yacht 게임을 즐겨보세요!
              </p>
              <Link
                href="/game-settings-main"
                className="inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                게임시작
              </Link>
            </div>
          </div>


          {/* 멀티플레이 카드 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow flex flex-col items-center  min-w-[200px] min-h-[400px]">
            {/* 상단: 아이콘, 제목, 설명 */}
            <div className="flex flex-col items-center gap-4 mt-16 mb-auto">
              <div className="w-30 h-30 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/images/vs.png"   // ✅ public/images/dice.png 에 있어야 함
                  alt="VS"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">멀티플레이</h3>
              <p className="text-gray-600 mb-6">
                실시간 매칭으로 친구와 대결하세요!
              </p>
              <Link
                href="/game-settings-multi"
                className="inline-block px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
              >
                멀티플레이 매칭
              </Link>
            </div>
          </div>

          {/* 랭킹 카드 */}
         <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow flex flex-col items-center min-w-[200px] min-h-[400px]">
            {/* 상단: 아이콘, 제목, 설명 */}
            <div className="flex flex-col items-center gap-4 mt-16 mb-auto">
              <div className="w-30 h-30 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Image
                  src="/images/rank.png"   // ✅ public/images/dice.png 에 있어야 함
                  alt="VS"
                  width={75}
                  height={75}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">랭킹</h3>
              <p className="text-gray-600 mb-6">
                다른 플레이어들과 점수를 비교해보세요!
              </p>
              <button className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                랭킹 보기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage; 