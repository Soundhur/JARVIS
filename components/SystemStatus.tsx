
import React, { useState, useEffect } from 'react';

const StatBar: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  return (
    <div className="mb-4 font-mono">
      <div className="flex justify-between items-center mb-1 text-cyan-400 text-sm">
        <span>{label}</span>
        <span>{value.toFixed(2)}%</span>
      </div>
      <div className="w-full bg-cyan-900/50 rounded-full h-2.5">
        <div 
          className="bg-cyan-400 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};


const SystemStatus: React.FC = () => {
  const [cpu, setCpu] = useState(25);
  const [memory, setMemory] = useState(45);
  const [network, setNetwork] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.random() * 20 + 15); // Fluctuate between 15% and 35%
      setMemory(Math.random() * 10 + 40); // Fluctuate between 40% and 50%
      setNetwork(Math.random() * 15 + 5); // Fluctuate between 5% and 20%
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <StatBar label="AI Core Processing" value={cpu} />
      <StatBar label="Cognitive Matrix Load" value={memory} />
      <StatBar label="Data Stream I/O" value={network} />
       <div className="mt-6 text-center text-green-400 font-mono text-sm animate-pulse">
        <p>SYSTEM STATUS: ALL SYSTEMS NOMINAL</p>
      </div>
    </div>
  );
};

export default SystemStatus;
