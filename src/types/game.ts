export type DiceState = 'roll' | 'stop' | 'animate';

export interface GameState {
  diceState: DiceState;
  isRolling: boolean;
  isAnimating: boolean;
  canSelect: boolean;
  canRoll: boolean;
}

export interface DiceStateManager {
  setState: (state: DiceState) => void;
  getState: () => DiceState;
  isRolling: () => boolean;
  isAnimating: () => boolean;
  canSelect: () => boolean;
  canRoll: () => boolean;
} 