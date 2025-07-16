// 백엔드 API URL (8443 포트)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8443';

interface RankEntry {
  rank: number;
  nickname: string;
  score: number;
  picture: string;
}

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
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Profile fetch error:', errorText);
        throw new Error(`Failed to get profile: ${response.status} ${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Network error:', error);
      throw error;
    }
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
  },

  // 닉네임 설정
  setupProfile: async (token: string, nickname: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/setup-profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Profile setup error:', errorText);
        throw new Error(`Failed to setup profile: ${response.status} ${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Network error during profile setup:', error);
      throw error;
    }
  },

  /**
   * 게임 점수를 서버에 제출합니다.
   * @param score - 제출할 점수
   * @param mode - 게임 모드 ('normal' 또는 'multiplayer')
   */
  submitScore: async (score: number, mode: 'normal' | 'multiplayer') => {
    const token = localStorage.getItem('authToken'); // 토큰 저장 방식에 맞게 수정
    if (!token) {
      throw new Error('Access Token not found. Please log in.');
    }

    // Next.js 내부 API를 호출하므로 API_BASE_URL이 필요 없습니다.
    const response = await fetch('/api/rankings/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // 인증 헤더 추가
      },
      body: JSON.stringify({ score, mode }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit score.');
    }

    return response.json();
  },

  getNormalRankings: async (): Promise<RankEntry[]> => {
    try {
      // Next.js 내부 API를 호출하므로, 전체 URL 대신 상대 경로를 사용합니다.
      const response = await fetch('/api/rankings/normal');
      if (!response.ok) {
        throw new Error('Failed to fetch normal rankings');
      }
      return response.json();
    } catch (error) {
      console.error('API Error (Normal Rankings):', error);
      return []; // 에러 발생 시 빈 배열 반환하여 페이지가 깨지는 것을 방지
    }
  },

  // ✅ 멀티플레이 모드 랭킹 가져오기 (실제 API 호출)
  getMultiplayerRankings: async (): Promise<RankEntry[]> => {
    try {
      const response = await fetch('/api/rankings/multiplayer');
      if (!response.ok) {
        throw new Error('Failed to fetch multiplayer rankings');
      }
      return response.json();
    } catch (error) {
      console.error('API Error (Multiplayer Rankings):', error);
      return [];
    }
  },

  // 계정 삭제
  deleteAccount: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Account deletion error:', errorText);
        throw new Error(`Failed to delete account: ${response.status} ${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Network error during account deletion:', error);
      throw error;
    }
  }
}; 