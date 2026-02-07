
import React, { useState } from 'react';
import { PASTEL_COLORS, Letter } from '../types';
import { Button } from './Button';
import { HeartDoodle, SwirlDoodle } from './Doodles';

interface ComposeFormProps {
  senderId: string;
  onSend: (to: string, content: string, color: string) => void;
  onCancel: () => void;
}

export const ComposeForm: React.FC<ComposeFormProps> = ({ senderId, onSend, onCancel }) => {
  const [to, setTo] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(PASTEL_COLORS[0]);
  const [isSending, setIsSending] = useState(false);
  const [isMounting, setIsMounting] = useState(true);

  React.useEffect(() => {
    setTimeout(() => setIsMounting(false), 50);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !content) return;
    setIsSending(true);
    setTimeout(() => {
      onSend(to, content, selectedColor);
    }, 1200);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${!isMounting ? 'bg-[#333940]/60 backdrop-blur-sm' : 'bg-transparent'}`}>
      <form 
        onSubmit={handleSubmit}
        className={`bg-white w-full max-w-xl rounded-[2.5rem] p-8 md:p-10 border-2 border-[#333940] shadow-[10px_10px_0px_rgba(51,57,100,0.15)] space-y-6 relative overflow-hidden transition-all duration-700 ease-out
          ${!isMounting ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}
        `}
      >
        {/* Sketchy Top Bar */}
        <div className="absolute top-0 left-0 w-full h-5 bg-[#F69D8D] border-b-2 border-[#333940] flex items-center justify-center">
            <div className="flex gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-white/40 rounded-full"></div>
                ))}
            </div>
        </div>
        
        <div className="flex justify-between items-start pt-4">
          <div className="relative">
            <h2 className="text-3xl text-[#333940]">Write Note</h2>
            <p className="text-sm text-[#F69D8D] mt-1 italic">From: {senderId}</p>
            <HeartDoodle className="absolute -left-6 -top-2 opacity-30 scale-75 -rotate-12" />
          </div>
          <button type="button" onClick={onCancel} className="w-10 h-10 bg-[#FFF9F8] border-2 border-[#333940] rounded-xl flex items-center justify-center text-[#333940] hover:bg-[#F69D8D] transition-all text-xl">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-1 ml-1">Who is this for?</label>
            <div className="relative">
                <input 
                  required
                  placeholder="Username..."
                  className="w-full bg-[#FFF9F8] border-2 border-[#333940]/10 rounded-xl px-5 py-3 focus:bg-white focus:border-[#333940] outline-none transition-all text-[#333940] placeholder:text-gray-300"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
                <SwirlDoodle className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2 ml-1">Select Paper</label>
            <div className="flex gap-3 p-2 bg-[#FFF9F8] rounded-xl w-max border border-[#333940]/5">
              {PASTEL_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-xl border-2 transition-all ${color} ${selectedColor === color ? 'border-[#333940] scale-110 -rotate-3' : 'border-transparent opacity-60'}`}
                />
              ))}
            </div>
          </div>

          <div className="relative group">
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1 ml-1">Your Message</label>
            <div className="relative sketchy-border-soft p-1 transition-colors hover:border-[#F69D8D]/30">
                <textarea 
                  required
                  rows={5}
                  placeholder="Start writing something funny..."
                  className={`w-full ${selectedColor} border-2 border-[#333940] rounded-[1.5rem] p-6 cursive text-3xl focus:shadow-inner outline-none transition-all resize-none text-[#333940] leading-snug`}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
            </div>
            <div className={`absolute bottom-6 right-6 text-3xl transition-all ${isSending ? 'animate-fly' : 'opacity-10 group-focus-within:opacity-40'}`}>
              {isSending ? '✈️' : '✒️'}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <Button variant="ghost" onClick={onCancel} className="flex-1 text-sm">Cancel</Button>
          <Button disabled={isSending} className="flex-[2] text-lg bg-[#F69D8D] group overflow-hidden relative">
            <span className={`transition-transform duration-500 ${isSending ? '-translate-y-12' : ''}`}>Send it! 📮</span>
            {isSending && (
              <span className="absolute inset-0 flex items-center justify-center translate-y-0 transition-transform duration-500">
                 Woooosh! 💨
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
