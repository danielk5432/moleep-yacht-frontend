import * as THREE from 'three';
import { Dice } from './dice';

// 456 주사위 클래스
export class Dice456 extends Dice {
  constructor(id: number) {
    super(id);
    // meshOrder: [1, 6, 2, 5, 3, 4] 순서에 맞춰서 faceNumber 설정
    // 각 위치에 123을 순환해서 배치
    this.faceNumber = [4, 5, 6, 6, 5 ,4]; // meshOrder 순서에 맞춘 123123
    this.backgroundColor = '#009432'; //배경
    this.borderColor = '#00a032'; // 테두리
    this.dotColor = '#ffffff'; // 점
    
    // 새로운 텍스처로 메시 재생성
    this.mesh = this.createDiceMesh();
  }
} 