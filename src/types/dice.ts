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
  backgroundColor: string;
  borderColor: string;
  dotColor: string;

  constructor(id: number) {
    this.id = id;
    this.faceNumber = [1, 2, 3, 4, 5, 6]; // 기본값, 상속받아서 수정
    this.meshOrder = [1, 6, 2, 5, 3, 4]; // 기본값, 상속받아서 수정
    this.backgroundColor = '#ffffff'; // 기본 배경색
    this.borderColor = '#ffffff'; // 기본 테두리색
    this.dotColor = '#000000'; // 기본 점색
    this.selected = false;
    this.stoppedPosition = undefined;
    this.stoppedQuaternion = undefined;
    this.targetPosition = undefined;

    // Create mesh and body
    this.mesh = this.createDiceMesh();
    this.body = this.createDiceBody();
  }

  protected createDiceMesh(): THREE.Mesh {
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

  protected createDiceTextures(): THREE.Texture[] {
    const textures: THREE.Texture[] = [];
    const dotRadius = 10;
    const size = 100;
    const borderWidth = 8;

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
    const orderedDotPositions = this.meshOrder.map(order => dotPositions[this.faceNumber[order - 1] - 1]);

    for (let i = 0; i < 6; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d')!;

      // 배경색
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(0, 0, size, size);

      // 테두리 그리기
      ctx.fillStyle = this.borderColor;
      ctx.fillRect(0, 0, size, borderWidth); // 상단
      ctx.fillRect(0, size - borderWidth, size, borderWidth); // 하단
      ctx.fillRect(0, 0, borderWidth, size); // 좌측
      ctx.fillRect(size - borderWidth, 0, borderWidth, size); // 우측

      // 점 그리기
      ctx.fillStyle = this.dotColor;
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
      { normal: new THREE.Vector3(1, 0, 0), meshIndex: 0 },   // +X
      { normal: new THREE.Vector3(-1, 0, 0), meshIndex: 1 },  // -X
      { normal: new THREE.Vector3(0, 1, 0), meshIndex: 2 },   // +Y
      { normal: new THREE.Vector3(0, -1, 0), meshIndex: 3 },  // -Y
      { normal: new THREE.Vector3(0, 0, 1), meshIndex: 4 },   // +Z
      { normal: new THREE.Vector3(0, 0, -1), meshIndex: 5 }   // -Z
    ];

    // 가장 유사한 노멀 (코사인 유사도 기반)
    let maxDot = -Infinity;
    let topNumber = 0;

    for (const face of faceNormals) {
      const dot = up.dot(face.normal.applyQuaternion(this.mesh.quaternion));
      if (dot > maxDot) {
        maxDot = dot;
        // meshOrder를 참고해서 올바른 faceNumber 찾기
        const meshOrderValue = this.meshOrder[face.meshIndex];
        topNumber = this.faceNumber[meshOrderValue - 1];
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