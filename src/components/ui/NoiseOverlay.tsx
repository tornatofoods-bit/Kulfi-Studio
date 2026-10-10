import React from 'react';

export const NoiseOverlay: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-90 opacity-[0.035] noise-bg mix-blend-multiply"
    />
  );
};
