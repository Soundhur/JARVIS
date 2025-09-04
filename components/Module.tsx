
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
        <h2 className="text-cyan-300 font-mono text-lg tracking-wider relative overflow-hidden">
            <span className="title-text-scan">{title}</span>
        </h2>
      </div>
      <div className="p-4 flex-grow overflow-y-auto">
        {children}
      </div>
       <style>{`
        .title-text-scan::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to right, transparent, rgba(173, 216, 230, 0.5), transparent);
            opacity: 0.6;
            transform: translateX(-100%);
            animation: scan 4s linear infinite;
        }
        @keyframes scan {
            0% {
                transform: translateX(-100%);
            }
            50% {
                transform: translateX(100%);
            }
            100% {
                transform: translateX(100%);
            }
        }
       `}</style>
    </div>
  );
};

export default Module;