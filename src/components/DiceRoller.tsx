'use client';

import React, { useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Dice } from '../types/dice';
import { generateDice } from '../utils/generateDice';
import { getTopFaceNumber } from '../utils/getTopFaceNumber';
import ScoreTable from './ScoreTable';
import { calculateScores } from '../utils/calculateScores';



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
  const selectedDiceMapRef = useRef<Map<string, Dice>>(new Map());
  const [topFaces, setTopFaces] = useState<number[]>([]);
  const [savedScores, setSavedScores] = useState<Map<string, number>>(new Map());
  

  const [rollCount, setRollCount] = useState(0);
  const maxRollCount = 3;


  function getDynamicFixedPositions(n: number): THREE.Vector3[] {
    const spacing = 1.5;
    const startZ = -((n - 1) * spacing) / 2; // 중앙 정렬
    const x = 6; // 오른쪽 정렬 기준 X 위치
    const y = 0;

    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < n; i++) {
      positions.push(new THREE.Vector3(x, y, startZ + i * spacing));
    }
    return positions;
  }

  const throwDice = () => {
    if (rollCount >= maxRollCount) return;

    if (!scoreRef.current) return;
    scoreRef.current.innerHTML = '';
    
    // 점수판 초기화
    setTopFaces([]);

    diceArrayRef.current.forEach((d, i) => {
      if (d.selected) return; 

      d.body.type = CANNON.Body.DYNAMIC;
      d.body.allowSleep = true;

      d.body.velocity.setZero();
      d.body.angularVelocity.setZero();
      d.mesh.position.copy(d.body.position as any);
      const impulse = new CANNON.Vec3(
        (Math.random() - 0.5) * 2,  // X 방향: 약간의 흔들림
        20 + Math.random() * 5,     // Y 방향: 위쪽 강한 충격
        (Math.random() - 0.5) * 2   // Z 방향: 약간의 흔들림
      );
      const contactPoint = new CANNON.Vec3(0, 0, 0.2); // 중심에서 약간 위쪽
      const threeQuat = d.mesh.quaternion;
      d.body.quaternion.set(threeQuat.x, threeQuat.y, threeQuat.z, threeQuat.w);
      d.body.applyImpulse(impulse, contactPoint);
      d.mesh.rotation.set(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random());
      d.body.wakeUp(); 
    });

    // 이 setTimeout 로직은 그대로 유지해도 괜찮습니다.

    setRollCount(prev => prev + 1);
  };


  

  const handleResetAndThrow = () => {
    setRollCount(1);
    let i = 0
    // 선택 상태 및 위치 초기화
    for (const d of diceArrayRef.current) {
      d.selected = false;
      d.body.type = CANNON.Body.DYNAMIC;
      d.body.allowSleep = true;
      d.body.velocity.setZero();
      d.body.angularVelocity.setZero();

      // 초기 위치로 재배치
      d.body.position = new CANNON.Vec3(4, i * 1.5, 0);
      d.mesh.position.copy(d.body.position);
      i += 1;
      // 회전 무작위 설정
      d.mesh.rotation.set(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random());
      d.body.quaternion.setFromEuler(
        d.mesh.rotation.x,
        d.mesh.rotation.y,
        d.mesh.rotation.z
      );
      // 무작위 임펄스 적용
      const force = 3 + 5 * Math.random();
      d.body.applyImpulse(
        new CANNON.Vec3(-force, force, 0),
        new CANNON.Vec3(0, 0, 0.2)
      );

      d.body.wakeUp();
    }

    // 선택 상태 리셋
    selectedMeshRefs.current = [];
    selectedDiceMapRef.current.clear();
    setSelectedMeshes([]);
    setSelectedDiceMap(new Map());
    selectedCountRef.current = 0;

    // 점수 지우기
    if (scoreRef.current) {
      scoreRef.current.innerHTML = '';
    }
    
    // 점수판 초기화
    setTopFaces([]);
  };

  const params = {
    numberOfDice: 5,
    segments: 40,
    edgeRadius: 0.07,
    notchRadius: 0.15,
    notchDepth: 0.1,
  };

  const handleScoreClick = (category: string, score: number) => {
    if (savedScores.has(category)) return; // 이미 선택된 카테고리면 무시
    setSavedScores(prev => new Map(prev.set(category, score)));

    // 상태 초기화
    setRollCount(1);
    selectedMeshRefs.current = [];
    selectedDiceMapRef.current.clear();
    setSelectedMeshes([]);
    setSelectedDiceMap(new Map());
    selectedCountRef.current = 0;
    setTopFaces([]);

    // 주사위 모두 선택 해제 및 위치 초기화
    diceArrayRef.current.forEach((d, i) => {
      d.selected = false;
      d.body.type = CANNON.Body.DYNAMIC;
      d.body.allowSleep = true;
      d.body.velocity.setZero();
      d.body.angularVelocity.setZero();
      d.body.position = new CANNON.Vec3(4, i * 1.5, 0);
      d.mesh.position.copy(d.body.position);
      d.mesh.rotation.set(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random());
      d.body.quaternion.setFromEuler(
        d.mesh.rotation.x,
        d.mesh.rotation.y,
        d.mesh.rotation.z
      );
      const force = 3 + 5 * Math.random();
      d.body.applyImpulse(
        new CANNON.Vec3(-force, force, 0),
        new CANNON.Vec3(0, 0, 0.2)
      );
      d.body.wakeUp();
    });
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
    const wallHeight = 7;
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
      let allArrived = true;

      const speed = 0.3; // 한 프레임당 이동 거리

      for (const dice of diceArrayRef.current) {
        scored = false;
        // 기존 위치/회전 복사
        dice.mesh.position.copy(dice.body.position);
        dice.mesh.quaternion.copy(dice.body.quaternion);

        // 🔍 targetPosition 체크
        if (dice.targetPosition) {
          allArrived = false; // 아직 이동 중인 주사위 있음

          const current = dice.mesh.position;
          const target = dice.targetPosition;
          const dist = current.distanceTo(target);

          if (dist > 0.4) {
            const direction = new THREE.Vector3().subVectors(target, current).normalize();
            const move = direction.multiplyScalar(speed);
            dice.mesh.position.add(move);
            dice.body.position.copy(dice.mesh.position as any);
          } else {
            dice.mesh.position.copy(target);
            dice.body.position.copy(new CANNON.Vec3(target.x, target.y, target.z));
            dice.targetPosition = undefined;
          }
          dice.body.quaternion.copy(dice.body.quaternion);
        }

        // 💤 잠들었는지 체크
        if (dice.body.sleepState !== CANNON.Body.SLEEPING) {
          allSleeping = false;
        }
      }

      // 점수 표시
      if (allSleeping && allArrived && !scored) { 
        // 모든 주사위에 대해 점수 계산 (선택 여부 관계없이)
        const allDice = diceArrayRef.current;
        const faces = allDice.map(d => d.getScore());
        setTopFaces(faces); // 상태 업데이트
        scoreRef.current!.innerHTML = faces.join(', ');
        scored = true;
      }

      // 렌더링 반복
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };


    const initialThrow = () => {
       if (rollCount >= maxRollCount) return;
      scored = false;
      if (!scoreResult) return;
      scoreResult.innerHTML = '';
      diceArrayRef.current.forEach((d, i) => {
        if (d.selected) return; // 선택된 주사위는 고정
        d.body.velocity.setZero();
        d.body.angularVelocity.setZero();
        d.body.position = new CANNON.Vec3(4, i * 1.5, 0);
        d.mesh.position.copy(d.body.position);
        d.mesh.rotation.set(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random());
        const threeQuat = d.mesh.quaternion;
        d.body.quaternion.set(threeQuat.x, threeQuat.y, threeQuat.z, threeQuat.w);
        const force = 3 + 5 * Math.random();
        d.body.applyImpulse(new CANNON.Vec3(-force, force, 0), new CANNON.Vec3(0, 0, 0.2));
        d.body.allowSleep = true;
        d.body.wakeUp(); // 반드시 wakeUp!
      });
      setRollCount(prev => prev + 1);
    };

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    initialThrow();
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
        clickedDice.body.velocity.setZero();
        clickedDice.body.angularVelocity.setZero();


        const original = clickedDice.stoppedPosition;

        if (original) {
          clickedDice.targetPosition = new THREE.Vector3(original.x, original.y, original.z);
        }
        // 저장해 둔 물리 시뮬레이션이 멈춘 위치/회전으로 복원
        if (clickedDice.stoppedQuaternion) {
          clickedDice.body.quaternion.copy(new CANNON.Quaternion(
            clickedDice.stoppedQuaternion.x,
            clickedDice.stoppedQuaternion.y,
            clickedDice.stoppedQuaternion.z,
            clickedDice.stoppedQuaternion.w
          ));
        }
        clickedDice.body.type = CANNON.Body.DYNAMIC;
        clickedDice.body.allowSleep = true;
        //clickedDice.body.wakeUp(); // 물리 시뮬레이션에 참여하도록 깨우기
        setSelectedMeshes(prev => prev.filter(m => m.uuid !== clickedDice.mesh.uuid));
        setSelectedDiceMap(prev => {
          const map = new Map(prev);
          map.delete(clickedDice.mesh.uuid);

          // 위치 재정렬
          const updated = Array.from(map.values());
          const newPositions = getDynamicFixedPositions(updated.length);

          updated.forEach((d, i) => {
            d.targetPosition = newPositions[i];
          });

          selectedDiceMapRef.current = map;
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
        const updatedPositions = getDynamicFixedPositions(currentSelectedCount + 1);
        Array.from(selectedDiceMapRef.current.values()).forEach((d, index) => {
          d.targetPosition = updatedPositions[index];
        });

        clickedDice.targetPosition = updatedPositions[currentSelectedCount];

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
          selectedDiceMapRef.current = map;
          console.log("✅ selectedDiceMap에 추가됨:", clickedDice.mesh.uuid);
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
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <h1 className="text-4xl font-bold text-black drop-shadow-lg">YACHT GAME</h1>
      </div>
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      <div className="absolute top-4 left-4 z-10 bg-white px-3 py-2 rounded shadow text-gray-800 font-medium">
        선택된 주사위: {selectedMeshes.length}개
      </div>
      {topFaces.length >= 0 && (
        <div className="absolute left-8 top-20 z-10">
         <ScoreTable dice={topFaces} onScoreClick={handleScoreClick} savedScores={savedScores} />
        </div>
      )}
      {savedScores.size > 0 && (
        <div className="absolute right-8 top-20 z-10 bg-white p-4 rounded shadow w-64">
          <h2 className="font-bold mb-2 text-gray-800">📌 저장된 점수</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            {Array.from(savedScores.entries()).map(([category, score]) => (
              <li key={category} className="flex justify-between border-b pb-1">
                <span>{category}</span>
                <span>{score}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-right font-semibold">
            총합: {Array.from(savedScores.values()).reduce((a, b) => a + b, 0)}
          </div>
        </div>
      )}
      {/* 점수 및 버튼 (optional) */}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-center">
        <span ref={scoreRef} className="text-lg font-semibold bg-white px-4 py-2 rounded shadow" />
        <button
            onClick={throwDice}
            disabled={rollCount >= maxRollCount}
            className={`ml-4 px-4 py-2 rounded shadow text-white ${
              rollCount >= maxRollCount
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Throw the Dice ({rollCount}/{maxRollCount})
        </button>
         <button
          onClick={handleResetAndThrow}
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
        >
          OK
        </button>
      </div> 
    </div>
  );
};

export default DiceRoller;