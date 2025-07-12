'use client';

import React, { useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Dice } from '../types/dice';
import { generateDice } from '../utils/generateDice';
import { getTopFaceNumber } from '../utils/getTopFaceNumber';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import SelectedDiceView from './SelectedDiceView';


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

    const newDice = generateDice(params.numberOfDice, scene, physicsWorld); // generate DICE
    diceArrayRef.current = newDice;

    
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
      if (!canvasRef.current || !cameraRef.current || !physicsWorldRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);

      // 모든 주사위 (선택 여부 관계없이)에 대해 교차 검사
      const intersects = raycaster.intersectObjects(
        diceArrayRef.current.map(d => d.mesh),
        true
      );

      if (intersects.length === 0) return;

      const clickedMesh = intersects[0].object as THREE.Mesh;

      // 클릭된 메시가 어떤 Dice 객체에 해당하는지 찾음
      const clickedDice = diceArrayRef.current.find(d => d.mesh === clickedMesh);

      if (!clickedDice) return; // 클릭된 메시가 주사위가 아니면 리턴

      if (clickedDice.selected) {
        // 🎯 이미 선택된 주사위를 다시 클릭 → 원래 상태로 복원
        console.log("Clicked on an already selected dice. Restoring it.");

        clickedDice.selected = false;

        // 물리 바디를 다시 활성화 (DYNAMIC)
        clickedDice.body.type = CANNON.Body.DYNAMIC;
        clickedDice.body.allowSleep = true;
        clickedDice.body.velocity.setZero();
        clickedDice.body.angularVelocity.setZero();

        // 저장해 둔 물리 시뮬레이션이 멈춘 위치/회전으로 복원
        if (clickedDice.stoppedPosition && clickedDice.stoppedQuaternion) {
            clickedDice.body.position.copy(new CANNON.Vec3(
                clickedDice.stoppedPosition.x,
                clickedDice.stoppedPosition.y,
                clickedDice.stoppedPosition.z
            ));
            clickedDice.body.quaternion.copy(new CANNON.Quaternion(
                clickedDice.stoppedQuaternion.x,
                clickedDice.stoppedQuaternion.y,
                clickedDice.stoppedQuaternion.z,
                clickedDice.stoppedQuaternion.w
            ));
        } else {
            // stoppedPosition이 없으면 초기 originalPosition으로 복원 (안전 장치)
            clickedDice.body.position.copy(clickedDice.originalPosition);
            clickedDice.body.quaternion.set(0, 0, 0, 1);
        }

        clickedDice.mesh.position.copy(clickedDice.body.position as any);
        clickedDice.mesh.quaternion.copy(clickedDice.body.quaternion as any);
        clickedDice.body.wakeUp(); // 물리 시뮬레이션에 참여하도록 깨우기

        setSelectedMeshes(prev => prev.filter(m => m.uuid !== clickedDice.mesh.uuid));
        setSelectedDiceMap(prev => {
          const map = new Map(prev);
          map.delete(clickedDice.mesh.uuid);
          return map;
        });
        selectedCountRef.current -= 1;

      } else {
        // 🎲 선택되지 않은 주사위를 클릭 → 선택된 위치로 이동
        console.log("Clicked on an unselected dice. Selecting it.");

        // 주사위가 멈춰있을 때만 선택 가능하도록 (선택 시점의 최종 위치 저장)
        if (clickedDice.body.sleepState !== CANNON.Body.SLEEPING) {
          console.log("Dice is still moving, cannot select.");
          return;
        }

        clickedDice.selected = true;
        clickedDice.stoppedPosition = clickedDice.mesh.position.clone(); // 물리 시뮬레이션이 멈춘 위치 저장
        clickedDice.stoppedQuaternion = clickedDice.mesh.quaternion.clone(); // 물리 시뮬레이션이 멈춘 회전 저장

        // 물리 바디를 STATIC으로 변경하여 물리 시뮬레이션의 영향을 받지 않도록 함
        clickedDice.body.type = CANNON.Body.STATIC;
        clickedDice.body.allowSleep = false; // 더 이상 슬립 상태가 되면 안됨

        // 화면상에서 주사위를 고정된 위치로 직접 이동
        const currentSelectedCount = selectedCountRef.current;
        const targetPosition = fixedPositions[currentSelectedCount] ?? new THREE.Vector3(8, currentSelectedCount * 1.5, 0);

        clickedDice.mesh.position.copy(targetPosition);
        // 회전은 유지하거나 필요하면 특정 각도로 고정
        // clickedDice.mesh.quaternion.identity(); // 예: 선택 시 정렬하고 싶다면

        // 물리 바디의 위치도 해당 위치로 직접 설정
        clickedDice.body.position.copy(new CANNON.Vec3(targetPosition.x, targetPosition.y, targetPosition.z));
        // 물리 바디의 회전도 메시와 동기화
        clickedDice.body.quaternion.copy(new CANNON.Quaternion(
            clickedDice.mesh.quaternion.x,
            clickedDice.mesh.quaternion.y,
            clickedDice.mesh.quaternion.z,
            clickedDice.mesh.quaternion.w
        ));


        setSelectedMeshes(prev => [...prev, clickedDice.mesh]);
        setSelectedDiceMap(prev => {
          const map = new Map(prev);
          map.set(clickedDice.mesh.uuid, clickedDice);
          return map;
        });
        selectedCountRef.current += 1;
      }
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