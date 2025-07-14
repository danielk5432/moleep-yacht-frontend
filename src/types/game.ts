export type DiceState = 'roll' | 'stop' | 'animate';

export type GamePhase = 'myturn' | 'oppturn' | 'roll' | 'waiting' | 'finished';

export interface GameState {
  diceState: DiceState;
  gamePhase: GamePhase;
  isRolling: boolean;
  isAnimating: boolean;
  canSelect: boolean;
  canRoll: boolean;
  rollCount: number;
  maxRollCount: number;
}

export interface DiceStateManager {
  setState: (state: DiceState) => void;
  getState: () => DiceState;
  isRolling: () => boolean;
  isAnimating: () => boolean;
  canSelect: () => boolean;
  canRoll: () => boolean;
}

export interface GameAction {
  type: 'THROW_DICE' | 'SELECT_DICE' | 'SCORE_POINT' | 'START_TURN' | 'END_TURN';
  payload?: any;
} 