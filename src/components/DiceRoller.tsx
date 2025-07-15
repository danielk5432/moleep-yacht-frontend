'use client';

import React, { useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Dice } from '../types/dice';
import { generateDice } from '../utils/generateDice';
import { getTopFaceNumber } from '../utils/getTopFaceNumber';
import ScoreTable from './ScoreTable';
import { calculateScores } from '../utils/calculateScores';
import { DiceState, GameState, GamePhase, GameAction } from '../types/game';
import { all } from 'three/tsl';
import { useSocketStore } from '../stores/socketStore';
import { useGameStore, DicePhysics } from '../stores/gameStore';
import { useRouter } from 'next/router';
import { diceReverseMap } from '../types';


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
  const scoredRef = useRef(false); // 점수 계산 상태 추적
  const diceStateRef = useRef<DiceState>('roll'); // 현재 상태 추적
  const [topFaces, setTopFaces] = useState<number[]>([]);
  const [savedScores, setSavedScores] = useState<Map<string, number>>(new Map());
  const [allSleeping, setAllSleeping] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const unSelected_category: string[] = [];
  const totalCategories = Object.keys(calculateScores(diceArrayRef.current)).length;
  const selectableCategories = totalCategories - (unSelected_category?.length ?? 0);
  const [resultVisible, setResultVisible] = useState(false);

  const maxRollCount = 3;

  // FSM 상태 관리
  const [isRolling, setIsRolling] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // 게임 상태 관리
  const {
    isMyTurn, setIsMyTurn,
    dicePhysics, setDicePhysics,
    rollcount, setRollCount, // Zustand에서 가져오기
    diceState, setDiceState, // Zustand에서 가져오기
  } = useGameStore();

  const router = useRouter();
  const { multiplay } = router.query;
  const roomId = typeof router.query.room === 'string' ? router.query.room : '';

  const { socket } = useSocketStore();

  // 상태에 따른 조건들
  const canSelect = diceState === 'stop' && isMyTurn;
  const canRoll = diceState === 'stop' && rollcount < maxRollCount && isMyTurn;
  
  // 디버깅용 로그

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

  // 상태 변경 함수들
  const setRollingState = () => {
    setDiceState('roll');
    diceStateRef.current = 'roll';
    setIsRolling(true);
    setIsAnimating(false);
  };

  const setStopState = () => {
    setDiceState('stop');
    diceStateRef.current = 'stop';
    setIsRolling(false);
    setIsAnimating(false);
  };

  const setAnimatingState = () => {
    setDiceState('animate');
    diceStateRef.current = 'animate';
    setIsRolling(false);
    setIsAnimating(true);
  };

  // 게임 액션 처리 함수들
  const handleGameAction = (action: GameAction) => {
    console.log('🎮 Game Action:', action.type, action.payload);
    
    switch (action.type) {
      case 'THROW_DICE':
        console.log('📤 WebSocket: Sending dice throw action');
        break;
      case 'SELECT_DICE':
        console.log('📤 WebSocket: Sending dice selection action');
        break;
      case 'SCORE_POINT':
        console.log('📤 WebSocket: Sending score action');
        break;
      case 'START_TURN':
        console.log('🔄 Game Phase: Starting new turn');
        setRollCount(0);
        break;
      case 'END_TURN':
        console.log('🔄 Game Phase: Ending turn');
        break;
    }
  };



  // 랜덤 물리량 생성 함수
  function makeRandomPhysics(num: number) {
    return Array.from({ length: num }).map((_, i) => ({
      id: diceArrayRef.current[i].id,
      type: diceReverseMap[typeof diceArrayRef.current[i]],
      position: { x: 4, y: i * 1.5, z: 0 },
      rotation: { x: Math.random(), y: Math.random(), z: Math.random(), w: Math.random() },
      velocity: { x: 0, y: 0, z: 0 },
      angularVelocity: { x: 0, y: 0, z: 0 },
    }));
  }

  // impulse만 랜덤 생성 (shake용)
  function makeRandomImpulses(num: number) {
    return Array.from({ length: num }).map(() => ({
      impulse: {
        x: (Math.random() - 0.5) * 2,
        y: 20 + Math.random() * 5,
        z: (Math.random() - 0.5) * 2,
      },
      angularImpulse: { x: 0, y: 0, z: 0 },
    }));
  }

  // 주사위 생성 (payload 기반)
  function createDice(physicsArr: DicePhysics[], scene: THREE.Scene, physicsWorld: CANNON.World): Dice[] {
    // 기존 주사위 완전 제거
    clearDice(scene, physicsWorld, diceArrayRef.current);
    // generateDice로 Dice[] 생성 (diceid는 payload에서 가져오거나, 일단 1로 고정)
    const diceList = generateDice(physicsArr.length, scene, physicsWorld, 1);
    // 각 dice에 물리량 세팅
    diceList.forEach((dice, i) => {
      const p = physicsArr[i];
      // 로그로 물리량 출력
      console.log(`[createDice] id: ${p.id}, position:`, p.position, 'rotation:', p.rotation, 'velocity:', p.velocity, 'angularVelocity:', p.angularVelocity);
      dice.body.position.set(p.position.x, p.position.y, p.position.z);
      dice.body.quaternion.set(p.rotation.x, p.rotation.y, p.rotation.z, p.rotation.w);
      dice.body.velocity.set(p.velocity.x, p.velocity.y, p.velocity.z);
      dice.body.angularVelocity.set(p.angularVelocity.x, p.angularVelocity.y, p.angularVelocity.z);
      dice.body.wakeUp();
    });
    diceArrayRef.current = diceList;
    return diceList;
  }

  // impulse/velocity 적용 (던지기)
  function throwDiceToWorld(diceArr: Dice[], impulses: { impulse: { x: number; y: number; z: number } }[]): void {
    diceArr.forEach((d: Dice, i: number) => {
      d.body.type = CANNON.Body.DYNAMIC;
      d.body.allowSleep = true;
      d.body.velocity.setZero();
      d.body.angularVelocity.setZero();
      d.mesh.position.copy(d.body.position as any);
      const impulse = impulses[i]?.impulse || { x: 0, y: 0, z: 0 };
      const contactPoint = new CANNON.Vec3(0, 0, 0.2);
      const threeQuat = d.mesh.quaternion;
      d.body.quaternion.set(threeQuat.x, threeQuat.y, threeQuat.z, threeQuat.w);
      d.body.applyImpulse(new CANNON.Vec3(impulse.x, impulse.y, impulse.z), contactPoint);
      d.mesh.rotation.set(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random());
      d.body.wakeUp(); 
    });
  }

  // 기존 주사위 완전 제거 함수
  function clearDice(scene: THREE.Scene, physicsWorld: CANNON.World, diceArr: Dice[]) {
    diceArr.forEach(dice => {
      scene.remove(dice.mesh);
      physicsWorld.removeBody(dice.body);
    });
  }

  // 실제 사용부
  const numDice = 5;

 

  // shake(추가 굴리기)도 velocity만 갱신
  const handleShake = () => {
    const newPhysics = dicePhysics.map((p, i) => {
      const velocity = { x: (Math.random() - 0.5) * 2, y: 20 + Math.random() * 5, z: (Math.random() - 0.5) * 2 };
      return { ...p, velocity };
    });
    setDicePhysics(newPhysics);
    if (socket) {
      socket.emit('game:action', { roomId, type: 'shake', payload: newPhysics });
    }
    // 내 주사위에만 velocity 적용
      diceArrayRef.current.forEach((d, i) => {
      d.body.velocity.set(newPhysics[i].velocity.x, newPhysics[i].velocity.y, newPhysics[i].velocity.z);
        d.body.wakeUp();
      });
  };

  // 소켓 수신부: oppturn(상대방 턴)에서는 createDice 호출 금지, velocity만 세팅
  useEffect(() => {
    if (!socket) return;
    socket.on('game:action', (action: any) => {
      if (action.type === 'initial' && action.payload) {
        setDicePhysics(action.payload);
        if (isMyTurn) {
          clearDice(sceneRef.current!, physicsWorldRef.current!, diceArrayRef.current);
          diceArrayRef.current = action.payload.map((p: DicePhysics, i: number) => {
            const dice = new Dice(i);
            dice.addToScene(sceneRef.current!, physicsWorldRef.current!, new CANNON.Vec3(p.position.x, p.position.y, p.position.z));
            dice.body.quaternion.set(p.rotation.x, p.rotation.y, p.rotation.z, p.rotation.w);
            dice.body.velocity.set(p.velocity.x, p.velocity.y, p.velocity.z);
            dice.body.angularVelocity.set(p.angularVelocity.x, p.angularVelocity.y, p.angularVelocity.z);
            dice.body.wakeUp();
            return dice;
          });
        } else {
          // oppturn: 기존 주사위에 velocity만 세팅
          diceArrayRef.current.forEach((d, i) => {
            d.body.position.set(action.payload[i].position.x, action.payload[i].position.y, action.payload[i].position.z);
            d.body.quaternion.set(action.payload[i].rotation.x, action.payload[i].rotation.y, action.payload[i].rotation.z, action.payload[i].rotation.w);
            d.body.velocity.set(action.payload[i].velocity.x, action.payload[i].velocity.y, action.payload[i].velocity.z);
            d.body.angularVelocity.set(action.payload[i].angularVelocity.x, action.payload[i].angularVelocity.y, action.payload[i].angularVelocity.z);
            d.body.wakeUp();
          });
        }
      }
      if (action.type === 'shake' && action.payload) {
        setDicePhysics(action.payload);
        // oppturn: 기존 주사위에 velocity만 세팅
        diceArrayRef.current.forEach((d, i) => {
          d.body.velocity.set(action.payload[i].velocity.x, action.payload[i].velocity.y, action.payload[i].velocity.z);
          d.body.wakeUp();
        });
      }
      if (action.dicePhysics) setDicePhysics(action.dicePhysics);
      //if (action.scores) setScores(action.scores);
      //if (action.selected) setSelected && setSelected(action.selected);
      //setAvailableActions(action.availableActions || []);
      setIsMyTurn(true); // 내 턴이 돌아옴
    });
    return () => {
      socket.off('game:action');
    };
  }, [socket, setDicePhysics, isMyTurn]);

  // ---------------------------------------
  // initial scene reset (uesEffect)
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

    const topLight = new THREE.PointLight(0xffffff, 1);
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
    // initial scene reset complete
    // ------------------------------------------

    physicsWorld.addBody(wall);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(wallRadius - wallThickness, wallRadius + wallThickness, 64),
      new THREE.MeshStandardMaterial({ color: 0x8b4513, side: THREE.DoubleSide }) // 갈색 나무
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -7 + 0.01; // 살짝 위로
    scene.add(ring);

    const newDice = generateDice(numDice, scene, physicsWorld, 1); // generate DICE
    diceArrayRef.current = newDice;

    
    scoredRef.current = false;

    const render = () => {
      physicsWorld.fixedStep();

      let allSleepingLocal = true;
      let allArrived = true;

      const speed = 0.3; // 한 프레임당 이동 거리
      
      for (const dice of diceArrayRef.current) {
        // 모든 주사위의 위치/회전 복사
        dice.mesh.position.copy(dice.body.position);
        dice.mesh.quaternion.copy(dice.body.quaternion);

        // 🔍 targetPosition 체크 (모든 주사위)
        if (dice.targetPosition) {
          const current = dice.mesh.position;
          const target = dice.targetPosition;
          const dist = current.distanceTo(target);

          if (dist > 0.4) {
            // 아직 이동 중
            allArrived = false;
            const direction = new THREE.Vector3().subVectors(target, current).normalize();
            const move = direction.multiplyScalar(speed);
            dice.mesh.position.add(move);
            dice.body.position.copy(dice.mesh.position as any);
          } else {
            // 목적지 도달
            dice.mesh.position.copy(target);
            dice.body.position.copy(new CANNON.Vec3(target.x, target.y, target.z));
            dice.targetPosition = undefined;
          }
          dice.body.quaternion.copy(dice.body.quaternion);
        }

        // 💤 잠들었는지 체크 (모든 주사위)
        if (dice.selected) {
          // 선택된 주사위는 STATIC 상태이므로 항상 "잠든" 상태로 간주
        } else if (dice.body.sleepState !== CANNON.Body.SLEEPING) {
          // 선택되지 않은 주사위는 물리 엔진의 sleep 상태 확인
          allSleepingLocal = false;
        }
        
      }

      // 상태 업데이트
      setAllSleeping(allSleepingLocal);

      // FSM 상태 전환 로직
      if (diceState === 'roll' && allSleepingLocal) {
        // 굴리기 완료 -> stop 상태로 전환
        setStopState();
        // 점수 계산
        if (!scoredRef.current) {
        const allDice = diceArrayRef.current;
        const faces = allDice.map(d => d.getScore());
          setTopFaces(faces);
          if (scoreRef.current) {
            scoreRef.current.innerHTML = faces.join(', ');
          }
          scoredRef.current = true;
        }
      } else if (diceState === 'animate' && allArrived) {
        // 애니메이션 완료 -> stop 상태로 전환

        setStopState();
      }

      // 렌더링 반복
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 초기화 useEffect에서 createDice 호출은 제거(던지는 쪽에서만 생성)
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

        // 원래 위치로 부드럽게 돌아가기
        if (clickedDice.stoppedPosition) {
          clickedDice.targetPosition = clickedDice.stoppedPosition.clone();
        }

        // 원래 회전으로 돌아가기
        if (clickedDice.stoppedQuaternion) {
          clickedDice.body.quaternion.copy(new CANNON.Quaternion(
            clickedDice.stoppedQuaternion.x,
            clickedDice.stoppedQuaternion.y,
            clickedDice.stoppedQuaternion.z,
            clickedDice.stoppedQuaternion.w
          ));
          clickedDice.mesh.quaternion.copy(clickedDice.stoppedQuaternion);
        }

        // 상태 초기화 (targetPosition은 렌더 루프에서 처리 후 초기화됨)
        clickedDice.stoppedPosition = undefined;
        clickedDice.stoppedQuaternion = undefined;
        
        clickedDice.body.type = CANNON.Body.DYNAMIC;
        clickedDice.body.allowSleep = true;

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

        // stop 상태일 때만 선택 가능
        if (diceStateRef.current !== 'stop') {
          console.log("Cannot select dice in current state. Current state:", diceStateRef.current, "canSelect:", canSelect);
          return;
        }

        // 주사위가 멈춰있을 때만 선택 가능하도록 (선택 시점의 최종 위치 저장)
        if (clickedDice.body.sleepState !== CANNON.Body.SLEEPING) {
          console.log("Dice is still moving, cannot select.");
          return;
        }

        clickedDice.selected = true;
        clickedDice.stoppedPosition = clickedDice.mesh.position.clone(); // 물리 시뮬레이션이 멈춘 위치 저장
        clickedDice.stoppedQuaternion = clickedDice.mesh.quaternion.clone(); // 물리 시뮬레이션이 멈춘 회전 저장

        // 애니메이션 시작
        setAnimatingState();

        // 게임 액션 호출
        handleGameAction({ type: 'SELECT_DICE', payload: { diceId: clickedDice.id } });

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
  }, []); // 이 useEffect는 컴포넌트 마운트 시 한 번만 실행되어야 합니다.

    // 결과 화면 표시를 위한 useEffect 추가
    useEffect(() => {
    if (savedScores.size === selectableCategories) {
      setShowResult(true);
    }
    }, [savedScores, selectableCategories]);

    useEffect(() => {
    if (showResult) {
    setTimeout(() => setResultVisible(true), 50);
    } else {
      setResultVisible(false);
    }
    }, [showResult]);

  // --- ✨ 맨 처음 시작 시 주사위 굴리기 로직 ---
  useEffect(() => {
    // 라우터 쿼리가 준비될 때까지 기다립니다.
    if (multiplay === undefined || diceArrayRef.current.length === 0) {
      return;
    }

    // 싱글플레이 모드일 경우, 자동으로 첫 주사위를 굴립니다.
    if (multiplay === 'false') {
      // 게임이 아직 시작되지 않았을 때 (rollcount가 0일 때) 한 번만 실행합니다.
      if (rollcount === 0 && diceState === 'stop') {
        console.log("🎲 Single player mode: Performing initial throw.");
        // 렌더링이 안정된 후 실행하기 위해 짧은 지연을 줍니다.
        const timer = setTimeout(() => handleRollDice(), 100);
        return () => clearTimeout(timer);
      }
    }
    // 멀티플레이 모드 ('true')의 경우:
    // 서버로부터 `game:update` 또는 `game:action` 이벤트를 받아 게임을 시작하므로,
    // 클라이언트에서 자동으로 굴릴 필요가 없습니다. 이 컴포넌트는 서버의 지시를 기다립니다.
  }, [multiplay, rollcount, diceState]);


  // handle socket (only with game:update)
  useEffect(() => {
  if (!socket) return;

  const handleGameUpdate = (newState: Partial<GameState>) => {
    console.log('📦 Game state updated from server:', newState);
    // Zustand 스토어의 상태를 한 번에 업데이트
    useGameStore.setState(newState);
  };

  socket.on('game:update', handleGameUpdate);

  return () => {
    socket.off('game:update', handleGameUpdate);
  };
}, [socket]);

  // 내 행동(예: 주사위 굴리기)
  const handleRollDice = () => {
    if (!canRoll) return;
    // 실제 주사위 굴리기 로직 (예: 물리량 포함)
    throwDiceToWorld(diceArrayRef.current, makeRandomImpulses(numDice));
    const dicePayload = { dicePhysics };
    setRollCount(rollcount+1);
    setRollingState();

    if (socket){
      socket.emit("game:action", { roomId, type: "roll", payload: dicePayload });
      // 던지는 쪽(myturn)에서는 주사위 새로 만들지 않고, 기존 주사위에 velocity만 적용
    }
    
  };

  // 점수 선택 등도 동일하게 emit
  const handleScoreClick = (category: string, score: number) => {
    if (savedScores.has(category)) return;
    setSavedScores(prev => new Map(prev.set(category, score)));
    // dicePhysics를 payload로 보냄
    socket?.emit("game:action", { roomId, type: "selectScore", payload: { category, score, dicePhysics } });
    setIsMyTurn(false);
    // 던지는 쪽(myturn)에서는 주사위 새로 만들지 않고, 기존 주사위에 velocity만 적용
  };

  // 자신의 턴이 아닐 때 상대방의 dicePhysics 신호로 throw
  useEffect(() => {
    if (!isMyTurn && dicePhysics.length > 0) {
      // 던지는 쪽(myturn)에서는 주사위 새로 만들지 않고, 기존 주사위에 velocity만 적용
      diceArrayRef.current.forEach((d, i) => {
        d.body.velocity.set(dicePhysics[i].velocity.x, dicePhysics[i].velocity.y, dicePhysics[i].velocity.z);
        d.body.wakeUp();
      });
    }
  }, [isMyTurn, dicePhysics]);

  return (
    <div className="relative w-full h-screen">
      {/* 시뮬레이터 canvas 전체화면 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        {/* <h1 className="text-4xl font-bold text-black drop-shadow-lg">YACHT GAME</h1> */}
        <img
          src="/YyachTiFy.png"
          alt="Yacht Game Logo"
          className="h-35 object-contain drop-shadow-lg"
          style={{ maxWidth: '300px' }}
        />
      </div>
      <div className="absolute right-4 top-4 z-20">
        <span ref={scoreRef} className="text-lg font-semibold bg-white px-4 py-2 rounded shadow" />
      </div>
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      <div className="absolute top-4 left-4 z-10 bg-white px-3 py-2 rounded shadow text-gray-800 font-medium">
        선택된 주사위: {selectedMeshes.length}개
      </div>
      {topFaces.length >= 0 && (
        <div className="absolute left-8 top-20 z-10">
         <ScoreTable dice={topFaces} onScoreClick={handleScoreClick} savedScores={savedScores} unSelected_category={unSelected_category}/>
        </div>
      )}
      {/* 점수 및 버튼 (optional) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-center">
        
        <button
          onClick={handleRollDice}
          disabled={!canRoll}
          className={`ml-4 px-4 py-2 rounded shadow text-white ${
            !canRoll
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          Throw the Dice ({rollcount}/{maxRollCount}) - {diceState} [{isMyTurn ? 'myturn' : 'oppturn'}]
        </button>
      </div> 
      {showResult && (
        <div
          className={`fixed inset-0 flex flex-col items-center justify-center z-50 transition-opacity duration-700 ${resultVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: "rgba(0,0,0,0.25)",
          }}
        >
          <div className={`bg-white rounded-xl shadow-lg px-20 py-8 text-center transition-opacity duration-700 ${resultVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-2xl font-bold mb-4">🎉 게임 종료!</div>
            <div className="text-lg mb-2">Total 점수</div>
            <div className="text-4xl font-extrabold text-blue-600">
              {Array.from(savedScores.values()).reduce((a, b) => a + b, 0)}
            </div>
          </div>
        </div>
    )}
    </div>
  );
};

export default DiceRoller;