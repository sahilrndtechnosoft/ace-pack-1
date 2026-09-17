import React from 'react';

// Reusable decorative wave layer for the hero. Two thin, low-opacity curved
// lines that drift very slowly and independently (own CSS animation, no
// props tied to slide state) — sits behind the content, purely atmospheric.
// Kept as its own component so any other section can reuse the same
// treatment without duplicating the SVG.
export const HeroWaves: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <svg
        className="hero-wave-a absolute -left-[10%] top-[8%] w-[120%] h-auto opacity-[0.12]"
        viewBox="0 0 1200 300"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 150C150 80 350 220 600 150C850 80 1050 220 1200 150"
          stroke="#cfa144"
          strokeWidth="1.5"
        />
      </svg>
      <svg
        className="hero-wave-b absolute -left-[8%] bottom-[6%] w-[118%] h-auto opacity-[0.09]"
        viewBox="0 0 1200 300"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 120C200 200 400 40 650 120C900 200 1050 60 1200 120"
          stroke="#cfa144"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};
