'use client';
// src/pages/Dice.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DiceRoller from '../components/DiceRoller';
import { api } from '../utils/api';

const Dice: React.FC = () => {
  const router = useRouter();
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
      const userData = await api.getProfile(token);
      
      // 프로필 설정이 안 되어 있으면 설정 페이지로
      if (!userData.nickname || !userData.profileSetup) {
        router.push('/setup-profile');
        return;
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('authToken');
      router.push('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" style={{ fontFamily: 'DungGeunMo' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <DiceRoller />
    </div>
  );
};

export default Dice;
