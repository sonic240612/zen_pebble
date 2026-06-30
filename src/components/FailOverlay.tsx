import { useGameStore } from '../stores/gameStore';
import { formatDuration } from '../utils/time';
import { STAGES } from '../data/stages';
import './FailOverlay.css';

export function FailOverlay() {
  const elapsed = useGameStore((s) => s.elapsed);
  const stage = useGameStore((s) => s.stage);
  const cycle = useGameStore((s) => s.cycle);
  const failReason = useGameStore((s) => s.failReason);
  const reset = useGameStore((s) => s.reset);

  const stageName = STAGES.find((s) => s.id === stage)?.name ?? '알 수 없음';

  return (
    <div className="fail-overlay">
      <div className="fail-content">
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
        <div className="fail-quote">
          "나는 {formatDuration(elapsed)} 동안 정적을 유지하며<br />
          {stageName}을(를) 목격했습니다.<br />
          당신은 얼마나 버틸 수 있나요?"
        </div>
        <button className="retry-btn" onClick={reset}>
          다시 시작
        </button>
      </div>
    </div>
  );
}
