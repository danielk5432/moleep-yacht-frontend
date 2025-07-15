import * as THREE from 'three';
import { Dice } from './dice';


export class Dice1Plus extends Dice {
  constructor(id: number) {
    super(id);
    // meshOrder: [1, 6, 2, 5, 3, 4] 순서에 맞춰서 faceNumber 설정
    // 각 위치에 123을 순환해서 배치
    this.faceNumber = [6,2,3,4,5,6]; //
    this.backgroundColor = '#FDA7DF'; //배경
    this.borderColor = '#FDA7DF'; // 테두리
    this.dotColor = '#000000'; // 점
    
    // 새로운 텍스처로 메시 재생성
    this.mesh = this.createDiceMesh();
  }
} 