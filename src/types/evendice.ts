import * as THREE from 'three';
import { Dice } from './dice';

// 456 주사위 클래스
export class DiceEven extends Dice {
  constructor(id: number) {
    super(id);
    // meshOrder: [1, 6, 2, 5, 3, 4] 순서에 맞춰서 faceNumber 설정
    this.dicetype = 'diceEven'; // 타입 설정
    this.faceNumber = [2,4,6,6,4,2]; // meshOrder 순서에 맞춘 123123
    this.backgroundColor = '#FFC312'; //배경
    this.borderColor = '#FFC312'; // 테두리
    this.dotColor = '#000000'; // 점
    this.rarity = 'common'; // 타입 설정
    
    // 새로운 텍스처로 메시 재생성
    this.mesh = this.createDiceMesh();
  }
} 