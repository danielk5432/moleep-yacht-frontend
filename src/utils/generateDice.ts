// utils/generateDice.ts
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Dice } from '../types/dice';

export function generateDice(
  numberOfDice: number,
  scene: THREE.Scene,
  physicsWorld: CANNON.World
): Dice[] {
  const diceColors = ['#ffffff', '#ffdddd', '#ddffdd', '#ddddff', '#ffffdd'];
  const diceList: Dice[] = [];

  for (let i = 0; i < numberOfDice; i++) {
    const index = i % diceColors.length;
    const dice = new Dice(i, [1, 2, 3, 4, 5, 6], [1, 6, 2, 5, 3, 4], diceColors[index]);
    
    const initialPosition = new CANNON.Vec3(6, i * 1.5, 0);
    dice.addToScene(scene, physicsWorld, initialPosition);
    
    diceList.push(dice);
  }

  return diceList;
}
