
import React from 'react';
import { LeafDoodle } from './Doodles';

interface MailboxProps {
  hasMail: boolean;
  isChecking: boolean;
  onOpen: () => void;
}

export const Mailbox: React.FC<MailboxProps> = ({ hasMail, isChecking, onOpen }) => {
  // varied mail items for the burst
  const flyingItems = [
    { char: '✉️', tx: '-140px', ty: '-220px', tr: '-45deg', delay: '0s' },
    { char: '💌', tx: '-70px', ty: '-300px', tr: '-20deg', delay: '0.15s' },
    { char: '🧧', tx: '0px', ty: '-340px', tr: '0deg', delay: '0.3s' },
    { char: '📫', tx: '70px', ty: '-300px', tr: '20deg', delay: '0.45s' },
    { char: '✉️', tx: '140px', ty: '-220px', tr: '45deg', delay: '0.6s' },
    { char: '✨', tx: '-50px', ty: '-250px', tr: '-10deg', delay: '0.1s' },
    { char: '🌸', tx: '50px', ty: '-250px', tr: '10deg', delay: '0.2s' },
    { char: '💖', tx: '-90px', ty: '-180px', tr: '-30deg', delay: '0.5s' },
  ];

  return (
    <div 
      onClick={onOpen}
      className={`relative cursor-pointer transition-all duration-300 group flex flex-col items-center
        ${isChecking ? 'scale-110' : 'hover:scale-105 active:scale-95'}
      `}
    >
      {/* Bursting Letters Animation - Centered around the slot area */}
      {isChecking && (
        <div className="absolute left-1/2 top-32 -translate-x-1/2 w-0 h-0 z-40 pointer-events-none">
          {flyingItems.map((item, i) => (
            <div 
              key={i}
              className="absolute whitespace-nowrap text-4xl animate-letter-pop"
              style={{ 
                '--tx': item.tx, 
                '--ty': item.ty, 
                '--tr': item.tr,
                animationDelay: item.delay
              } as React.CSSProperties}
            >
              {item.char}
            </div>
          ))}
        </div>
      )}

      {/* The Pillar Box */}
      <div className={`
        relative w-44 h-80 flex flex-col items-center
        ${isChecking ? 'animate-shake-mailbox' : 'animate-float-gentle'}
      `}>
        
        {/* Top Tiered Cap */}
        <div className="w-40 h-10 bg-[#F69D8D] border-4 border-[#333940] rounded-t-full shadow-inner relative z-30">
            <div className="absolute inset-x-0 bottom-0 h-4 border-t-4 border-[#333940] flex justify-around">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-1 h-full bg-[#333940]/20"></div>
                ))}
            </div>
        </div>

        {/* Main Cylinder Body */}
        <div className="w-36 flex-grow bg-[#F69D8D] border-x-4 border-[#333940] relative z-20 flex flex-col items-center pt-8">
            {/* The Door/Panel Detail */}
            <div className="w-28 h-48 border-2 border-[#333940]/40 rounded-t-3xl rounded-b-lg absolute top-4 flex flex-col items-center pt-4">
                {/* Mail Slot */}
                <div className="w-16 h-4 bg-[#333940] rounded-full border-2 border-[#333940] mb-4 flex items-center justify-center overflow-hidden relative">
                    <div className="w-12 h-0.5 bg-white/20"></div>
                    {/* Visual glow when checking */}
                    {isChecking && (
                      <div className="absolute inset-0 bg-white/40 animate-pulse"></div>
                    )}
                </div>
                
                {/* White Notice Card */}
                <div className="w-10 h-14 bg-white border-2 border-[#333940] rounded-sm flex flex-col gap-1 p-1">
                    <div className="w-full h-1 bg-gray-200"></div>
                    <div className="w-3/4 h-1 bg-gray-200"></div>
                    <div className="w-1/2 h-1 bg-gray-200"></div>
                </div>

                {/* Door Handle */}
                <div className="absolute right-1 top-24 w-2 h-4 bg-[#333940] rounded-sm"></div>
            </div>

            {/* "POST" Text */}
            <div className="absolute bottom-10 heading-font text-2xl text-[#333940] opacity-80 select-none">
                POST
            </div>
        </div>

        {/* The Black/Dark Base */}
        <div className="w-36 h-20 bg-[#333940] border-4 border-[#333940] rounded-b-2xl shadow-xl relative z-10">
            <div className="absolute inset-0 bg-white/5 rounded-b-xl"></div>
        </div>

        {/* Flag */}
        <div className={`
            absolute -left-4 top-32 w-4 h-16 bg-[#333940] rounded-full origin-bottom transition-all duration-700
            ${hasMail ? 'animate-flag-bob' : 'rotate-0 scale-100'}
        `}>
            <div className={`
                absolute -top-6 -left-3 w-10 h-8 rounded-lg shadow-md border-2 border-[#333940] transition-colors
                ${hasMail ? 'bg-red-400' : 'bg-[#F69D8D]'}
            `}>
              {hasMail && (
                <span className="absolute -top-2 -right-2 text-xs">✨</span>
              )}
            </div>
        </div>
      </div>

      {/* Grass Doodles at the base */}
      <div className="absolute bottom-4 -left-6 opacity-30">
        <LeafDoodle />
      </div>
      <div className="absolute bottom-2 -right-10 opacity-20 rotate-12 scale-75">
        <LeafDoodle />
      </div>

      {/* Decorative Particles */}
      {hasMail && !isChecking && (
        <div className="absolute -top-12 flex gap-4 pointer-events-none opacity-80 animate-wiggle-gentle">
          <span className="text-3xl">🧧</span>
          <span className="text-3xl">✉️</span>
        </div>
      )}
      
      {/* Help Label */}
      <div className={`
        text-center mt-6 transition-all duration-300
        ${isChecking ? 'opacity-100 translate-y-0' : 'opacity-0 group-hover:opacity-100 translate-y-1'}
      `}>
        <div className="bg-white px-4 py-1 rounded-full shadow-sm border-2 border-[#333940]/10 flex items-center gap-2">
           <p className="text-[#333940] font-bold text-sm uppercase tracking-tighter">
              {isChecking ? "Checking... 🐾" : "Open Mailbox"}
           </p>
           {!isChecking && hasMail && (
             <span className="w-2 h-2 bg-red-400 rounded-full animate-ping"></span>
           )}
        </div>
      </div>

      {/* Ground Shadow */}
      <div className="w-48 h-6 bg-[#333940]/10 rounded-full mt-2 blur-sm"></div>
    </div>
  );
};
