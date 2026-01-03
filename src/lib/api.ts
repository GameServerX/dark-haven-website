const API_URLS = {
  auth: 'https://functions.poehali.dev/83a601cd-52e3-4b2e-a051-2042ad201432',
  chat: 'https://functions.poehali.dev/f4fa8a03-8081-433d-a4a1-5145e2d13a79',
  users: 'https://functions.poehali.dev/15cc7559-5309-4b79-94ba-15c080c62708'
};

export interface User {
  id: number;
  username: string;
  email?: string;
  isAdmin: boolean;
  avatarUrl?: string;
  bio?: string;
  level: number;
  experience: number;
  totalMessages?: number;
  totalTimeOnline?: number;
  achievements?: string[];
  friends?: number[];
  onlineStatus: 'online' | 'away' | 'offline';
  createdAt?: string;
  lastLogin?: string;
  lastSeen?: string;
}

export interface ChatMessage {
  id: number;
  message: string;
  timestamp: string;
  edited: boolean;
  user: User;
}

export const api = {
  async register(username: string, password: string, email?: string) {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', username, password, email })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    return response.json();
  },

  async login(username: string, password: string) {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    return response.json();
  },

  async verifyToken(token: string) {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ action: 'verify' })
    });
    
    if (!response.ok) return null;
    return response.json();
  },

  async updateProfile(token: string, updates: Partial<User>) {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ action: 'update_profile', ...updates })
    });
    
    return response.json();
  },

  async getMessages(limit = 50) {
    const response = await fetch(`${API_URLS.chat}?limit=${limit}`);
    return response.json();
  },

  async sendMessage(token: string, message: string) {
    const response = await fetch(API_URLS.chat, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }
    
    return response.json();
  },

  async deleteMessage(token: string, messageId: number) {
    const response = await fetch(`${API_URLS.chat}?id=${messageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.json();
  },

  async getUserProfile(userId: number) {
    const response = await fetch(`${API_URLS.users}?id=${userId}`);
    return response.json();
  },

  async searchUsers(query: string) {
    const response = await fetch(`${API_URLS.users}?search=${encodeURIComponent(query)}`);
    return response.json();
  },

  async getOnlineUsers() {
    const response = await fetch(API_URLS.users);
    return response.json();
  },

  async addFriend(token: string, friendId: number) {
    const response = await fetch(API_URLS.users, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ action: 'add', friendId })
    });
    
    return response.json();
  },

  async removeFriend(token: string, friendId: number) {
    const response = await fetch(API_URLS.users, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ action: 'remove', friendId })
    });
    
    return response.json();
  }
};
