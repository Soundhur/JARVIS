import React from 'react';

export const AiIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="5" fill="none" opacity="0.5"/>
    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.7"/>
    <circle cx="50" cy="50" r="15"/>
  </svg>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
  </svg>
);

interface AvatarProps {
  sender: 'user' | 'ai';
}

const Avatar: React.FC<AvatarProps> = ({ sender }) => {
  const baseClasses = "w-8 h-8 rounded-full flex-shrink-0";
  if (sender === 'ai') {
    return (
      <div className={`${baseClasses} p-1 bg-gray-800 border-2 border-cyan-500/50 text-cyan-400`}>
        <AiIcon />
      </div>
    );
  }
  return (
     <div className={`${baseClasses} p-1 bg-gray-800 border-2 border-cyan-800/50 text-cyan-600`}>
       <UserIcon />
     </div>
  );
};

export default Avatar;
