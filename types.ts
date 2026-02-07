
export interface Letter {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
  color: string;
  isRead: boolean;
  isMagic?: boolean;
}

export interface UserProfile {
  userId: string;
  name: string;
  avatar: string;
}

export enum ViewState {
  HOME = 'HOME',
  INBOX = 'INBOX',
  SEND = 'SEND',
  PROFILE = 'PROFILE'
}

export const PASTEL_COLORS = [
  'bg-red-50',
  'bg-pink-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-yellow-100',
  'bg-purple-100'
];
