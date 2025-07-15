'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../utils/api';

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  nickname?: string;
}

const SetupProfile: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    // 사용자 정보 가져오기
    const fetchUser = async () => {
      try {
        const userData = await api.getProfile(token);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim() || nickname.trim().length < 2) {
      setError('닉네임은 2글자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      console.log('Setting up profile with nickname:', nickname.trim());
      const result = await api.setupProfile(token, nickname.trim());
      
      console.log('Profile setup result:', result);
      
      // 새로운 토큰 저장
      localStorage.setItem('authToken', result.token);
      // 닉네임도 저장
      localStorage.setItem('nickname', nickname.trim());
      console.log('Redirecting to main page...');
      // 메인 페이지로 이동
      router.push('/main');
    } catch (error) {
      console.error('Profile setup error:', error);
      setError('닉네임 설정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" style={{ fontFamily: 'DungGeunMo' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" style={{ fontFamily: 'DungGeunMo' }}>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎲 프로필 설정</h1>
          <p className="text-gray-600">게임에서 사용할 닉네임을 설정해주세요</p>
        </div>

        <div className="flex items-center justify-center mb-6">
          <img
            src={user.picture}
            alt={user.name}
            className="w-16 h-16 rounded-full border-4 border-blue-100"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
              닉네임
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="게임에서 사용할 닉네임을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={20}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {nickname.length}/20 (2-20글자)
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || nickname.trim().length < 2}
            className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                설정 중...
              </div>
            ) : (
              '프로필 설정 완료'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupProfile; 