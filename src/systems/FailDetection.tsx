import { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';

export function FailDetection({ enabled }: { enabled: boolean }) {
  const fail = useGameStore((s) => s.fail);
  const phase = useGameStore((s) => s.phase);
  const enabledRef = useRef(enabled);
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    enabledRef.current = enabled && phase === 'playing';
  }, [enabled, phase]);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!enabledRef.current) return;
      if (lastPosition.current.x === 0 && lastPosition.current.y === 0) {
        lastPosition.current = { x: e.clientX, y: e.clientY };
        return;
      }
      if (e.clientX !== lastPosition.current.x || e.clientY !== lastPosition.current.y) {
        fail('마우스가 움직였습니다');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!enabledRef.current) return;
      e.preventDefault();
      fail('키보드가 입력되었습니다');
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!enabledRef.current) return;
      fail('마우스가 클릭되었습니다');
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!enabledRef.current) return;
      fail('화면이 터치되었습니다');
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!enabledRef.current) return;
      fail('화면이 드래그되었습니다');
    };

    const handleWheel = () => {
      if (!enabledRef.current) return;
      fail('스크롤이 감지되었습니다');
    };

    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      if (!enabledRef.current) return;
      const accel = e.accelerationIncludingGravity;
      if (accel && (Math.abs(accel.x || 0) > 15 || Math.abs(accel.y || 0) > 15 || Math.abs(accel.z || 0) > 20)) {
        fail('큰 움직임이 감지되었습니다');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });

    if ('ontouchstart' in window) {
      window.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    if (typeof DeviceMotionEvent !== 'undefined') {
      window.addEventListener('devicemotion', handleDeviceMotion, { passive: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [enabled, fail]);

  return null;
}
