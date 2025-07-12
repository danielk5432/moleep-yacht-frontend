// utils/calculateYachtScores.ts

export function calculateScores(dice: number[]): Record<string, number> {
  //if (dice.length !== 5) throw new Error("Exactly 5 dice values required.");

  const counts = new Map<number, number>();
  dice.forEach(d => counts.set(d, (counts.get(d) || 0) + 1));

  const values = Array.from(counts.values());
  const unique = Array.from(new Set(dice)).sort((a, b) => a - b);

  const sum = dice.reduce((a, b) => a + b, 0);

  const scores: Record<string, number> = {
    Ones: dice.filter(d => d === 1).reduce((a, b) => a + b, 0),
    Twos: dice.filter(d => d === 2).reduce((a, b) => a + b, 0),
    Threes: dice.filter(d => d === 3).reduce((a, b) => a + b, 0),
    Fours: dice.filter(d => d === 4).reduce((a, b) => a + b, 0),
    Fives: dice.filter(d => d === 5).reduce((a, b) => a + b, 0),
    Sixes: dice.filter(d => d === 6).reduce((a, b) => a + b, 0),
 
    Choice: sum,

    "Four of a Kind":
      [...counts.entries()].find(([_, c]) => c >= 4)?.[0]! * 4 || 0,

    "Full House":
      values.includes(3) && values.includes(2) ? sum : 0,

    "Little Straight":
      JSON.stringify(unique) === JSON.stringify([1, 2, 3, 4, 5]) ? 20 : 0,

    "Big Straight":
      JSON.stringify(unique) === JSON.stringify([2, 3, 4, 5, 6]) ? 30 : 0,

    Yacht: values.includes(5) ? 50 : 0,
  };

  return scores;
}
