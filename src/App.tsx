import { useEffect, useRef } from 'react';
import { useGameStore } from './stores/gameStore';
import { FailDetection } from './systems/FailDetection';
import { GameScene } from './components/GameScene';
import { StartScreen } from './components/StartScreen';
import { Countdown } from './components/Countdown';
import { HUD } from './components/HUD';
import { FailOverlay } from './components/FailOverlay';

export default function App() {
  const phase = useGameStore((s) => s.phase);
  const tick = useGameStore((s) => s.tick);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const cursorEl = document.getElementById('cursor-style');
    if (phase === 'playing') {
      if (!cursorEl) {
        const style = document.createElement('style');
        style.id = 'cursor-style';
        style.textContent = '* { cursor: none !important; }';
        document.head.appendChild(style);
      }
    } else {
      if (cursorEl) cursorEl.remove();
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      return;
    }

    let running = true;

    const loop = (timestamp: number) => {
      if (!running) return;
      tick(timestamp);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [phase, tick]);

  return (
    <>
      {phase === 'idle' && <StartScreen />}

      {(phase === 'countdown' || phase === 'playing') && <GameScene />}

      {phase === 'countdown' && <Countdown />}

      {phase === 'playing' && (
        <>
          <HUD />
          <FailDetection enabled={true} />
        </>
      )}

      {phase === 'failed' && <FailOverlay />}
    </>
  );
}
