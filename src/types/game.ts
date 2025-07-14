// 게임 상태 관련 타입들
export type DiceState = 'roll' | 'stop' | 'animate';
export type GameState = 'waiting' | 'playing' | 'finished';
export type GamePhase = 'myturn' | 'oppturn' | 'waiting' | 'matching' | 'finished';

// 게임 액션 타입
export interface GameAction {
  type: string;
  payload?: any;
}

// 매칭 데이터 타입
export interface MatchData {
  roomId: string;
  players: Array<{
    id: string;
    nickname: string;
  }>;
  opponent: {
    id: string;
    nickname: string;
  };
  myTurn: boolean;
} 