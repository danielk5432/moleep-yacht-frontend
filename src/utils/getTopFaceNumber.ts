import * as THREE from 'three';

export function getTopFaceNumber(quaternion: THREE.Quaternion): number {
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

