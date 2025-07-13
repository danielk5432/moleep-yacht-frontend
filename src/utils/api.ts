// 백엔드 API URL (8443 포트)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8443';

export const api = {
  // Google OAuth 로그인 URL 가져오기
  getGoogleAuthUrl: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/google`);
    if (!response.ok) {
      throw new Error('Failed to get auth URL');
    }
    return response.json();
  },

  // 사용자 프로필 가져오기
  getProfile: async (token: string) => {
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('Requesting URL:', `${API_BASE_URL}/api/profile`);
    
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error('Failed to get profile');
    }
    
    return response.json();
  },

  // 토큰 유효성 검사
  validateToken: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}; 