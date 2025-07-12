import * as THREE from 'three';

export function createDiceTextures(baseColor: string = '#ffffff') {
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

