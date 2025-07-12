import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export type Dice = {
  id: number;
  mesh: THREE.Mesh;
  body: CANNON.Body;
  selected: boolean;
  originalPosition: CANNON.Vec3;
  stoppedPosition?: THREE.Vector3;
  stoppedQuaternion?: THREE.Quaternion;
  targetPosition?: THREE.Vector3;

};