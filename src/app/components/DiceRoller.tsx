'use client';

import React, { useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import SelectedDiceView from './SelectedDiceView';

type Dice = {
  id: number;
  mesh: THREE.Mesh;
  body: CANNON.Body;
  selected: boolean;
  originalPosition: CANNON.Vec3;
  finalPosition?: THREE.Vector3;
  finalQuaternion?: THREE.Quaternion;
};

const DiceRoller: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scoreRef = useRef<HTMLSpanElement | null>(null);

  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const sceneRef = useRef<THREE.Scene>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const diceMeshRef = useRef<THREE.Mesh>(null);
  const physicsWorldRef = useRef<CANNON.World>(null);
  const diceArrayRef = useRef<Dice[]>([]);
  const [selectedMeshes, setSelectedMeshes] = useState<THREE.Mesh[]>([]);
  const [selectedDiceMap, setSelectedDiceMap] = useState<Map<string, Dice>>(new Map());
  const selectedCountRef = useRef(0); // 선택된 주사위 개수 추적
  const selectedMeshRefs = useRef<THREE.Mesh[]>([]);


  const fixedPositions: THREE.Vector3[] = [
    new THREE.Vector3(6, 0, 0),
    new THREE.Vector3(6, 0, 2),
    new THREE.Vector3(6, 0, -2),
    new THREE.Vector3(6, 0, 4),
    new THREE.Vector3(6, 0, -4),
  ];

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
    renderer.setSize(window.innerWidth, window.innerHeight - 100);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight - 100), 0.1, 300);
    camera.position.set(0, 15, 0);
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const ambientLight = new THREE.AmbientLight(0xffffff, 5);
    scene.add(ambientLight);

    const topLight = new THREE.PointLight(0xffffff, 3);
    topLight.position.set(0, 15, 0);
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

    function createDiceTextures(baseColor: string = '#ffffff') {
      const textures : THREE.Texture[] =  [];
      const dotRadius = 10;
      const size = 100;

      const dotPositions = [
        [[1, 1]],
        [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
        [[0, 0], [2, 2]],
        [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 0], [0, 2], [2, 0], [2, 2]],
      ];

      for (let i = 0; i < 6; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = baseColor; // ✅ 배경색
        ctx.fillRect(0, 0, size, size);

        ctx.fillStyle = '#000000';
        const spacing = size / 4;
        for (const [row, col] of dotPositions[i]) {
          ctx.beginPath();
          ctx.arc(spacing * (col + 1), spacing * (row + 1), dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        textures.push(new THREE.CanvasTexture(canvas));
      }

      return textures;
    }


    function getTopFaceNumber(quaternion: THREE.Quaternion): number {
      // 주사위의 로컬 Y+ 벡터 (윗면) → 월드 좌표계로 변환
      const up = new THREE.Vector3(0, 1, 0);

      // 각 면의 노멀과 숫자 매핑
      const faceNormals = [
        { normal: new THREE.Vector3(1, 0, 0), number: 1 },   // +X → texture[0]
        { normal: new THREE.Vector3(-1, 0, 0), number: 6 },  // -X → texture[1]
        { normal: new THREE.Vector3(0, 1, 0), number: 2 },   // +Y → texture[2]
        { normal: new THREE.Vector3(0, -1, 0), number: 5 },  // -Y → texture[3]
        { normal: new THREE.Vector3(0, 0, 1), number: 3 },   // +Z → texture[4]
        { normal: new THREE.Vector3(0, 0, -1), number: 4 }   // -Z → texture[5]
      ];

      // 가장 유사한 노멀 (코사인 유사도 기반)
      let maxDot = -Infinity;
      let topNumber = 0;

      for (const face of faceNormals) {
        const dot = up.dot(face.normal.applyQuaternion(quaternion));
        if (dot > maxDot) {
          maxDot = dot;
          topNumber = face.number;
        }
      }

      return topNumber;
    }

    const createDiceMesh = (color: string) => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const textures = createDiceTextures();

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
    };



    const diceColors = ['#ffffff', '#ffdddd', '#ddffdd', '#ddddff', '#ffffdd'];

    for (let i = 0; i < params.numberOfDice; i++) {
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

      diceArrayRef.current.push({
        id: i,
        mesh,
        body,
        selected: false,
        originalPosition: initialPosition.clone(),
        finalPosition: undefined,
        finalQuaternion: undefined,
      });
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

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        [...diceArrayRef.current.map(d => d.mesh), ...selectedMeshRefs.current]
      );

      if (intersects.length === 0) return;

      const clickedMesh = intersects[0].object as THREE.Mesh;

      // 🎯 복제 메시 클릭 → 복원
      const matchedMesh = selectedMeshRefs.current.find(m => m.uuid === clickedMesh.uuid);


      if (matchedMesh) {
        console.log("hihi");
        const originalDice = selectedDiceMap.get(clickedMesh.uuid);
        
        if (!originalDice) {
          console.warn('originalDice not found for uuid:', clickedMesh.uuid);
          return;
        }

        // ✅ 복제 메시 제거
        scene.remove(matchedMesh);
        selectedMeshRefs.current = selectedMeshRefs.current.filter(m => m.uuid !== matchedMesh.uuid);

        // ✅ 선택 상태 해제
        originalDice.selected = false;

        // ✅ 위치/회전 복원
        if (originalDice.finalPosition && originalDice.finalQuaternion) {
          originalDice.body.position.copy(new CANNON.Vec3(
            originalDice.finalPosition.x,
            originalDice.finalPosition.y,
            originalDice.finalPosition.z
          ));
          originalDice.mesh.position.copy(originalDice.finalPosition);

          originalDice.body.quaternion.copy(new CANNON.Quaternion(
            originalDice.finalQuaternion.x,
            originalDice.finalQuaternion.y,
            originalDice.finalQuaternion.z,
            originalDice.finalQuaternion.w
          ));
          originalDice.mesh.quaternion.copy(originalDice.finalQuaternion);
        }

        // ✅ 물리 속도 제거 및 wakeUp
        originalDice.body.velocity.setZero();
        originalDice.body.angularVelocity.setZero();
        originalDice.body.wakeUp();

        // ✅ 다시 scene에 추가
        scene.add(originalDice.mesh);

        // ✅ 상태 정리
        setSelectedMeshes(prev => prev.filter(m => m.uuid !== clickedMesh.uuid));
        setSelectedDiceMap(prev => {
          const map = new Map(prev);
          map.delete(clickedMesh.uuid);
          return map;
        });

        selectedCountRef.current -= 1;
        return;
      }else console.log("byebye");


      // 🎲 원래 주사위 클릭 → 복제 및 이동
      const diceItem = diceArrayRef.current.find(d => d.mesh === clickedMesh);
      if (!diceItem || diceItem.selected) return;

      diceItem.selected = true;
      diceItem.finalPosition = diceItem.mesh.position.clone();
      diceItem.finalQuaternion = diceItem.mesh.quaternion.clone();

      scene.remove(diceItem.mesh);

      // ✅ 현재 선택된 개수 기준 위치 계산
      const currentSelectedCount = selectedCountRef.current;
      const targetPosition = fixedPositions[currentSelectedCount] ?? new THREE.Vector3(8, currentSelectedCount * 1.5, 0);

      const newMesh = diceItem.mesh.clone();
      newMesh.userData.uuidForMap = newMesh.uuid; 
      
      newMesh.userData.originalId = diceItem.id;     // 추적용 커스텀 필드
      
      newMesh.position.copy(targetPosition);
      newMesh.quaternion.copy(diceItem.finalQuaternion);
      newMesh.castShadow = true;
      scene.add(newMesh);
      selectedMeshRefs.current.push(newMesh);

      setSelectedMeshes(prev => [...prev, newMesh]);
      setSelectedDiceMap(prev => {
        const map = new Map(prev);
        map.set(newMesh.userData.uuidForMap, diceItem);
        return map;
      });

      selectedCountRef.current += 1; // ✅ 수동 증가
    };




    canvas.addEventListener('click', onClick);
    return () => {
      canvas.removeEventListener('click', onClick);
    };

  }, []);
  return (
    <div className="relative w-full h-screen">
      {/* 시뮬레이터 canvas 전체화면 */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      <div className="absolute top-4 left-4 z-10 bg-white px-3 py-2 rounded shadow text-gray-800 font-medium">
        선택된 주사위: {selectedMeshes.length}개
      </div>
      {/* 점수 및 버튼 (optional) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-center">
        
        <span ref={scoreRef} className="text-lg font-semibold bg-white px-4 py-2 rounded shadow" />
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Throw the Dice
        </button>
      </div>

 
      
    </div>
  );
};

export default DiceRoller;