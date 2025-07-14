// utils/generateDice.ts
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Dice, diceidmap} from '../types';

export function generateDice(
  numberOfDice: number,
  scene: THREE.Scene,
  physicsWorld: CANNON.World,
  diceid:number
): Dice[] {
  const diceList: Dice[] = [];

  for (let i = 0; i < numberOfDice; i++) {
    const dice = i !== 4 ? new Dice(i) : new (diceidmap.get(11) ?? Dice)(i);

    const initialPosition = new CANNON.Vec3(6, i * 1.5, 0);
    dice.addToScene(scene, physicsWorld, initialPosition);
    diceList.push(dice);
  }

  return diceList;
}
