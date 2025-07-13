import * as THREE from 'three';
import { Dice } from './dice';

// 123 주사위 클래스
export class Dice123 extends Dice {
  constructor(id: number) {
    super(id);
    // meshOrder: [1, 6, 2, 5, 3, 4] 순서에 맞춰서 faceNumber 설정
    // 각 위치에 123을 순환해서 배치
    this.faceNumber = [1, 2, 3, 3, 2 ,1]; // meshOrder 순서에 맞춘 123123
    this.backgroundColor = '#ffeb3b'; // 노란색 배경
    this.borderColor = '#ff5722'; // 빨간색 테두리
    this.dotColor = '#000000'; // 검은색 점
    
    // 새로운 텍스처로 메시 재생성
    this.mesh = this.createDiceMesh();
  }
} 