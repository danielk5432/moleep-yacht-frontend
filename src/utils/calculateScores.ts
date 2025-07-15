// utils/calculateYachtScores.ts
import { Dice } from "../types/dice";
import { DiceWild } from "../types/wilddice";

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

  const diceValues = dice.map(d => d.getScore());
  const counts = new Map<number, number>();
  diceValues.forEach(d => counts.set(d, (counts.get(d) || 0) + 1));

  const values = Array.from(counts.values());
  const unique = Array.from(new Set(diceValues)).sort((a, b) => a - b);

  const sum = diceValues.reduce((a, b) => a + b, 0);

  // Calculate straight results
  const StraightResult = isConsecutive(unique, 3, dice);
  const littleStraightResult = isConsecutive(unique, 4, dice);
  const bigStraightResult = isConsecutive(unique, 5, dice);

  const onesSum = dice.filter(d => d.getScore() === 1).reduce((a, b) => a + b.getScore(), 0);
  const twosSum = dice.filter(d => d.getScore() === 2).reduce((a, b) => a + b.getScore(), 0);
  const threesSum = dice.filter(d => d.getScore() === 3).reduce((a, b) => a + b.getScore(), 0);
  const foursSum = dice.filter(d => d.getScore() === 4).reduce((a, b) => a + b.getScore(), 0);
  const fivesSum = dice.filter(d => d.getScore() === 5).reduce((a, b) => a + b.getScore(), 0);
  const sixesSum = dice.filter(d => d.getScore() === 6).reduce((a, b) => a + b.getScore(), 0);

  const wildDiceList = dice.filter(d => d instanceof DiceWild);
  const isWild = wildDiceList.length > 0;
  const scores: Record<string, Record<number, Dice[]>> = {
    Ones: {
      [isWild ? onesSum + 1 : onesSum] : dice.filter(d => d.getScore() === 1).concat(
        isWild ? dice.find(d => d instanceof DiceWild)! : []
      ),
    },

    Twos: {
      [isWild ? twosSum + 2 : twosSum]: dice.filter(d => d.getScore() === 2).concat(
        isWild ? dice.find(d => d instanceof DiceWild)! : []
      ),
    },

    Threes: {
      [isWild ? threesSum + 3 : threesSum]: dice.filter(d => d.getScore() === 3).concat(
        isWild ? dice.find(d => d instanceof DiceWild)! : []
      ),
    },

    Fours: {
      [isWild ? foursSum + 4 : foursSum]: dice.filter(d => d.getScore() === 4).concat(
        isWild ? dice.find(d => d instanceof DiceWild)! : []
      ),
    },

    Fives: {
      [isWild ? fivesSum + 5 : fivesSum]: dice.filter(d => d.getScore() === 5).concat(
        isWild ? dice.find(d => d instanceof DiceWild)! : []
      ),
    },

    Sixes: {
      [isWild ? sixesSum + 6 : sixesSum]: dice.filter(d => d.getScore() === 6).concat(
        isWild ? dice.find(d => d instanceof DiceWild)! : []
      ),
    },

    Choice: {
      [isWild ? sum + 6 : sum]: dice.concat(
        isWild ? dice.find(d => d instanceof DiceWild)! : []
      ),
    },
    
    "Four of a Kind": (() => {
      // 4개짜리 먼저 찾기
      let entry = [...counts.entries()].find(([_, c]) => c >= 4);

      // isWild일 때 3개짜리가 있는 경우에도 허용
      if (isWild && !entry) {
        entry = [...counts.entries()].find(([_, c]) => c === 3);
      }

      if (entry) {
        const [face, count] = entry;
        const matched = dice.filter(d => d.getScore() === face);
        const wild = isWild ? dice.find(d => d instanceof DiceWild)! : null;

        return {
          [face * 4]: wild ? matched.concat(wild) : matched
        };
      }

      return { 0: [] };
    })(),

      "Full House": (() => {
        let tripleValue: number | undefined;
        let pairValue: number | undefined;

        if (!isWild) {
          // 기본 Full House: 3 + 2
          tripleValue = [...counts.entries()].find(([_, c]) => c === 3)?.[0];
          pairValue = [...counts.entries()].find(([_, c]) => c === 2)?.[0];
          if (tripleValue && pairValue) {
            return {
              [sum + tripleValue]: dice
            };
          }
          return { 0: [] };
        }

        // Wild 있을 경우 보정 로직
        // case1: 3개짜리가 있고, 나머지 중 하나 + wild로 2개 만들 수 있을 때
        const countEntries = [...counts.entries()];
        tripleValue = countEntries.find(([_, c]) => c === 3)?.[0];
        if (tripleValue) {
          pairValue = countEntries.find(([v, c]) => c === 1 && v !== tripleValue)?.[0];
          if (pairValue) {
            const tripleDice = dice.filter(d => d.getScore() === tripleValue);
            const pairDice = dice.filter(d => d.getScore() === pairValue);
            const wild = dice.find(d => d instanceof DiceWild)!;
            return {
              [sum + tripleValue]: [...tripleDice, ...pairDice, wild]
            };
          }
        }

        // case2: 2개짜리 두 종류가 있고 wild로 하나를 보정해서 3개 만들기
        const twoPairs = countEntries.filter(([_, c]) => c === 2);
        if (twoPairs.length >= 2) {
          // 하나를 triple로 승격
          tripleValue = twoPairs[0][0];
          pairValue = twoPairs[1][0];
          const tripleDice = dice.filter(d => d.getScore() === tripleValue);
          const pairDice = dice.filter(d => d.getScore() === pairValue);
          const wild = dice.find(d => d instanceof DiceWild)!;
          return {
            [sum + tripleValue]: [...tripleDice, wild, ...pairDice]
          };
        }

        return { 0: [] };
      })(),

      "Little Straight": (() => {
        if (littleStraightResult.isValid) {
          return { 20: littleStraightResult.consecutiveDice } as Record<number, Dice[]>;
        }

        if (isWild && StraightResult.isValid) {
          const wild = dice.find(d => d instanceof DiceWild)!;
          return { 20: [...StraightResult.consecutiveDice, wild] } as Record<number, Dice[]>;
        }

        return { 0: [] } as Record<number, Dice[]>;
      })(),

      "Big Straight": (() => {
        if (bigStraightResult.isValid) {
          return { 30: bigStraightResult.consecutiveDice } as Record<number, Dice[]>;
        }

        if (isWild && littleStraightResult.isValid) {
          const wild = dice.find(d => d instanceof DiceWild)!;
          return { 30: [...littleStraightResult.consecutiveDice, wild] } as Record<number, Dice[]>;
        }

        return { 0: [] } as Record<number, Dice[]>;
      })(),

      Yacht: (() => {
        // 5개짜리가 있으면 우선 그대로 처리
        const fiveOfAKind = [...counts.entries()].find(([_, c]) => c >= 5);
        if (fiveOfAKind) {
          const num = fiveOfAKind[0];
          return {
            50: dice.filter(d => d.getScore() === num)
          } as Record<number, Dice[]>;
        }

        // Wild 주사위가 있고, 동일한 숫자 4개가 있을 경우
        if (isWild) {
          const fourOfAKind = [...counts.entries()].find(([_, c]) => c === 4);
          if (fourOfAKind) {
            const num = fourOfAKind[0];
            const matched = dice.filter(d => d.getScore() === num);
            const wild = dice.find(d => d instanceof DiceWild)!;
            return {
              50: [...matched, wild]
            } as Record<number, Dice[]>;
          }
        }

        return { 0: [] } as Record<number, Dice[]>;
      })(),
    };

  return scores;
}
