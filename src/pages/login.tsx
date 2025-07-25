'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../utils/api';

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // URL에서 토큰 확인
    const { token } = router.query;
    if (token && typeof token === 'string') {
      handleAuthSuccess(token);
    }
  }, [router.query]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const data = await api.getGoogleAuthUrl();
      
      // Google OAuth 페이지로 리다이렉트
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = async (token: string) => {
    try {
      // 토큰을 localStorage에 저장
      localStorage.setItem('authToken', token);
      
      // 사용자 정보 가져오기
      const userData = await api.getProfile(token);
      setUser(userData);
      
      // 메인 페이지로 리다이렉트
      router.push('/');
    } catch (error) {
      console.error('Auth success error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎲 Yacht Game</h1>
          <p className="text-gray-600">Google 계정으로 로그인하세요</p>
        </div>

        {!user ? (
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  로그인 중...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google로 로그인
                </div>
              )}
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-4">
              <img
                src={user.picture}
                alt={user.name}
                className="w-16 h-16 rounded-full border-4 border-blue-100"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/')}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                게임 시작
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
