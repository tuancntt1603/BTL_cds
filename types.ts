export interface User {
  id: string;
  name: string;
  email: string;
  reputation: number;
}

export interface Location {
  lat: number;
  lon: number;
  name: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  condition: 'new' | 'like-new' | 'used' | 'for-parts';
  location?: Location;
}

export type View = 
  | { page: 'home' }
  | { page: 'login' }
  | { page: 'register' }
  | { page: 'addItem' }
  | { page: 'myItems' }
  | { page: 'myFavorites' }
  | { page: 'itemDetail', itemId: string }
  | { page: 'editItem', itemId: string };


export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export type NotificationType = 'exchange_request' | 'message' | 'info';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  text: string;
  isRead: boolean;
  createdAt: string;
  relatedItemId?: string;
}

export interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    fetchNotifications: () => void;
    markAsRead: (notificationIds: string[]) => void;
    createNotification: (recipientId: string, text: string, type: NotificationType, relatedItemId?: string) => void;
}

export interface Review {
  id: string;
  itemId: string;
  reviewedUserId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export type ReportReason = 'spam' | 'inappropriate' | 'scam' | 'prohibited';

export interface Report {
  id: string;
  itemId: string;
  reporterId: string;
  reason: ReportReason;
  comment: string;
  createdAt: string;
}