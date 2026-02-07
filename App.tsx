
import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, UserProfile, Letter, PASTEL_COLORS } from './types';
import { storage } from './services/storage';
import { aiService } from './services/ai';
import { audioService } from './services/audio';
import { Mailbox } from './components/Mailbox';
import { Button } from './components/Button';
import { ComposeForm } from './components/ComposeForm';
import { LetterItem } from './components/LetterItem';
import { AdBanner } from './components/AdBanner';
import { StarDoodle, HeartDoodle, SwirlDoodle, LeafDoodle } from './components/Doodles';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [isCheckingMail, setIsCheckingMail] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Session
  useEffect(() => {
    const initSession = async () => {
      const savedId = storage.getSessionUserId();
      if (savedId) {
        const profile = await storage.getProfile(savedId);
        if (profile) {
          setCurrentUser(profile);
          const initialLetters = await storage.getLetters(profile.userId);
          setLetters(initialLetters);
        }
      }
      setIsLoading(false);
    };
    initSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserId.trim()) return;
    
    setIsLoading(true);
    try {
      const user = await storage.ensureUser(newUserId);
      setCurrentUser(user);
      const initialLetters = await storage.getLetters(user.userId);
      setLetters(initialLetters);
      audioService.playOpen();
    } catch (err) {
      alert("Something went wrong joining the PostMe world!");
    } finally {
      setIsLoading(false);
    }
  };

  const checkMail = useCallback(async () => {
    if (isCheckingMail || !currentUser) return;
    setIsCheckingMail(true);
    audioService.playOpen();
    
    try {
      // Simulate checking delay for charm
      await new Promise(resolve => setTimeout(resolve, 1500));
      const freshLetters = await storage.getLetters(currentUser.userId);
      setLetters(freshLetters);
      setView(ViewState.INBOX);
    } finally {
      setIsCheckingMail(false);
    }
  }, [currentUser, isCheckingMail]);

  const sendLetter = async (to: string, content: string, color: string) => {
    if (!currentUser) return;
    
    audioService.playSend();

    const newLetter: Letter = {
      id: crypto.randomUUID(),
      from: currentUser.userId,
      to: to.toLowerCase().trim(),
      content,
      timestamp: Date.now(),
      color,
      isRead: false
    };

    try {
      await storage.saveLetter(newLetter);
      setShowCompose(false);
      
      // Handle AI Pen Pal
      const target = to.toLowerCase().trim();
      if (target === 'postbot' || target === 'stardust' || target === 'gigglebot') {
        const replyContent = await aiService.generateReply(content, currentUser.userId);
        const aiLetter: Letter = {
          id: crypto.randomUUID(),
          from: 'PostBot',
          to: currentUser.userId,
          content: replyContent,
          timestamp: Date.now() + 2000,
          color: 'bg-white',
          isRead: false,
          isMagic: true
        };
        
        setTimeout(async () => {
          await storage.saveLetter(aiLetter);
          setLetters(prev => [aiLetter, ...prev]);
          audioService.playNotify();
        }, 2500);
      }
    } catch (err) {
      alert("The carrier pigeon got lost! Please try again.");
    }
  };

  const deleteLetter = async (id: string) => {
    audioService.playDelete();
    await storage.deleteLetter(id);
    setLetters(prev => prev.filter(l => l.id !== id));
    setSelectedLetter(null);
  };

  const handleLogout = () => {
    storage.logout();
    setCurrentUser(null);
    setLetters([]);
    setView(ViewState.HOME);
    audioService.playOpen();
  };

  const markRead = async (letter: Letter) => {
    audioService.playOpen();
    setSelectedLetter(letter);
    if (!letter.isRead) {
      await storage.markAsRead(letter.id);
      setLetters(prev => prev.map(l => l.id === letter.id ? { ...l, isRead: true } : l));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F8]">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-float-gentle">📮</div>
          <p className="cursive text-2xl text-[#F69D8D]">Waking up the pigeons...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FFF9F8] overflow-hidden relative">
        <StarDoodle className="absolute top-20 left-20 opacity-20" />
        <HeartDoodle className="absolute bottom-20 right-20 opacity-20 rotate-12" />
        <SwirlDoodle className="absolute top-40 right-1/4 opacity-10" />
        
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl text-center space-y-8 border-2 border-[#333940] relative z-10 sketch-shadow">
          <div className="w-32 h-32 bg-[#F69D8D] border-2 border-[#333940] rounded-t-full rounded-b-xl flex items-center justify-center text-6xl mx-auto shadow-md ring-4 ring-[#F69D8D]/10 relative group">
            💌
            <LeafDoodle className="absolute -bottom-4 -right-4 opacity-40 scale-75 group-hover:rotate-12 transition-transform" />
          </div>
          <div>
            <h1 className="text-4xl text-[#333940] mb-1 tracking-tight sketchy-underline inline-block">PostMe Letters</h1>
            <p className="text-[#F69D8D] text-sm tracking-widest italic uppercase mt-2">Letters to your loved ones</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
                <input 
                  type="text"
                  placeholder="Your username..."
                  className="w-full bg-[#FFF9F8] border-2 border-[#333940]/10 rounded-xl px-5 py-3 outline-none focus:border-[#F69D8D] transition-all text-center text-xl text-[#333940] placeholder:text-gray-300"
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                />
            </div>
            <Button disabled={isLoading} className="w-full py-4 text-xl rounded-xl bg-[#333940] hover:bg-black tracking-widest border-b-4 border-black text-white">
              {isLoading ? 'Wait...' : 'Get Started!'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const unreadCount = letters.filter(l => !l.isRead).length;

  return (
    <div className="min-h-screen pb-32 relative">
      <StarDoodle className="fixed top-1/4 left-10 opacity-10" />
      <HeartDoodle className="fixed bottom-1/4 right-10 opacity-10 rotate-45" />

      <header className="p-6 flex justify-between items-center max-w-5xl mx-auto relative z-10">
        <div className="flex items-center gap-3 group">
          <div className="w-14 h-14 bg-[#F69D8D] border-2 border-[#333940] text-white rounded-xl flex items-center justify-center text-2xl shadow-sm transition-transform group-hover:-rotate-3 relative">
            {currentUser.avatar}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border border-[#333940]/10"></div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl text-[#333940] tracking-tight leading-none">{currentUser.userId}</h2>
            <span className="text-[10px] text-[#F69D8D] uppercase tracking-widest italic">My Mailbox</span>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="bg-white px-4 py-1.5 rounded-xl border border-[#333940]/10 text-gray-400 hover:text-[#F69D8D] transition-all text-xs uppercase tracking-widest"
        >
          Logout
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 relative z-10">
        {view === ViewState.HOME && (
          <div className="flex flex-col items-center justify-center py-2 space-y-10 view-transition">
            <div className="text-center relative">
               <h1 className="text-3xl text-[#333940] tracking-tight mb-1">
                Welcome, {currentUser.userId}!
               </h1>
               <p className="cursive text-4xl text-[#F69D8D] opacity-80 animate-wiggle-gentle">Send some love today...</p>
               <SwirlDoodle className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-20" />
            </div>
            
            <Mailbox 
              hasMail={unreadCount > 0} 
              isChecking={isCheckingMail} 
              onOpen={checkMail} 
            />
            
            <div className="flex flex-col items-center gap-6">
               <Button onClick={() => { audioService.playOpen(); setShowCompose(true); }} className="px-12 py-4 text-xl bg-[#F69D8D] hover:bg-[#ff8a7a] border-b-4 border-[#d47b6d] rounded-2xl shadow-lg relative overflow-visible">
                 Write Letter ✏️
                 <span className="absolute -top-2 -right-2 text-2xl animate-float-gentle">✨</span>
                 <StarDoodle className="absolute -bottom-4 -left-8 scale-75 opacity-40 rotate-12" />
               </Button>
               
               {unreadCount > 0 && (
                 <div className="bg-[#333940] text-white px-6 py-2 rounded-full text-xs uppercase tracking-widest flex items-center gap-2 animate-wiggle-gentle shadow-md">
                   📫 {unreadCount} New letters!
                 </div>
               )}
            </div>

            {/* Ad Banner on Home Page */}
            <AdBanner />
          </div>
        )}

        {view === ViewState.INBOX && (
          <div className="space-y-8 view-transition">
            <div className="flex items-end justify-between border-b-2 border-[#333940]/10 pb-4 relative">
              <h2 className="text-4xl text-[#333940] flex items-center gap-3">
                <span className="sketchy-underline">My Inbox</span>
                <span className="text-3xl animate-float-gentle">✉️</span>
              </h2>
              <Button variant="ghost" onClick={() => { audioService.playOpen(); setView(ViewState.HOME); }} className="text-[#F69D8D]">Back</Button>
              <HeartDoodle className="absolute -top-4 right-20 opacity-20 scale-50" />
            </div>
            
            {letters.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-[#333940]/5 flex flex-col items-center gap-3 relative">
                <span className="text-6xl opacity-10 animate-float-gentle">🌸</span>
                <p className="text-gray-300 text-lg italic tracking-widest">Your mailbox is empty...</p>
                <LeafDoodle className="absolute bottom-4 left-4 opacity-10" />
                <LeafDoodle className="absolute top-4 right-4 opacity-10 rotate-180 scale-75" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {letters.map((letter, idx) => (
                  <div 
                    key={letter.id}
                    onClick={() => markRead(letter)}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                    className={`
                      ${letter.color} p-8 rounded-[2rem] border-2 border-[#333940] cursor-pointer hover:shadow-[8px_8px_0px_rgba(51,57,64,0.05)] hover:-translate-y-0.5 transition-all relative overflow-hidden group
                      ${!letter.isRead ? 'ring-4 ring-[#F69D8D]/20' : ''}
                      ${letter.isMagic ? 'magic-shimmer' : ''}
                      before:absolute before:inset-1 before:border before:border-[#333940]/5 before:rounded-[1.9rem] before:pointer-events-none
                    `}
                  >
                    {!letter.isRead && (
                      <div className="absolute top-4 right-4 w-4 h-4 bg-[#F69D8D] rounded-full border-2 border-white animate-pulse-soft z-10"></div>
                    )}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col">
                         <span className="text-[10px] text-gray-400 uppercase tracking-widest">From</span>
                         <span className="cursive text-3xl text-[#333940]">{letter.from}</span>
                      </div>
                      {letter.isMagic && <span className="text-[9px] bg-[#333940] text-white px-2 py-0.5 rounded-full uppercase tracking-widest relative z-10">✨ Magical AI</span>}
                    </div>
                    <p className="text-gray-600 line-clamp-3 cursive text-3xl group-hover:text-black transition-colors leading-snug">
                      {letter.content}
                    </p>
                    <div className="mt-6 flex justify-between items-center opacity-30">
                      <span className="text-xl">💌</span>
                      <span className="text-[9px] uppercase tracking-tighter">{new Date(letter.timestamp).toDateString()}</span>
                    </div>
                    <StarDoodle className="absolute -bottom-2 -right-2 opacity-5 scale-150 rotate-12" />
                  </div>
                ))}
              </div>
            )}

            {/* Ad Banner at the bottom of the Inbox */}
            {letters.length > 0 && <AdBanner />}
          </div>
        )}
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#333940] rounded-[2rem] p-2.5 shadow-xl flex gap-2 z-40 border-2 border-white sketch-shadow">
        <NavButton active={view === ViewState.HOME} onClick={() => { audioService.playOpen(); setView(ViewState.HOME); }} icon="🏠" label="Home" />
        <div className="w-0.5 bg-white/10 rounded-full"></div>
        <NavButton active={view === ViewState.INBOX} onClick={() => { audioService.playOpen(); setView(ViewState.INBOX); }} icon="📮" label="Box" badge={unreadCount} />
        <div className="w-0.5 bg-white/10 rounded-full"></div>
        <NavButton active={showCompose} onClick={() => { audioService.playOpen(); setShowCompose(true); }} icon="✏️" label="Write" />
      </div>

      {showCompose && (
        <ComposeForm 
          senderId={currentUser.userId} 
          onSend={sendLetter} 
          onCancel={() => { audioService.playOpen(); setShowCompose(false); }} 
        />
      )}

      {selectedLetter && (
        <LetterItem 
          letter={selectedLetter} 
          onClose={() => { audioService.playOpen(); setSelectedLetter(null); }} 
          onDelete={deleteLetter}
        />
      )}
    </div>
  );
};

const NavButton: React.FC<{ active: boolean, onClick: () => void, icon: string, label: string, badge?: number }> = ({ active, onClick, icon, label, badge }) => (
  <button 
    onClick={onClick}
    className={`group flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all relative ${active ? 'bg-[#F69D8D] text-[#333940] scale-105' : 'bg-transparent text-white/40 hover:text-white'}`}
  >
    <span className="text-xl transition-transform group-hover:scale-110 mb-0.5">{icon}</span>
    <span className={`text-[8px] uppercase tracking-tighter transition-all ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{label}</span>
    {badge ? badge > 0 && (
      <span className="absolute -top-1 -right-1 bg-white text-[#333940] text-[9px] w-5 h-5 flex items-center justify-center rounded-full border border-[#F69D8D] font-bold shadow-md animate-pulse">
        {badge}
      </span>
    ) : null}
  </button>
);

export default App;
