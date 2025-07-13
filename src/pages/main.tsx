'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { api } from '../utils/api';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">🎲 Yacht Game</h1>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-700 font-medium">{user.nickname || user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            야추 게임에 오신 것을 환영합니다!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {user?.nickname || user?.name}님, 즐거운 게임 되세요!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 게임 카드 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎲</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">야추 게임</h3>
              <p className="text-gray-600 mb-6">
                클래식한 야추 게임을 즐겨보세요!
              </p>
              <Link
                href="/dice"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                게임 시작
              </Link>
            </div>
          </div>

          {/* 랭킹 카드 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
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

          {/* 설정 카드 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">설정</h3>
              <p className="text-gray-600 mb-6">
                게임 설정을 변경해보세요!
              </p>
              <Link
                href="/settings"
                className="inline-block px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                설정
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage; 