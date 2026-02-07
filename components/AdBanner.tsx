
import React, { useEffect } from 'react';

interface AdBannerProps {
  slotId?: string; // Replace with your default slot ID if you want
  format?: 'auto' | 'fluid' | 'rectangle';
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  slotId = "XXXXXXXXXX", 
  format = "auto" 
}) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense push error", e);
    }
  }, []);

  return (
    <div className="w-full my-8 flex justify-center">
      <div className="relative p-6 bg-white border-2 border-[#333940] rounded-[2rem] sketch-shadow w-full max-w-2xl overflow-hidden min-h-[100px] flex flex-col items-center">
        {/* Hand-drawn tape detail */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-8 bg-[#333940]/10 border-x border-[#333940]/20 rotate-1"></div>
        
        <div className="mb-2 text-[10px] text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
            <span>Notice Board</span>
            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
            <span>Sponsored Message</span>
        </div>

        <div className="w-full flex justify-center bg-gray-50/50 rounded-xl p-2 min-h-[90px]">
          {/* AdSense Unit */}
          <ins className="adsbygoogle"
               style={{ display: 'block', width: '100%' }}
               data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
               data-ad-slot={slotId}
               data-ad-format={format}
               data-full-width-responsive="true"></ins>
        </div>

        {/* Decorative corner doodle */}
        <div className="absolute -bottom-2 -right-2 text-2xl opacity-10">🌸</div>
      </div>
    </div>
  );
};
