import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";
import { useSocketStore } from "../../stores/socketStore";
import { useGameStore } from "../../stores/gameStore";

const SOCKET_URL = "http://localhost:3001";

const MatchPage: React.FC = () => {
  const router = useRouter();
  const [status, setStatus] = useState("매칭 대기 중...");
  const [opponent, setOpponent] = useState<string | null>(null);
  const { socket, setSocket } = useSocketStore();
  const { setIsMyTurn } = useGameStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // 소켓이 없으면 새로 생성, 있으면 재사용
    let created = false;
    let sock = socket;
    if (!sock) {
      sock = io(SOCKET_URL);
      setSocket(sock);
      created = true;
    }
    socketRef.current = sock;

    // 닉네임 불러오기 (임시: localStorage)
    const nickname = localStorage.getItem("nickname") || "익명";
    sock.emit("match:join", { nickname });

    sock.on("match:matched", ({ roomId, opponent, firstPlayer }: { roomId: string; opponent: string; firstPlayer: string }) => {
      setStatus(`매칭 성공! 상대: ${opponent}`);
      setOpponent(opponent);
      // 내 턴 여부 결정
      const myNickname = localStorage.getItem("nickname") || "익명";
      setIsMyTurn(myNickname === firstPlayer);
      setTimeout(() => {
        router.replace(`/dice?multiplay=true&room=${roomId}`);
      }, 1000);
    });

    return () => {
      sock.emit("match:cancel");
      // 소켓 연결은 유지 (dice 페이지에서 재사용)
    };
  }, [router, setSocket, socket, setIsMyTurn]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>멀티플레이 매칭</h1>
      <p style={{ fontSize: 20, marginBottom: 16 }}>{status}</p>
      {opponent && <p style={{ color: '#22c55e', fontWeight: 600 }}>잠시 후 게임 화면으로 이동합니다...</p>}
      <button
        onClick={() => {
          if (socketRef.current) {
            socketRef.current.emit("match:cancel");
            setStatus("매칭이 취소되었습니다.");
          }
        }}
        style={{ marginTop: 32, padding: '12px 32px', background: '#ef4444', color: 'white', borderRadius: 8, fontWeight: 600, fontSize: 18 }}
      >
        매칭 취소
      </button>
    </div>
  );
};

export default MatchPage;