// 타입 및 카테고리 정의 (컴포넌트 파일 상단)
const UPPER_CATEGORIES = ['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes'];
const LOWER_CATEGORIES = ['Choice', 'Four of a Kind', 'Full House', 'Little Straight', 'Big Straight', 'Yacht'];

interface PlayerScoreData {
  nickname: string;
  scores: Record<string, number | null>;
}

interface OtherPlayersScoreboardProps {
  allPlayerScores: Record<string, PlayerScoreData>;
  currentUserId: string | null;
}

// 점수 행 컴포넌트 (재사용)
const ScoreRow: React.FC<{ category: string; score: number | null }> = ({ category, score }) => (
    <div className="flex justify-between items-center text-xs py-1 px-2">
        <span className="text-gray-600">{category}</span>
        <span className="font-mono font-semibold text-gray-800">{score ?? '-'}</span>
    </div>
);

// 메인 점수판 컴포넌트
const OtherPlayersScoreboard: React.FC<OtherPlayersScoreboardProps> = ({ allPlayerScores, currentUserId }) => {
  // 전체 플레이어 ID 목록에서 현재 사용자 ID를 제외
  const otherPlayerIds = Object.keys(allPlayerScores).filter(id => id !== currentUserId);

  if (otherPlayerIds.length === 0) {
    return null; // 다른 플레이어가 없으면 아무것도 렌더링하지 않음
  }

  return (
    <div className="w-full bg-gray-100 p-2 md:p-4 rounded-lg shadow-inner">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4">
        {otherPlayerIds.map((playerId) => {
          const player = allPlayerScores[playerId];
          if (!player) return null;

          return (
            <div key={playerId} className="bg-white rounded-lg shadow-md p-2">
              <h3 className="text-sm md:text-base font-bold text-center mb-2 text-indigo-600 truncate">{player.nickname}</h3>
              <div className="space-y-1">
                {/* Upper Section */}
                <div className="bg-gray-50 rounded-md">
                  {UPPER_CATEGORIES.map(cat => (
                    <ScoreRow key={cat} category={cat} score={player.scores[cat]} />
                  ))}
                </div>
                {/* Lower Section */}
                <div className="bg-gray-50 rounded-md mt-1">
                  {LOWER_CATEGORIES.map(cat => (
                    <ScoreRow key={cat} category={cat} score={player.scores[cat]} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OtherPlayersScoreboard;