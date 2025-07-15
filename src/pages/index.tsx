'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../utils/api';

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.log('No token found, redirecting to login');
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
      
      console.log('Profile is setup, redirecting to main');
      // 프로필이 설정되어 있으면 메인 페이지로
      if (userData.nickname) {
        localStorage.setItem('nickname', userData.nickname);
      }
      router.push('/main');
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('authToken');
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" style={{ fontFamily: 'DungGeunMo' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 상태를 확인하는 중...</p>
        <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p>
      </div>
    </div>
  );
};

export default HomePage;
