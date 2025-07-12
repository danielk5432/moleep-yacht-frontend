import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Dice {
  id: number;
  mesh: THREE.Mesh;
  body: CANNON.Body;
  selected: boolean;
  stoppedPosition?: THREE.Vector3;
  stoppedQuaternion?: THREE.Quaternion;
  targetPosition?: THREE.Vector3;
  faceNumber: number[];
  meshOrder: number[];
  color: string;

  constructor(id: number) {
    this.id = id;
    this.faceNumber = [1, 2, 3, 4, 5, 6]; // 기본값, 상속받아서 수정
    this.meshOrder = [1, 2, 3, 4, 5, 6]; // 기본값, 상속받아서 수정
    this.color = '#ffffff'; // 기본값, 상속받아서 수정
    this.selected = false;
    this.stoppedPosition = undefined;
    this.stoppedQuaternion = undefined;
    this.targetPosition = undefined;

    // Create mesh and body
    this.mesh = this.createDiceMesh();
    this.body = this.createDiceBody();
  }

  private createDiceMesh(): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const textures = this.createDiceTextures();

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

  private createDiceBody(): CANNON.Body {
    return new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
      sleepTimeLimit: 0.1,
    });
  }

  private createDiceTextures(): THREE.Texture[] {
    const textures: THREE.Texture[] = [];
    const dotRadius = 10;
    const size = 100;

    // 기본 dotPositions (1,2,3,4,5,6 순서)
    const dotPositions = [
      [[1, 1]], // 1
      [[0, 0], [2, 2]], // 2
      [[0, 0], [1, 1], [2, 2]], // 3
      [[0, 0], [0, 2], [2, 0], [2, 2]], // 4
      [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]], // 5
      [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]], // 6
    ];

    // meshOrder에 따라 dotPositions 재배열
    const orderedDotPositions = this.meshOrder.map(order => dotPositions[order - 1]);

    for (let i = 0; i < 6; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, size, size);

      ctx.fillStyle = '#000000';
      const spacing = size / 4;
      for (const [row, col] of orderedDotPositions[i]) {
        ctx.beginPath();
        ctx.arc(spacing * (col + 1), spacing * (row + 1), dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      textures.push(new THREE.CanvasTexture(canvas));
    }

    return textures;
  }

  getScore(): number {
    const up = new THREE.Vector3(0, 1, 0);

    // 각 면의 노멀과 숫자 매핑 (meshOrder에 따라)
    const faceNormals = [
      { normal: new THREE.Vector3(1, 0, 0), number: this.faceNumber[0] },   // +X
      { normal: new THREE.Vector3(-1, 0, 0), number: this.faceNumber[1] },  // -X
      { normal: new THREE.Vector3(0, 1, 0), number: this.faceNumber[2] },   // +Y
      { normal: new THREE.Vector3(0, -1, 0), number: this.faceNumber[3] },  // -Y
      { normal: new THREE.Vector3(0, 0, 1), number: this.faceNumber[4] },   // +Z
      { normal: new THREE.Vector3(0, 0, -1), number: this.faceNumber[5] }   // -Z
    ];

    // 가장 유사한 노멀 (코사인 유사도 기반)
    let maxDot = -Infinity;
    let topNumber = 0;

    for (const face of faceNormals) {
      const dot = up.dot(face.normal.applyQuaternion(this.mesh.quaternion));
      if (dot > maxDot) {
        maxDot = dot;
        topNumber = face.number;
      }
    }

    return topNumber;
  }

  // Scene과 PhysicsWorld에 추가하는 메소드
  addToScene(scene: THREE.Scene, physicsWorld: CANNON.World, position: CANNON.Vec3): void {
    scene.add(this.mesh);
    this.body.position.copy(position);
    this.mesh.position.copy(position);
    physicsWorld.addBody(this.body);
  }
}