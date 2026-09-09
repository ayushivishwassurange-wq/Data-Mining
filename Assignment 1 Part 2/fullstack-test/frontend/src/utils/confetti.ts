import confetti from 'canvas-confetti';

export function triggerTaskCelebration() {
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.7 },
    colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
    ticks: 200,
    gravity: 1.2,
    scalar: 0.9,
  });
}

export function triggerBigCelebration() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#6366f1', '#10b981', '#f59e0b'],
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#3b82f6', '#ec4899', '#8b5cf6'],
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}
