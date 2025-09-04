import React from 'react';

export const MicIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM11 5a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0V5Z" />
    <path d="M12 15a4 4 0 0 0-4 4v1a1 1 0 0 0 2 0v-1a2 2 0 0 1 4 0v1a1 1 0 0 0 2 0v-1a4 4 0 0 0-4-4Z" />
  </svg>
);

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
  </svg>
);

export const VolumeUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06ZM18.584 12a3.75 3.75 0 0 1-2.084 3.322.75.75 0 1 0 .832 1.352A5.25 5.25 0 0 0 20.25 12a5.25 5.25 0 0 0-2.918-4.674.75.75 0 1 0-.832 1.352A3.75 3.75 0 0 1 18.584 12Z" />
    <path d="M21.75 12c0 2.18-1.01 4.139-2.588 5.392a.75.75 0 1 0 .976 1.148A8.25 8.25 0 0 0 23.25 12a8.25 8.25 0 0 0-3.112-6.54.75.75 0 1 0-.976 1.148A6.75 6.75 0 0 1 21.75 12Z" />
  </svg>
);

export const VolumeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06ZM18.28 15.28a.75.75 0 0 0 1.06-1.06l-2.001-2.002 2.001-2.002a.75.75 0 1 0-1.06-1.06l-2.002 2.001-2.002-2.001a.75.75 0 0 0-1.06 1.06l2.002 2.002-2.002 2.002a.75.75 0 1 0 1.06 1.06l2.002-2.001 2.002 2.001Z" />
  </svg>
);

export const GlobeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-.61.08-1.21.21-1.78L8.99 15v1c0 1.1.9 2 2 2v1.93C7.06 19.43 4 16.07 4 12zm14.79 6.22L14 13.01V12c0-1.1-.9-2-2-2h-1.01L6.22 5.21C7.79 4.45 9.8 4 12 4c4.42 0 8 3.58 8 8 0 2.2-1.55 3.21-2.21 4.22z" />
  </svg>
);
