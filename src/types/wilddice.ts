import * as THREE from 'three';
import { Dice } from './dice';


export class DiceWild extends Dice {
  constructor(id: number) {
    super(id);
    // meshOrder: [1, 6, 2, 5, 3, 4] 순서에 맞춰서 faceNumber 설정
    this.faceNumber = ['⭐️','⭐️','⭐️','⭐️','⭐️','⭐️']; // meshOrder 순서에 맞춘 123123
    this.backgroundColor = '#0f0f0f'; //배경
    this.borderColor = '#FFC312'; // 테두리
    this.dotColor = '#ff0000'; // 점
    
    // 새로운 텍스처로 메시 재생성
    this.mesh = this.createDiceMesh();
  }
} 