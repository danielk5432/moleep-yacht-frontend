import { create } from "zustand";

export type GameAction = "roll" | "selectScore" | "roulette" | "wait" | string;

// 주사위 물리량 타입 정의
export interface DicePhysics {
  id: number; // 주사위 고유 식별자
  type: number; // 주사위 종류(예: d6 등)
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number }; // 쿼터니언
  velocity: { x: number; y: number; z: number };
  angularVelocity: { x: number; y: number; z: number };
  impulse?: { x: number; y: number; z: number }; // 던질 때 쓸 힘
  angularImpulse?: { x: number; y: number; z: number }; // 회전 힘
}

interface GameState {
  isMyTurn: boolean;
  scores: Record<string, number>;
  availableActions: GameAction[];
  selected: Record<string, any>;
  dicePhysics: DicePhysics[];
  diceState: 'roll' | 'stop' | 'animate';
  rollcount: number; // 주사위 굴린 횟수
  setIsMyTurn: (turn: boolean) => void;
  setScores: (scores: Record<string, number>) => void;
  setAvailableActions: (actions: GameAction[]) => void;
  setSelected: (selected: Record<string, any>) => void;
  setDicePhysics: (physics: DicePhysics[]) => void;
  setRollCount: (count: number) => void;
  setDiceState: (state: 'roll' | 'stop' | 'animate') => void;
}

export const useGameStore = create<GameState>((set) => ({
  isMyTurn: true,
  dicePhysics: [],
  scores: {},
  availableActions: [],
  selected: {},
  rollcount: 0,
  diceState: 'stop',
  setIsMyTurn: (turn) => set({ isMyTurn: turn }),
  setScores: (scores) => set({ scores }),
  setAvailableActions: (actions) => set({ availableActions: actions }),
  setSelected: (selected) => set({ selected }),
  setDicePhysics: (physics) => set({ dicePhysics: physics }),
  setRollCount: (count) => set({ rollcount: count }),
  setDiceState: (state) => set({ diceState: state })
})); 

