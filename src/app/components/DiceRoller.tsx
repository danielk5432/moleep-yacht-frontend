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
  const diceMeshRef = useRef<THREE.Group>(null);
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
    camera.position.set(0, 0.5, 4).multiplyScalar(7);
    cameraRef.current = camera;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const topLight = new THREE.PointLight(0xffffff, 1.2);
    topLight.position.set(10, 15, 0);
    topLight.castShadow = true;
    topLight.shadow.mapSize.width = 2048;
    topLight.shadow.mapSize.height = 2048;
    topLight.shadow.camera.near = 5;
    topLight.shadow.camera.far = 400;

    scene.add(topLight);

    const physicsWorld = new CANNON.World({
      allowSleep: true,
      gravity: new CANNON.Vec3(0, -50, 0),
    });
    physicsWorld.defaultContactMaterial.restitution = 0.3;
    physicsWorldRef.current = physicsWorld;

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.ShadowMaterial({ opacity: 0.1 })
    );
    floor.receiveShadow = true;
    floor.position.y = -7;
    floor.quaternion.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI * 0.5);
    scene.add(floor);

    const floorBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });
    floorBody.position.copy(floor.position as any);
    floorBody.quaternion.copy(floor.quaternion as any);
    physicsWorld.addBody(floorBody);

    const createDiceMesh = () => {
      const boxMaterialOuter = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
      const boxMaterialInner = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0,
        metalness: 1,
        side: THREE.DoubleSide,
      });

      const diceMesh = new THREE.Group();
      const innerMesh = new THREE.Mesh(createInnerGeometry(), boxMaterialInner);
      const outerMesh = new THREE.Mesh(createBoxGeometry(), boxMaterialOuter);
      outerMesh.castShadow = true;
      diceMesh.add(innerMesh, outerMesh);
      return diceMesh;
    };

    const createBoxGeometry = (): THREE.BufferGeometry => {
      let boxGeometry: THREE.BufferGeometry = new THREE.BoxGeometry(1, 1, 1, params.segments, params.segments, params.segments);
      const positionAttr = boxGeometry.attributes.position;
      const subCubeHalfSize = 0.5 - params.edgeRadius;

      for (let i = 0; i < positionAttr.count; i++) {
        let position = new THREE.Vector3().fromBufferAttribute(positionAttr, i);
        const subCube = new THREE.Vector3(Math.sign(position.x), Math.sign(position.y), Math.sign(position.z)).multiplyScalar(subCubeHalfSize);
        const addition = new THREE.Vector3().subVectors(position, subCube);

        if (Math.abs(position.x) > subCubeHalfSize && Math.abs(position.y) > subCubeHalfSize && Math.abs(position.z) > subCubeHalfSize) {
          addition.normalize().multiplyScalar(params.edgeRadius);
          position = subCube.add(addition);
        }

        positionAttr.setXYZ(i, position.x, position.y, position.z);
      }

      boxGeometry.deleteAttribute('normal');
      boxGeometry.deleteAttribute('uv');
      boxGeometry = mergeVertices(boxGeometry);
      boxGeometry.computeVertexNormals();
      return boxGeometry;
    };

    const createInnerGeometry = (): THREE.BufferGeometry => {
      const baseGeometry = new THREE.PlaneGeometry(1 - 2 * params.edgeRadius, 1 - 2 * params.edgeRadius);
      const offset = 0.48;
      return mergeGeometries([
        baseGeometry.clone().translate(0, 0, offset),
        baseGeometry.clone().translate(0, 0, -offset),
        baseGeometry.clone().rotateX(0.5 * Math.PI).translate(0, -offset, 0),
        baseGeometry.clone().rotateX(0.5 * Math.PI).translate(0, offset, 0),
        baseGeometry.clone().rotateY(0.5 * Math.PI).translate(-offset, 0, 0),
        baseGeometry.clone().rotateY(0.5 * Math.PI).translate(offset, 0, 0),
      ], false);
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

    const render = () => {
      physicsWorld.fixedStep();
      for (const dice of diceArrayRef.current) {
        dice.mesh.position.copy(dice.body.position);
        dice.mesh.quaternion.copy(dice.body.quaternion);
      }
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    const throwDice = () => {

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