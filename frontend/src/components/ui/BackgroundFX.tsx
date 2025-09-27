import React from 'react';

const BackgroundFX: React.FC = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
    {/* Deep space gradient mesh */}
    <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_10%_10%,rgba(99,102,241,0.35),transparent),radial-gradient(40%_60%_at_90%_10%,rgba(236,72,153,0.25),transparent),radial-gradient(50%_50%_at_50%_80%,rgba(16,185,129,0.15),transparent)]" />
    {/* Subtle grid with vignette */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:22px_22px] opacity-30" />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
  </div>
);

export default BackgroundFX;
