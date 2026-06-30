import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import { formatDuration } from '../utils/time';
import { STAGES } from '../data/stages';
import { getRankings, saveRanking } from '../utils/ranking';
import type { RankingEntry } from '../utils/ranking';
import './FailOverlay.css';

export function FailOverlay() {
  const elapsed = useGameStore((s) => s.elapsed);
  const stage = useGameStore((s) => s.stage);
  const cycle = useGameStore((s) => s.cycle);
  const failReason = useGameStore((s) => s.failReason);
  const reset = useGameStore((s) => s.reset);

  const [name, setName] = useState('');
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [registered, setRegistered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const stageName = STAGES.find((s) => s.id === stage)?.name ?? '알 수 없음';

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    loadRankings();
  }, []);

  async function loadRankings() {
    const list = await getRankings();
    setRankings(list);
  }

  async function handleRegister() {
    const trimmed = name.trim();
    if (!trimmed) return;

    await saveRanking({
      name: trimmed,
      elapsed,
      stage: stageName,
      cycle,
    });

    setRegistered(true);
    setName('');
    await loadRankings();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleRegister();
  }

  const myRank = registered ? rankings.findIndex((r) => r.elapsed === elapsed && r.stage === stageName) + 1 : 0;

  return (
    <div className="fail-overlay">
      <div className="fail-layout">
        <div className="fail-left">
          <div className="fail-pebble">🪨</div>
          <h2 className="fail-title">정적이 깨졌습니다</h2>
          <p className="fail-reason">{failReason}</p>
          <div className="fail-stats">
            <div className="stat">
              <span className="stat-label">버틴 시간</span>
              <span className="stat-value">{formatDuration(elapsed)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">도달 단계</span>
              <span className="stat-value">{stageName}</span>
            </div>
            {cycle > 0 && (
              <div className="stat">
                <span className="stat-label">윤회 횟수</span>
                <span className="stat-value">{cycle}회</span>
              </div>
            )}
          </div>

          {!registered ? (
            <div className="ranking-input-area">
              <input
                ref={inputRef}
                className="name-input"
                type="text"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={12}
              />
              <button className="rank-btn" onClick={handleRegister} disabled={!name.trim()}>
                랭킹 등록
              </button>
            </div>
          ) : (
            <div className="registered-badge">
              랭킹에 등록되었습니다! {myRank > 0 && <span>({myRank}위)</span>}
            </div>
          )}

          <div className="fail-quote">
            "나는 {formatDuration(elapsed)} 동안 정적을 유지하며<br />
            {stageName}을(를) 목격했습니다.<br />
            당신은 얼마나 버틸 수 있나요?"
          </div>

          <button className="retry-btn" onClick={reset}>
            다시 시작
          </button>
        </div>

        <div className="fail-right">
          <h3 className="ranking-title">랭킹</h3>
          {rankings.length > 0 ? (
            <div className="ranking-list">
              <div className="ranking-header">
                <span>순위</span>
                <span>이름</span>
                <span>시간</span>
                <span>단계</span>
              </div>
              <div className="ranking-body">
                {rankings.map((r, i) => (
                  <div
                    key={r.id}
                    className={`ranking-row ${r.elapsed === elapsed && r.stage === stageName && registered ? 'my-rank' : ''}`}
                  >
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
    </div>
  );
}
