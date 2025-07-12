// utils/generateDice.ts
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { createDiceTextures } from './createDiceTextures';
import { Dice } from '../types/dice';

export function createDiceMesh(color: string): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const textures = createDiceTextures(color);

  const materials = textures.map(texture =>
    new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0,
      roughness: 0.3,
    })
  );

  const mesh = new THREE.Mesh(geometry, materials);
  mesh.castShadow = true;
  return mesh;
}

export function generateDice(
  numberOfDice: number,
  scene: THREE.Scene,
  physicsWorld: CANNON.World
): Dice[] {
  const diceColors = ['#ffffff', '#ffdddd', '#ddffdd', '#ddddff', '#ffffdd'];
  const diceList: Dice[] = [];

  for (let i = 0; i < numberOfDice; i++) {
    const index = i % diceColors.length;
    const mesh = createDiceMesh(diceColors[index]);
    scene.add(mesh);

    const body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
      sleepTimeLimit: 0.1,
    });

    const initialPosition = new CANNON.Vec3(6, i * 1.5, 0);
    body.position.copy(initialPosition);
    mesh.position.copy(initialPosition);

    physicsWorld.addBody(body);

    diceList.push({
      id: i,
      mesh,
      body,
      selected: false,
      originalPosition: initialPosition.clone(),
      stoppedPosition: undefined,
      stoppedQuaternion: undefined,
    });
  }

  return diceList;
}
