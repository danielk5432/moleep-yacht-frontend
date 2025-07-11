import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SelectedDiceView: React.FC<{ mesh: THREE.Mesh }> = ({ mesh }) => {
 const viewRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!viewRef.current) return;

    const renderer = new THREE.WebGLRenderer({ canvas: viewRef.current, alpha: true, antialias: true });
    renderer.setSize(100, 100);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 3, -3);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // 복제한 주사위
    const clone = mesh.clone(true);
    if (Array.isArray(mesh.material)) {
      clone.material = mesh.material.map(m => m.clone());
    }
    clone.position.set(0, 0, 0);
    clone.quaternion.copy(mesh.quaternion); // 굴려진 방향 그대로 유지
    scene.add(clone);

    renderer.render(scene, camera);

    return () => {
      renderer.dispose();
    };
  }, [mesh]);

  return <canvas
    ref={viewRef}
    style={{ width: 80, height: 80 }}
    className="rounded-lg shadow"
  />;
};

export default SelectedDiceView;