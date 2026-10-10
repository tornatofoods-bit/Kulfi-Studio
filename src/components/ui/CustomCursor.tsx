import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [targetPos, setTargetPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isClicking, setIsClicking] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouch(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setTargetPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, input, select, textarea, [data-cursor], [role="button"]');
      if (interactive) {
        setIsHovering(true);
        const customText = interactive.getAttribute('data-cursor');
        setCursorText(customText || '');
      } else {
        setIsHovering(false);
        setCursorText('');
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Smooth lerp for trailing cursor
    let rafId: number;
    const updateCursor = () => {
      setPos((prev) => {
        const dx = targetPos.x - prev.x;
        const dy = targetPos.y - prev.y;
        return {
          x: prev.x + dx * 0.22,
          y: prev.y + dy * 0.22,
        };
      });
      rafId = requestAnimationFrame(updateCursor);
    };
    rafId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(rafId);
    };
  }, [targetPos.x, targetPos.y]);

  if (isTouch) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-9999 transition-opacity duration-300"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        opacity: pos.x > 0 ? 1 : 0,
      }}
    >
      <div
        className={`relative -top-1/2 -left-1/2 flex items-center justify-center transition-all duration-200 ease-out ${
          isHovering
            ? 'h-14 w-14 rounded-full bg-[#F4A300]/90 text-[#1E1410] shadow-lg backdrop-blur-xs scale-110'
            : isClicking
            ? 'h-6 w-6 rounded-full bg-[#F4A300] scale-90'
            : 'h-8 w-8 rounded-full bg-[#F4A300]/30 border border-[#F4A300]/70'
        }`}
      >
        {/* Tiny kulfi droplet dot in center when idle */}
        {!isHovering && (
          <div className="h-2 w-2 rounded-full bg-[#F4A300] shadow-xs" />
        )}

        {/* Text inside cursor when hovering */}
        {isHovering && cursorText && (
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#1E1410] px-1 text-center select-none">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
