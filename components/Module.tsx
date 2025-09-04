
import React from 'react';

interface ModuleProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Module: React.FC<ModuleProps> = ({ title, children, className }) => {
  return (
    <div className={`bg-black/30 backdrop-blur-sm border border-cyan-500/30 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.1)] flex flex-col ${className}`}>
      <div className="p-3 border-b border-cyan-500/30">
        <h2 className="text-cyan-300 font-mono text-lg tracking-wider">{title}</h2>
      </div>
      <div className="p-4 flex-grow overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Module;
