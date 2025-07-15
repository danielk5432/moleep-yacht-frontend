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

const SettingsPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      const userData = await api.getProfile(token);
      
      // 프로필 설정이 안 되어 있으면 설정 페이지로
      if (!userData.nickname || !userData.profileSetup) {
        router.push('/setup-profile');
        return;
      }
      
      setUser(userData);
      setNickname(userData.nickname || '');
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('authToken');
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNicknameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim() || nickname.trim().length < 2) {
      setError('닉네임은 2글자 이상이어야 합니다.');
      return;
    }

    setIsUpdating(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const result = await api.setupProfile(token, nickname.trim());
      
      // 새로운 토큰 저장
      localStorage.setItem('authToken', result.token);
      
      // 사용자 정보 업데이트
      setUser(prev => prev ? { ...prev, nickname: nickname.trim() } : null);
      setSuccess('닉네임이 성공적으로 변경되었습니다.');
    } catch (error) {
      console.error('Nickname update error:', error);
      setError('닉네임 변경에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAccountDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      // 계정 삭제 API 호출 (백엔드에서 구현 필요)
      await api.deleteAccount(token);
      
      // 로컬 스토리지 정리
      localStorage.removeItem('authToken');
      
      // 로그인 페이지로 이동
      router.push('/login');
    } catch (error) {
      console.error('Account deletion error:', error);
      setError('계정 삭제에 실패했습니다. 다시 시도해주세요.');
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" style={{ fontFamily: 'DungGeunMo' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" style={{ fontFamily: 'DungGeunMo' }}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/main')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← 돌아가기
              </button>
              <h1 className="text-3xl font-bold text-gray-900">⚙️ 설정</h1>
            </div>
            {user && (
              <div className="flex items-center space-x-3">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700 font-medium">{user.nickname || user.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* 프로필 정보 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">프로필 정보</h2>
            
            <div className="flex items-center space-x-6 mb-6">
              <img
                src={user?.picture}
                alt={user?.name}
                className="w-20 h-20 rounded-full border-4 border-blue-100"
              />
              <div>
                <p className="text-gray-600">이메일: {user?.email}</p>
                <p className="text-gray-600">이름: {user?.name}</p>
              </div>
            </div>
          </div>

          {/* 닉네임 변경 */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">닉네임 변경</h3>
            <form onSubmit={handleNicknameUpdate} className="space-y-4">
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임
                </label>
                <input
                  type="text"
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="새로운 닉네임을 입력하세요"
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

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isUpdating || nickname.trim().length < 2}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUpdating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    변경 중...
                  </div>
                ) : (
                  '닉네임 변경'
                )}
              </button>
            </form>
          </div>

          {/* 프로필 사진 등록 (향후 구현) */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">프로필 사진</h3>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-4">프로필 사진 등록 기능은 준비 중입니다.</p>
              <p className="text-sm text-gray-500">현재는 Google 계정의 프로필 사진을 사용합니다.</p>
            </div>
          </div>

          {/* 계정 관리 */}
          <div className="border-t pt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">계정 관리</h3>
            
            <div className="space-y-4">
              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                로그아웃
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                계정 삭제
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 계정 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">계정 삭제 확인</h3>
            <p className="text-gray-600 mb-6">
              정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAccountDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    삭제 중...
                  </div>
                ) : (
                  '계정 삭제'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage; 