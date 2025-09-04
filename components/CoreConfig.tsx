import React from 'react';
import { GlobeIcon } from './Icons';
import Module from './Module';

interface CoreConfigProps {
  isWebSearchEnabled: boolean;
  onWebSearchToggle: () => void;
}

const CoreConfig: React.FC<CoreConfigProps> = ({ isWebSearchEnabled, onWebSearchToggle }) => {
  return (
    <Module title="CORE CONFIGURATION">
      <div className="flex items-center justify-between font-mono">
        <div className="flex items-center space-x-3">
          <GlobeIcon className="w-6 h-6 text-cyan-400" />
          <span className="text-cyan-300">Web Access</span>
        </div>
        <button
          onClick={onWebSearchToggle}
          className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900/50 focus:ring-cyan-500"
          role="switch"
          aria-checked={isWebSearchEnabled}
        >
          <span className={`${
            isWebSearchEnabled ? 'bg-cyan-500' : 'bg-gray-700'
          } absolute h-full w-full rounded-full transition-colors`} />
          <span className={`${
            isWebSearchEnabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
        </button>
      </div>
       <p className="text-cyan-500 font-mono text-xs mt-3">
         Allows J.A.R.V.I.S. to access real-time information from Google Search for more up-to-date responses.
      </p>
    </Module>
  );
};

export default CoreConfig;
