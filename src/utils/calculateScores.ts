// utils/calculateYachtScores.ts
import { Dice } from "../types/dice";

function isConsecutive(numbers: number[], length: number, dice: Dice[]): { isValid: boolean; consecutiveDice: Dice[] } {
  if (numbers.length < length) return { isValid: false, consecutiveDice: [] };
  
  for (let i = 0; i <= numbers.length - length; i++) {
    let consecutive = true;
    for (let j = 0; j < length - 1; j++) {
      if (numbers[i + j + 1] - numbers[i + j] !== 1) {
        consecutive = false;
        break;
      }
    }
    if (consecutive) {
      // Find the dice that correspond to these consecutive numbers
      const consecutiveNumbers = numbers.slice(i, i + length);
      const consecutiveDice: Dice[] = [];
      
      for (const num of consecutiveNumbers) {
        const diceWithThisNumber = dice.filter(d => d.getScore() === num);
        // 모든 해당 주사위를 추가 (첫 번째만이 아님)
        consecutiveDice.push(...diceWithThisNumber);
      }
      
      return { isValid: true, consecutiveDice };
    }
  }
  return { isValid: false, consecutiveDice: [] };
}

export function calculateScores(dice: Dice[]): Record<string, Record<number, Dice[]>> {
  //if (dice.length !== 5) throw new Error("Exactly 5 dice values required.");

  const diceValues = dice.map(d => d.getScore());
  const counts = new Map<number, number>();
  diceValues.forEach(d => counts.set(d, (counts.get(d) || 0) + 1));

  const values = Array.from(counts.values());
  const unique = Array.from(new Set(diceValues)).sort((a, b) => a - b);

  const sum = diceValues.reduce((a, b) => a + b, 0);

  // Calculate straight results
  const littleStraightResult = isConsecutive(unique, 4, dice);
  const bigStraightResult = isConsecutive(unique, 5, dice);

  const scores: Record<string, Record<number, Dice[]>> = {
    Ones: {
      [dice.filter(d => d.getScore() === 1).reduce((a, b) => a + b.getScore(), 0)]: dice.filter(d => d.getScore() === 1)
    },
    Twos: {
      [dice.filter(d => d.getScore() === 2).reduce((a, b) => a + b.getScore(), 0)]: dice.filter(d => d.getScore() === 2)
    },
    Threes: {
      [dice.filter(d => d.getScore() === 3).reduce((a, b) => a + b.getScore(), 0)]: dice.filter(d => d.getScore() === 3)
    },
    Fours: {
      [dice.filter(d => d.getScore() === 4).reduce((a, b) => a + b.getScore(), 0)]: dice.filter(d => d.getScore() === 4)
    },
    Fives: {
      [dice.filter(d => d.getScore() === 5).reduce((a, b) => a + b.getScore(), 0)]: dice.filter(d => d.getScore() === 5)
    },
    Sixes: {
      [dice.filter(d => d.getScore() === 6).reduce((a, b) => a + b.getScore(), 0)]: dice.filter(d => d.getScore() === 6)
    },
 
    Choice: {
      [sum]: dice
    },

    "Four of a Kind": {
      [[...counts.entries()].find(([_, c]) => c >= 4)?.[0]! * 4 || 0]: 
        [...counts.entries()].find(([_, c]) => c >= 4) ? 
          dice.filter(d => d.getScore() === [...counts.entries()].find(([_, c]) => c >= 4)?.[0]) : []
    },

    "Full House": {
      [values.includes(3) && values.includes(2) ? sum + values.indexOf(3) : 0]: 
        values.includes(3) && values.includes(2) ? dice : []
    },

    "Little Straight": {
      [littleStraightResult.isValid ? 20 : 0]: 
        littleStraightResult.isValid ? littleStraightResult.consecutiveDice : []
    },

    "Big Straight": {
      [bigStraightResult.isValid ? 30 : 0]: 
        bigStraightResult.isValid ? bigStraightResult.consecutiveDice : []
    },

    Yacht: {
      [[...counts.entries()].find(([_, c]) => c >= 5)?.[0]! * 5 || 0]: 
        [...counts.entries()].find(([_, c]) => c >= 5) ? 
          dice.filter(d => d.getScore() === [...counts.entries()].find(([_, c]) => c >= 5)?.[0]) : []
    },
  };

  return scores;
}
