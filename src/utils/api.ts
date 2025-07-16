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

  getNormalRankings: async (): Promise<RankEntry[]> => {
    console.log('Fetching normal mode rankings...');
    // 예시: const response = await apiClient.get('/rankings/normal');
    // return response.data;

    // --- 임시 목업 데이터 ---
    await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
    return [
      { rank: 1, nickname: 'ImTheFirst', score: 290, picture: '/images/YyachTify_Square.png' },
      { rank: 2, nickname: 'HIHI', score: 273, picture: '/images/YyachTify_Square.png' },
      { rank: 3, nickname: 'MolLeep', score: 266, picture: '/images/YyachTify_Square.png' },
      { rank: 4, nickname: 'GoodBOY', score: 251, picture: '/images/YyachTify_Square.png' },
      { rank: 5, nickname: 'BABO', score: 250, picture: '/images/YyachTify_Square.png' },
    ].sort((a, b) => b.score - a.score).map((user, index) => ({ ...user, rank: index + 1 }));
    // --- 임시 데이터 끝 ---
  },

  /**
   * 멀티플레이 모드 랭킹 데이터를 가져옵니다.
   * TODO: 실제 백엔드 API 엔드포인트로 교체하세요.
   */
  getMultiplayerRankings: async (): Promise<RankEntry[]> => {
    console.log('Fetching multiplayer mode rankings...');
    // 예시: const response = await apiClient.get('/rankings/multiplayer');
    // return response.data;
    
    // --- 임시 목업 데이터 ---
    await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
    return [
      { rank: 1, nickname: 'NOName', score: 270, picture: '/images/YyachTify_Square.png' },
      { rank: 2, nickname: 'NicePlayer', score: 253, picture: '/images/YyachTify_Square.png' },
      { rank: 3, nickname: 'YachTiFy', score: 222, picture: '/images/YyachTify_Square.png' },
    ].sort((a, b) => b.score - a.score).map((user, index) => ({ ...user, rank: index + 1 }));
    // --- 임시 데이터 끝 ---
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