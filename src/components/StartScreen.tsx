import { useState, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getRankings } from '../utils/ranking';
import { formatDuration } from '../utils/time';
import type { RankingEntry } from '../utils/ranking';
import './StartScreen.css';

function RankingModal({ onClose }: { onClose: () => void }) {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const list = await getRankings();
      setRankings(list);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="ranking-modal-overlay" onClick={onClose}>
      <div className="ranking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ranking-modal-header">
          <h3 className="ranking-modal-title">랭킹</h3>
          <button className="ranking-modal-close" onClick={onClose}>✕</button>
        </div>
        {loading ? (
          <p className="ranking-loading">불러오는 중...</p>
        ) : rankings.length > 0 ? (
          <div className="ranking-list">
            <div className="ranking-header">
              <span>순위</span>
              <span>이름</span>
              <span>시간</span>
              <span>단계</span>
            </div>
            <div className="ranking-body">
              {rankings.map((r, i) => (
                <div key={r.id} className="ranking-row">
                  <span className="rank-num">{i + 1}</span>
                  <span className="rank-name">{r.name}</span>
                  <span className="rank-time">{formatDuration(r.elapsed)}</span>
                  <span className="rank-stage">{r.stage}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="ranking-empty">아직 랭킹이 없습니다</p>
        )}
      </div>
    </div>
  );
}

export function StartScreen() {
  const start = useGameStore((s) => s.start);
  const [showRanking, setShowRanking] = useState(false);

  return (
    <div className="start-screen">
      <div className="start-content">
        <div className="pebble-icon">🪨</div>
        <h1 className="title">The Zen Pebble</h1>
        <p className="subtitle">마우스와 키보드에서 손을 떼고<br />가장 오래 버티는 자가 승리한다</p>
        <button className="start-btn" onClick={start}>
          시작하기
        </button>
        <button className="ranking-btn" onClick={() => setShowRanking(true)}>
          랭킹 보기
        </button>
        <p className="hint">
          시작 버튼을 누른 순간부터<br />
          조금이라도 움직이면 실패합니다
        </p>
      </div>
      {showRanking && <RankingModal onClose={() => setShowRanking(false)} />}
    </div>
  );
}
