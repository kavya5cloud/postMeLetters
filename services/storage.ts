
import { Letter, UserProfile } from '../types';
import { supabase } from './supabase';

const USER_SESSION_KEY = 'postme_session_userid';

export const storage = {
  // Letters from Supabase
  getLetters: async (userId: string): Promise<Letter[]> => {
    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .eq('to', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching letters:', error);
      return [];
    }
    return data || [];
  },
  
  saveLetter: async (letter: Letter) => {
    const { error } = await supabase
      .from('letters')
      .insert([letter]);

    if (error) {
      console.error('Error saving letter:', error);
      throw error;
    }
  },

  markAsRead: async (id: string) => {
    const { error } = await supabase
      .from('letters')
      .update({ isRead: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking as read:', error);
    }
  },

  deleteLetter: async (id: string) => {
    const { error } = await supabase
      .from('letters')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting letter:', error);
    }
  },

  // Profile Management
  getProfile: async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', userId.toLowerCase())
      .single();

    if (error) return null;
    return {
      userId: data.username,
      name: data.username,
      avatar: data.avatar || '💌'
    };
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

    const { error } = await supabase
      .from('profiles')
      .insert([{ username: userId, avatar: '💌' }]);

    if (error) {
      console.error('Error creating profile:', error);
    }

    localStorage.setItem(USER_SESSION_KEY, userId);
    return newUser;
  },

  getSessionUserId: (): string | null => {
    return localStorage.getItem(USER_SESSION_KEY);
  },

  logout: () => {
    localStorage.removeItem(USER_SESSION_KEY);
  }
};
