import { Dice123 } from './123dice';
import { Dice } from './dice';
import { Dice456 } from './456dice';
import { Dice1 } from './1dice';
import { Dice2 } from './2dice';
import { Dice3 } from './3dice';
import { Dice4 } from './4dice';
import { Dice5 } from './5dice';
import { Dice6 } from './6dice';
import { Dice103050 } from './103050dice';
import { Dice204060 } from './204060dice';
import { DiceOdd } from './odddice';
import { DiceEven } from './evendice';

export { Dice } from './dice';
export { Dice123 } from './123dice'; 
export { Dice456 } from './456dice';
export { Dice1 } from './1dice';
export { Dice2 } from './2dice';
export { Dice3 } from './3dice';    
export { Dice4 } from './4dice';
export { Dice5 } from './5dice';
export { Dice6 } from './6dice';
export { Dice103050 } from './103050dice';
export { Dice204060 } from './204060dice';
export { DiceOdd } from './odddice';
export { DiceEven } from './evendice';

export const diceidmap: Map<number, typeof Dice> = new Map([
  [0, Dice],
  [1, Dice123],
  [2, Dice456],
  [3, Dice1],
  [4, Dice2],
  [5, Dice3],
  [6, Dice4],
  [7, Dice5],
  [8, Dice6],
  [9, Dice103050],
  [10, Dice204060],
  [11, DiceOdd],
  [12, DiceEven],
]);