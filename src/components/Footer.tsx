import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-glass py-6 px-4 text-center z-30 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-1.5">
        <p className="text-sm font-semibold tracking-wide text-cyan-300 neon-text-cyan">
          © 2026 My Network Information Dashboard
        </p>
        <p className="text-xs font-medium text-cyan-400 tracking-wider">
          Designed &amp; Developed by <span className="font-bold underline decoration-cyan-400/50">Rahul Murmu</span>
        </p>
        <p className="text-[11px] font-normal text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
          All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};
