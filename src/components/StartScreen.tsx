import { useGameStore } from '../stores/gameStore';
import './StartScreen.css';

export function StartScreen() {
  const start = useGameStore((s) => s.start);

  return (
    <div className="start-screen">
      <div className="start-content">
        <div className="pebble-icon">🪨</div>
        <h1 className="title">The Zen Pebble</h1>
        <p className="subtitle">마우스와 키보드에서 손을 떼고<br />가장 오래 버티는 자가 승리한다</p>
        <button className="start-btn" onClick={start}>
          시작하기
        </button>
        <p className="hint">
          시작 버튼을 누른 순간부터<br />
          조금이라도 움직이면 실패합니다
        </p>
      </div>
    </div>
  );
}
