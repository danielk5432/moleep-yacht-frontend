import * as THREE from 'three';
import { Dice } from './dice';

// 456 주사위 클래스
export class Dice204060 extends Dice {
  constructor(id: number) {
    super(id);
    // meshOrder: [1, 6, 2, 5, 3, 4] 순서에 맞춰서 faceNumber 설정
    this.faceNumber = [2,4,'❌','❌',6,'❌']; // meshOrder 순서에 맞춘 123123
    this.backgroundColor = '#000000'; //배경
    this.borderColor = '#000000'; // 테두리
    this.dotColor = '#ff0000'; // 점
    
    // 새로운 텍스처로 메시 재생성
    this.mesh = this.createDiceMesh();
  }
} 