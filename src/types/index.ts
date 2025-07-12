import { Dice123 } from './123dice';
import { Dice } from './dice';

export { Dice } from './dice';
export { Dice123 } from './123dice'; 

export const diceidmap: Map<number, typeof Dice> = new Map([
  [0, Dice],
  [1, Dice123]
]);