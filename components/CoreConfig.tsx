import React from 'react';
import { GlobeIcon, MicIcon } from './Icons';
import Module from './Module';

interface CoreConfigProps {
  isWebSearchEnabled: boolean;
  onWebSearchToggle: () => void;
  isStandbyModeEnabled: boolean;
  onStandbyModeToggle: () => void;
}

const CoreConfig: React.FC<CoreConfigProps> = ({ isWebSearchEnabled, onWebSearchToggle, isStandbyModeEnabled, onStandbyModeToggle }) => {
  return (
    <Module title="CORE CONFIGURATION">
      <div className="space-y-4 font-mono">
        <div className="flex items-center justify-between">
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MicIcon className="w-6 h-6 text-cyan-400" />
            <span className="text-cyan-300">Voice Standby</span>
          </div>
          <button
            onClick={onStandbyModeToggle}
            className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900/50 focus:ring-cyan-500"
            role="switch"
            aria-checked={isStandbyModeEnabled}
          >
            <span className={`${
              isStandbyModeEnabled ? 'bg-cyan-500' : 'bg-gray-700'
            } absolute h-full w-full rounded-full transition-colors`} />
            <span className={`${
              isStandbyModeEnabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
          </button>
        </div>
      </div>
       <p className="text-cyan-500 font-mono text-xs mt-3">
         Web Access allows real-time information retrieval. Voice Standby enables hands-free activation using the hotword "J.A.R.V.I.S.".
      </p>
    </Module>
  );
};

export default CoreConfig;