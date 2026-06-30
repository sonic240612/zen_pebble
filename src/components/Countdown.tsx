import { useEffect, useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import './Countdown.css';

export function Countdown() {
  const beginPlay = useGameStore((s) => s.beginPlay);
  const [count, setCount] = useState(3);
  const [showGo, setShowGo] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowGo(true);
          setTimeout(() => {
            setDone(true);
            beginPlay();
          }, 600);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [beginPlay]);

  if (done) return null;

  return (
    <div className="countdown-overlay">
      <div className="countdown-content">
        {showGo ? (
          <div className="countdown-go">시작</div>
        ) : (
          <div className="countdown-number" key={count}>{count}</div>
        )}
      </div>
    </div>
  );
}
