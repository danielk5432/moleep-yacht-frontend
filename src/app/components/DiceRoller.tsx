'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';


const DiceRoller: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scoreRef = useRef<HTMLSpanElement | null>(null);

  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const diceMeshRef = useRef<THREE.Mesh>(null);
  const physicsWorldRef = useRef<CANNON.World>(null);
  const diceArrayRef = useRef<{ mesh: THREE.Object3D; body: CANNON.Body }[]>([]);

  const params = {
    numberOfDice: 5,
    segments: 40,
    edgeRadius: 0.07,
    notchRadius: 0.15,
    notchDepth: 0.1,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const scoreResult = scoreRef.current;
    if (!canvas || !scoreResult) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.position.set(0, 15, 10);
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);

    const topLight = new THREE.PointLight(0xffffff, 5);
    topLight.position.set(10, 15, 0);
    topLight.castShadow = true;
    topLight.shadow.mapSize.width = 2048;
    topLight.shadow.mapSize.height = 2048;
    topLight.shadow.camera.near = 5;
    topLight.shadow.camera.far = 400;

    scene.add(topLight);
    scene.background = new THREE.Color('#f0f0f0');

    const physicsWorld = new CANNON.World({
      allowSleep: true,
      gravity: new CANNON.Vec3(0, -50, 0),
    });
    physicsWorld.defaultContactMaterial.restitution = 0.3;
    physicsWorldRef.current = physicsWorld;

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(5, 64),
      new THREE.MeshStandardMaterial({ color: 0x006600 }) // 초록색 felt 느낌
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -7; 
    scene.add(floor);

    const floorBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });
    floorBody.position.copy(floor.position as any);
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    physicsWorld.addBody(floorBody);



    const wallRadius = 5;
    const wallHeight = 2;
    const wallThickness = 0.3;

    // 비어 있는 원기둥으로 벽을 생성
    const wall = new CANNON.Body({ type: CANNON.Body.STATIC });
    const segments = 32;

    for (let i = 0; i < segments; i++) {
      const theta = (2 * Math.PI * i) / segments;
      const x = Math.cos(theta) * wallRadius;
      const z = Math.sin(theta) * wallRadius;

      const box = new CANNON.Box(new CANNON.Vec3(wallThickness / 2, wallHeight / 2, 0.2));
      const quaternion = new CANNON.Quaternion();
      quaternion.setFromEuler(0, -theta, 0);

      wall.addShape(box, new CANNON.Vec3(x, wallHeight / 2 - 7, z), quaternion);
    }

    physicsWorld.addBody(wall);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(wallRadius - wallThickness, wallRadius + wallThickness, 64),
      new THREE.MeshStandardMaterial({ color: 0x8b4513, side: THREE.DoubleSide }) // 갈색 나무
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -7 + 0.01; // 살짝 위로
    scene.add(ring);

    function createDiceTextures() {
      const textures : THREE.Texture[] =  [];
      const dotRadius = 10;
      const size = 128;

      const dotPositions = [
        [[1, 1]],
        [[0, 0], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 0], [0, 2], [2, 0], [2, 2]],
        [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
        [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]]
      ];

      for (let i = 0; i < 6; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        ctx.fillStyle = '#000000';
        const spacing = size / 4;
        for (const [row, col] of dotPositions[i]) {
          ctx.beginPath();
          ctx.arc(spacing * (col + 1), spacing * (row + 1), dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        const texture = new THREE.CanvasTexture(canvas);
        textures.push(texture);
      }

      return textures;
    }


    function getTopFaceNumber(quaternion: THREE.Quaternion): number {
      // 주사위의 로컬 Y+ 벡터 (윗면) → 월드 좌표계로 변환
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion);

      // 각 면의 노멀과 숫자 매핑
      const faceNormals = [
        { normal: new THREE.Vector3(1, 0, 0), number: 6 },   // +X → texture[0]
        { normal: new THREE.Vector3(-1, 0, 0), number: 2 },  // -X → texture[1]
        { normal: new THREE.Vector3(0, 1, 0), number: 3 },   // +Y → texture[2]
        { normal: new THREE.Vector3(0, -1, 0), number: 4 },  // -Y → texture[3]
        { normal: new THREE.Vector3(0, 0, 1), number: 5 },   // +Z → texture[4]
        { normal: new THREE.Vector3(0, 0, -1), number: 1 }   // -Z → texture[5]
      ];

      // 가장 유사한 노멀 (코사인 유사도 기반)
      let maxDot = -Infinity;
      let topNumber = 0;

      for (const face of faceNormals) {
        const dot = up.dot(face.normal);
        if (dot > maxDot) {
          maxDot = dot;
          topNumber = face.number;
        }
      }

      return topNumber;
    }

    const createDiceMesh = () => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const textures = createDiceTextures();

      const materials = textures.map(texture =>
        new THREE.MeshStandardMaterial({
          map: texture,
          metalness: 0,
          roughness: 0.3,
          emissive: new THREE.Color(0xffffff),
          emissiveIntensity: 0.1,
        })
      );

      const mesh = new THREE.Mesh(geometry, materials);
      mesh.castShadow = true;
      return mesh;
    };


    const diceMesh = createDiceMesh();
    diceMeshRef.current = diceMesh;

    for (let i = 0; i < params.numberOfDice; i++) {
      const mesh = diceMesh.clone();
      scene.add(mesh);
      const body = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
        sleepTimeLimit: 0.1,
      });
      physicsWorld.addBody(body);
      diceArrayRef.current.push({ mesh, body });
    }
    
    let scored = false;

    const render = () => {
      physicsWorld.fixedStep();

      let allSleeping = true;
      for (const dice of diceArrayRef.current) {
        dice.mesh.position.copy(dice.body.position);
        dice.mesh.quaternion.copy(dice.body.quaternion);

        if (dice.body.sleepState !== CANNON.Body.SLEEPING) {
          allSleeping = false;
        }
      }

      if (allSleeping && !scored) {
        const scores = diceArrayRef.current.map(d => getTopFaceNumber(d.mesh.quaternion));
        scoreRef.current!.innerHTML = scores.join(' + ') + ' = ' + scores.reduce((a, b) => a + b, 0);
        scored = true;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    const throwDice = () => {
      scored = false;
      if (!scoreResult) return;
      scoreResult.innerHTML = '';
      diceArrayRef.current.forEach((d, i) => {
        d.body.velocity.setZero();
        d.body.angularVelocity.setZero();
        d.body.position = new CANNON.Vec3(6, i * 1.5, 0);
        d.mesh.position.copy(d.body.position);
        d.mesh.rotation.set(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random());

        // ✅ three.js quaternion → cannon-es quaternion 변환
        const threeQuat = d.mesh.quaternion;
        d.body.quaternion.set(threeQuat.x, threeQuat.y, threeQuat.z, threeQuat.w);

        const force = 3 + 5 * Math.random();
        d.body.applyImpulse(new CANNON.Vec3(-force, force, 0), new CANNON.Vec3(0, 0, 0.2));
        d.body.allowSleep = true;
      });
    };

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    throwDice();
    render();
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100%', height: '300px' }} />
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        Score: <span ref={scoreRef}></span>
        <button onClick={() => window.location.reload()} style={{ marginLeft: 10 }}>Throw the Dice</button>
      </div>
    </div>
  );
};

export default DiceRoller;