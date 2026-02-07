
import { Letter, UserProfile } from '../types';
import { supabase } from './supabase';

const USER_SESSION_KEY = 'postme_session_userid';
const LOCAL_LETTERS_KEY = 'postme_local_letters';
const LOCAL_PROFILES_KEY = 'postme_local_profiles';

// Helper to check if Supabase is properly configured with real values
const isSupabaseConfigured = () => {
  try {
    const url = (process.env as any)?.SUPABASE_URL;
    const key = (process.env as any)?.SUPABASE_ANON_KEY;
    
    return (
      url && 
      key && 
      url.includes('supabase.co') && 
      !url.includes('your-project') &&
      !url.includes('placeholder')
    );
  } catch {
    return false;
  }
};

export const storage = {
  getLetters: async (userId: string): Promise<Letter[]> => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('letters')
          .select('*')
          .eq('to', userId)
          .order('timestamp', { ascending: false });

        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase fetch failed, using local fallback');
      }
    }

    const localData = localStorage.getItem(LOCAL_LETTERS_KEY);
    const allLetters: Letter[] = localData ? JSON.parse(localData) : [];
    return allLetters
      .filter(l => l.to === userId.toLowerCase().trim())
      .sort((a, b) => b.timestamp - a.timestamp);
  },
  
  saveLetter: async (letter: Letter) => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('letters').insert([letter]);
      } catch (e) {
        console.warn('Supabase save failed');
      }
    }

    const localData = localStorage.getItem(LOCAL_LETTERS_KEY);
    const allLetters: Letter[] = localData ? JSON.parse(localData) : [];
    allLetters.push(letter);
    localStorage.setItem(LOCAL_LETTERS_KEY, JSON.stringify(allLetters));
  },

  markAsRead: async (id: string) => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('letters').update({ isRead: true }).eq('id', id);
      } catch (e) {}
    }

    const localData = localStorage.getItem(LOCAL_LETTERS_KEY);
    if (localData) {
      const allLetters: Letter[] = JSON.parse(localData);
      const index = allLetters.findIndex(l => l.id === id);
      if (index !== -1) {
        allLetters[index].isRead = true;
        localStorage.setItem(LOCAL_LETTERS_KEY, JSON.stringify(allLetters));
      }
    }
  },

  deleteLetter: async (id: string) => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('letters').delete().eq('id', id);
      } catch (e) {}
    }

    const localData = localStorage.getItem(LOCAL_LETTERS_KEY);
    if (localData) {
      const allLetters: Letter[] = JSON.parse(localData);
      const filtered = allLetters.filter(l => l.id !== id);
      localStorage.setItem(LOCAL_LETTERS_KEY, JSON.stringify(filtered));
    }
  },

  getProfile: async (userId: string): Promise<UserProfile | null> => {
    const cleanId = userId.toLowerCase().trim();
    
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', cleanId)
          .single();

        if (!error && data) {
          return {
            userId: data.username,
            name: data.username,
            avatar: data.avatar || '💌'
          };
        }
      } catch (e) {}
    }

    const localProfiles = localStorage.getItem(LOCAL_PROFILES_KEY);
    const profiles: Record<string, UserProfile> = localProfiles ? JSON.parse(localProfiles) : {};
    return profiles[cleanId] || null;
  },

  ensureUser: async (username: string): Promise<UserProfile> => {
    const userId = username.trim().toLowerCase();
    const existing = await storage.getProfile(userId);
    
    if (existing) {
      localStorage.setItem(USER_SESSION_KEY, userId);
      return existing;
    }

    const newUser: UserProfile = {
      userId,
      name: userId,
      avatar: '💌'
    };

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('profiles').insert([{ username: userId, avatar: '💌' }]);
      } catch (e) {}
    }

    const localProfiles = localStorage.getItem(LOCAL_PROFILES_KEY);
    const profiles: Record<string, UserProfile> = localProfiles ? JSON.parse(localProfiles) : {};
    profiles[userId] = newUser;
    localStorage.setItem(LOCAL_PROFILES_KEY, JSON.stringify(profiles));

    localStorage.setItem(USER_SESSION_KEY, userId);
    return newUser;
  },

  getSessionUserId: (): string | null => {
    try {
      return localStorage.getItem(USER_SESSION_KEY);
    } catch {
      return null;
    }
  },

  logout: () => {
    try {
      localStorage.removeItem(USER_SESSION_KEY);
    } catch {}
  }
};
