'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../../utils/api';

const AuthSuccess: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const { token } = router.query;
    
    if (token && typeof token === 'string') {
      // 토큰을 localStorage에 저장
      localStorage.setItem('authToken', token); // TODO 쿠키로 옮기고 만료 안됬으면 자동 로그인
      
      
      // 프로필 설정 여부 확인 후 리다이렉트
      checkProfileSetup(token);
    }
  }, [router.query]);

  const checkProfileSetup = async (token: string) => {
    try {
      const userData = await api.getProfile(token);
      // 닉네임이 설정되어 있지 않으면 프로필 설정 페이지로
      if (!userData.nickname || !userData.profileSetup) {
        router.push('/setup-profile');
      } else {
              // 닉네임이 설정되어 있으면 메인 페이지로
      router.push('/main');
      }
    } catch (error) {
      console.error('Profile check error:', error);
      router.push('/main');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">로그인 성공!</h1>
          <p className="text-gray-600">잠시 후 메인 페이지로 이동합니다...</p>
        </div>
        
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccess; 