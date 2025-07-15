 // 던지는 쪽(myturn)만 createDice 호출, velocity/position/rotation만 payload로 emit
  const handleInitialThrow = () => {
    clearDice(sceneRef.current!, physicsWorldRef.current!, diceArrayRef.current);
    // 주사위 생성
    const physicsArr = Array.from({ length: numDice }).map((_, i) => {
      const dice = new Dice(i);
      dice.addToScene(sceneRef.current!, physicsWorldRef.current!, new CANNON.Vec3(4, i * 1.5, 0));
      // 랜덤 회전
      const q = new CANNON.Quaternion();
      q.setFromEuler(2 * Math.PI * Math.random(), 0, 2 * Math.PI * Math.random());
      dice.body.quaternion.copy(q);
      // 랜덤 velocity
      const velocity = { x: (Math.random() - 0.5) * 2, y: 20 + Math.random() * 5, z: (Math.random() - 0.5) * 2 };
      dice.body.velocity.set(velocity.x, velocity.y, velocity.z);
      dice.body.angularVelocity.set(0, 0, 0);
      return {
        id: String(i),
        type: 'd6',
        position: { x: dice.body.position.x, y: dice.body.position.y, z: dice.body.position.z },
        rotation: { x: dice.body.quaternion.x, y: dice.body.quaternion.y, z: dice.body.quaternion.z, w: dice.body.quaternion.w },
        velocity,
        angularVelocity: { x: 0, y: 0, z: 0 },
      };
    });
    setDicePhysics(physicsArr);
    if (socket) {
      socket.emit('game:action', { roomId, type: 'initial', payload: physicsArr });
    }
    // diceArrayRef.current에 실제 Dice 객체 생성
    diceArrayRef.current = physicsArr.map((p, i) => {
      const dice = new Dice(i);
      dice.addToScene(sceneRef.current!, physicsWorldRef.current!, new CANNON.Vec3(p.position.x, p.position.y, p.position.z));
      dice.body.quaternion.set(p.rotation.x, p.rotation.y, p.rotation.z, p.rotation.w);
      dice.body.velocity.set(p.velocity.x, p.velocity.y, p.velocity.z);
      dice.body.angularVelocity.set(p.angularVelocity.x, p.angularVelocity.y, p.angularVelocity.z);
      dice.body.wakeUp();
      return dice;
    });
  };