
import React, { useState } from 'react';
import { Letter } from '../types';
import { StarDoodle, SwirlDoodle } from './Doodles';

interface LetterItemProps {
  letter: Letter;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const LetterItem: React.FC<LetterItemProps> = ({ letter, onClose, onDelete }) => {
  const [isMounting, setIsMounting] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsMounting(false), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${!isMounting ? 'bg-[#333940]/70 backdrop-blur-md' : 'bg-transparent'}`}>
      <div 
        className={`
          relative w-full max-w-xl transform transition-all duration-500 ease-out
          ${!isMounting ? 'translate-y-0 opacity-100 scale-100 rotate-0' : 'translate-y-10 opacity-0 scale-95'}
        `}
      >
        {/* The Paper */}
        <div className={`
          ${letter.color} rounded-[2rem] p-10 md:p-12 border-2 border-[#333940] relative letter-reveal overflow-hidden shadow-[12px_12px_0px_rgba(0,0,0,0.15)]
          before:absolute before:inset-2 before:border-2 before:border-[#333940]/5 before:rounded-[1.8rem] before:pointer-events-none
        `}>
          {/* Sketchy Detail */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/handmade-paper.png")'}}></div>

          {/* Stamp */}
          <div className="absolute top-6 right-6 flex flex-col items-center gap-1">
            <div className="w-16 h-20 border-2 border-[#333940] bg-white p-1 rounded-lg flex flex-col items-center justify-center transform rotate-6 transition-transform">
              <span className="text-3xl">💌</span>
              <span className="text-[7px] text-[#F69D8D] font-bold">POSTME</span>
            </div>
            <StarDoodle className="mt-2 scale-75 opacity-50" />
          </div>

          <div className="mt-8 space-y-6 relative">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-[#F69D8D] uppercase tracking-widest">A sweet note from</span>
              <span className="cursive text-4xl text-[#333940] sketchy-underline">{letter.from}</span>
            </div>
            
            <div className="cursive text-4xl md:text-5xl text-gray-800 leading-tight min-h-[250px] whitespace-pre-wrap py-4 italic">
              {letter.content}
            </div>

            <div className="flex justify-between items-center pt-6 border-t-2 border-[#333940]/10">
              <div className="flex gap-2">
                <span className="text-2xl opacity-40">🌸</span>
                <span className="text-2xl opacity-40">✨</span>
              </div>
              <div className="text-right text-[9px] text-gray-400 uppercase tracking-widest">
                Sent with love on {new Date(letter.timestamp).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 bg-white text-[#333940] py-4 rounded-xl text-lg border-2 border-[#333940] shadow-[4px_4px_0px_#333940] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
            >
              KEEP IT
            </button>
            <button 
              onClick={() => onDelete(letter.id)}
              className="px-6 bg-[#333940] text-white py-4 rounded-xl hover:bg-red-400 transition-all border-2 border-[#333940]"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Floating Sketchy Decor */}
        <div className="absolute -top-10 -left-6 text-5xl opacity-30">🌸</div>
        <div className="absolute -bottom-10 -right-6 text-5xl opacity-30">✨</div>
        <SwirlDoodle className="absolute top-1/2 -right-12 opacity-20 -rotate-90" />
      </div>
    </div>
  );
};
