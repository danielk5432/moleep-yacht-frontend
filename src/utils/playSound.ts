export const playSound= async (src: string, delay = 300) => {
  const audio = new Audio(src);
  audio.style.display = 'none'; 
  try {
    await audio.play();
  } catch (err) {
    console.warn("자동 재생 차단됨:", err);
  }
  // 재생 시작 후 일정 시간 대기
  return new Promise(resolve => setTimeout(resolve, delay));
};

export const timeout = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));