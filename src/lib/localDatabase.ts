// Локальная база данных в памяти браузера
// Все данные хранятся в localStorage с резервным копированием

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: string;
  is_admin: boolean;
  avatar?: string;
  bio?: string;
  registered_at: string;
  last_login?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Rule {
  id: number;
  number: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface WikiCategory {
  id: number;
  title: string;
  icon?: string;
  order_index: number;
  created_at: string;
}

export interface WikiPage {
  id: number;
  title: string;
  content: string;
  category_id?: number;
  created_at: string;
  updated_at: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  chat_room_id: string;
  username: string;
  content: string;
  avatar?: string;
  timestamp: string;
}

export interface RoadmapItem {
  id: number;
  title: string;
  progress: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  url: string;
  order_index: number;
  created_at: string;
}

export interface SiteConfigItem {
  id: number;
  config_key: string;
  config_value: any;
  updated_at: string;
}

export interface HeroContent {
  id: number;
  title?: string;
  subtitle?: string;
  description?: string;
  button1_text?: string;
  button2_text?: string;
  feature1_title?: string;
  feature1_desc?: string;
  feature2_title?: string;
  feature2_desc?: string;
  feature3_title?: string;
  feature3_desc?: string;
  updated_at: string;
}

export interface CustomTab {
  id: string;
  name: string;
  icon?: string;
  location: 'header' | 'sidebar';
  order_index: number;
  created_at: string;
}

export interface PageElement {
  id: string;
  section: string;
  type: 'text' | 'button' | 'image' | 'video';
  content?: string;
  position_x?: number;
  position_y?: number;
  width?: number;
  height?: number;
  styles?: any;
  link?: string;
  video_url?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PageBackground {
  id: number;
  section: string;
  background_type: 'static' | 'animated' | 'video' | 'parallax';
  url?: string;
  parallax_speed?: number;
  created_at: string;
  updated_at: string;
}

class LocalDatabase {
  private storageKey = 'darkHaven_database';

  private getDatabase() {
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      return this.initializeDatabase();
    }
    return JSON.parse(data);
  }

  private saveDatabase(db: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(db));
    // Резервная копия
    localStorage.setItem(`${this.storageKey}_backup`, JSON.stringify({
      data: db,
      timestamp: new Date().toISOString()
    }));
  }

  private initializeDatabase() {
    const db = {
      users: [],
      news: [],
      rules: [],
      wiki_categories: [
        { id: 1, title: 'Начало игры', icon: '🎮', order_index: 1, created_at: new Date().toISOString() },
        { id: 2, title: 'Механики', icon: '⚙️', order_index: 2, created_at: new Date().toISOString() },
        { id: 3, title: 'Команды', icon: '📝', order_index: 3, created_at: new Date().toISOString() },
        { id: 4, title: 'FAQ', icon: '❓', order_index: 4, created_at: new Date().toISOString() }
      ],
      wiki_pages: [],
      chat_rooms: [
        { id: 'general', name: 'Общий чат', icon: '💬', description: 'Общая комната для всех участников', created_at: new Date().toISOString() }
      ],
      chat_messages: [],
      roadmap_items: [],
      music_tracks: [],
      site_config: [],
      hero_content: [{
        id: 1,
        title: 'Dark Haven',
        subtitle: 'Добро пожаловать в Dark Haven',
        description: 'Место для вашего сообщества',
        button1_text: 'Начать игру',
        button2_text: 'Правила',
        feature1_title: 'Активное сообщество',
        feature1_desc: 'Присоединяйтесь к тысячам игроков',
        feature2_title: 'Постоянные обновления',
        feature2_desc: 'Регулярные новинки и улучшения',
        feature3_title: 'Поддержка 24/7',
        feature3_desc: 'Всегда готовы помочь',
        updated_at: new Date().toISOString()
      }],
      custom_tabs: [],
      page_elements: [],
      page_backgrounds: []
    };
    this.saveDatabase(db);
    return db;
  }

  // CRUD операции для всех таблиц

  // Users
  getUsers(): User[] {
    return this.getDatabase().users;
  }

  addUser(user: Omit<User, 'id' | 'registered_at'>): User {
    const db = this.getDatabase();
    const newUser: User = {
      ...user,
      id: db.users.length > 0 ? Math.max(...db.users.map((u: User) => u.id)) + 1 : 1,
      registered_at: new Date().toISOString()
    };
    db.users.push(newUser);
    this.saveDatabase(db);
    return newUser;
  }

  updateUser(id: number, updates: Partial<User>): User | null {
    const db = this.getDatabase();
    const index = db.users.findIndex((u: User) => u.id === id);
    if (index === -1) return null;
    db.users[index] = { ...db.users[index], ...updates };
    this.saveDatabase(db);
    return db.users[index];
  }

  // News
  getNews(): NewsItem[] {
    return this.getDatabase().news;
  }

  addNews(news: Omit<NewsItem, 'id' | 'created_at' | 'updated_at'>): NewsItem {
    const db = this.getDatabase();
    const now = new Date().toISOString();
    const newNews: NewsItem = {
      ...news,
      id: db.news.length > 0 ? Math.max(...db.news.map((n: NewsItem) => n.id)) + 1 : 1,
      created_at: now,
      updated_at: now
    };
    db.news.push(newNews);
    this.saveDatabase(db);
    return newNews;
  }

  updateNews(id: number, updates: Partial<NewsItem>): NewsItem | null {
    const db = this.getDatabase();
    const index = db.news.findIndex((n: NewsItem) => n.id === id);
    if (index === -1) return null;
    db.news[index] = { ...db.news[index], ...updates, updated_at: new Date().toISOString() };
    this.saveDatabase(db);
    return db.news[index];
  }

  deleteNews(id: number): boolean {
    const db = this.getDatabase();
    const index = db.news.findIndex((n: NewsItem) => n.id === id);
    if (index === -1) return false;
    db.news.splice(index, 1);
    this.saveDatabase(db);
    return true;
  }

  // Rules
  getRules(): Rule[] {
    return this.getDatabase().rules;
  }

  addRule(rule: Omit<Rule, 'id' | 'created_at' | 'updated_at'>): Rule {
    const db = this.getDatabase();
    const now = new Date().toISOString();
    const newRule: Rule = {
      ...rule,
      id: db.rules.length > 0 ? Math.max(...db.rules.map((r: Rule) => r.id)) + 1 : 1,
      created_at: now,
      updated_at: now
    };
    db.rules.push(newRule);
    this.saveDatabase(db);
    return newRule;
  }

  updateRule(id: number, updates: Partial<Rule>): Rule | null {
    const db = this.getDatabase();
    const index = db.rules.findIndex((r: Rule) => r.id === id);
    if (index === -1) return null;
    db.rules[index] = { ...db.rules[index], ...updates, updated_at: new Date().toISOString() };
    this.saveDatabase(db);
    return db.rules[index];
  }

  deleteRule(id: number): boolean {
    const db = this.getDatabase();
    const index = db.rules.findIndex((r: Rule) => r.id === id);
    if (index === -1) return false;
    db.rules.splice(index, 1);
    this.saveDatabase(db);
    return true;
  }

  // Wiki Categories
  getWikiCategories(): WikiCategory[] {
    return this.getDatabase().wiki_categories;
  }

  addWikiCategory(category: Omit<WikiCategory, 'id' | 'created_at'>): WikiCategory {
    const db = this.getDatabase();
    const newCategory: WikiCategory = {
      ...category,
      id: db.wiki_categories.length > 0 ? Math.max(...db.wiki_categories.map((c: WikiCategory) => c.id)) + 1 : 1,
      created_at: new Date().toISOString()
    };
    db.wiki_categories.push(newCategory);
    this.saveDatabase(db);
    return newCategory;
  }

  // Wiki Pages
  getWikiPages(): WikiPage[] {
    return this.getDatabase().wiki_pages;
  }

  addWikiPage(page: Omit<WikiPage, 'id' | 'created_at' | 'updated_at'>): WikiPage {
    const db = this.getDatabase();
    const now = new Date().toISOString();
    const newPage: WikiPage = {
      ...page,
      id: db.wiki_pages.length > 0 ? Math.max(...db.wiki_pages.map((p: WikiPage) => p.id)) + 1 : 1,
      created_at: now,
      updated_at: now
    };
    db.wiki_pages.push(newPage);
    this.saveDatabase(db);
    return newPage;
  }

  updateWikiPage(id: number, updates: Partial<WikiPage>): WikiPage | null {
    const db = this.getDatabase();
    const index = db.wiki_pages.findIndex((p: WikiPage) => p.id === id);
    if (index === -1) return null;
    db.wiki_pages[index] = { ...db.wiki_pages[index], ...updates, updated_at: new Date().toISOString() };
    this.saveDatabase(db);
    return db.wiki_pages[index];
  }

  deleteWikiPage(id: number): boolean {
    const db = this.getDatabase();
    const index = db.wiki_pages.findIndex((p: WikiPage) => p.id === id);
    if (index === -1) return false;
    db.wiki_pages.splice(index, 1);
    this.saveDatabase(db);
    return true;
  }

  // Chat Rooms
  getChatRooms(): ChatRoom[] {
    return this.getDatabase().chat_rooms;
  }

  addChatRoom(room: Omit<ChatRoom, 'created_at'>): ChatRoom {
    const db = this.getDatabase();
    const newRoom: ChatRoom = {
      ...room,
      created_at: new Date().toISOString()
    };
    db.chat_rooms.push(newRoom);
    this.saveDatabase(db);
    return newRoom;
  }

  // Chat Messages
  getChatMessages(roomId?: string): ChatMessage[] {
    const messages = this.getDatabase().chat_messages;
    if (roomId) {
      return messages.filter((m: ChatMessage) => m.chat_room_id === roomId);
    }
    return messages;
  }

  addChatMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
    const db = this.getDatabase();
    const newMessage: ChatMessage = {
      ...message,
      id: db.chat_messages.length > 0 ? Math.max(...db.chat_messages.map((m: ChatMessage) => m.id)) + 1 : 1,
      timestamp: new Date().toISOString()
    };
    db.chat_messages.push(newMessage);
    this.saveDatabase(db);
    return newMessage;
  }

  // Roadmap Items
  getRoadmapItems(): RoadmapItem[] {
    return this.getDatabase().roadmap_items;
  }

  addRoadmapItem(item: Omit<RoadmapItem, 'id' | 'created_at' | 'updated_at'>): RoadmapItem {
    const db = this.getDatabase();
    const now = new Date().toISOString();
    const newItem: RoadmapItem = {
      ...item,
      id: db.roadmap_items.length > 0 ? Math.max(...db.roadmap_items.map((i: RoadmapItem) => i.id)) + 1 : 1,
      created_at: now,
      updated_at: now
    };
    db.roadmap_items.push(newItem);
    this.saveDatabase(db);
    return newItem;
  }

  updateRoadmapItem(id: number, updates: Partial<RoadmapItem>): RoadmapItem | null {
    const db = this.getDatabase();
    const index = db.roadmap_items.findIndex((i: RoadmapItem) => i.id === id);
    if (index === -1) return null;
    db.roadmap_items[index] = { ...db.roadmap_items[index], ...updates, updated_at: new Date().toISOString() };
    this.saveDatabase(db);
    return db.roadmap_items[index];
  }

  // Music Tracks
  getMusicTracks(): MusicTrack[] {
    return this.getDatabase().music_tracks;
  }

  addMusicTrack(track: Omit<MusicTrack, 'created_at'>): MusicTrack {
    const db = this.getDatabase();
    const newTrack: MusicTrack = {
      ...track,
      created_at: new Date().toISOString()
    };
    db.music_tracks.push(newTrack);
    this.saveDatabase(db);
    return newTrack;
  }

  deleteMusicTrack(id: string): boolean {
    const db = this.getDatabase();
    const index = db.music_tracks.findIndex((t: MusicTrack) => t.id === id);
    if (index === -1) return false;
    db.music_tracks.splice(index, 1);
    this.saveDatabase(db);
    return true;
  }

  // Site Config
  getSiteConfig(key?: string): SiteConfigItem | SiteConfigItem[] | null {
    const config = this.getDatabase().site_config;
    if (key) {
      return config.find((c: SiteConfigItem) => c.config_key === key) || null;
    }
    return config;
  }

  setSiteConfig(key: string, value: any): SiteConfigItem {
    const db = this.getDatabase();
    const index = db.site_config.findIndex((c: SiteConfigItem) => c.config_key === key);
    const now = new Date().toISOString();
    
    if (index !== -1) {
      db.site_config[index] = {
        ...db.site_config[index],
        config_value: value,
        updated_at: now
      };
      this.saveDatabase(db);
      return db.site_config[index];
    } else {
      const newConfig: SiteConfigItem = {
        id: db.site_config.length > 0 ? Math.max(...db.site_config.map((c: SiteConfigItem) => c.id)) + 1 : 1,
        config_key: key,
        config_value: value,
        updated_at: now
      };
      db.site_config.push(newConfig);
      this.saveDatabase(db);
      return newConfig;
    }
  }

  // Hero Content
  getHeroContent(): HeroContent | null {
    const hero = this.getDatabase().hero_content;
    return hero.length > 0 ? hero[0] : null;
  }

  updateHeroContent(updates: Partial<HeroContent>): HeroContent {
    const db = this.getDatabase();
    if (db.hero_content.length === 0) {
      const newHero: HeroContent = {
        id: 1,
        ...updates,
        updated_at: new Date().toISOString()
      };
      db.hero_content.push(newHero);
      this.saveDatabase(db);
      return newHero;
    }
    db.hero_content[0] = { ...db.hero_content[0], ...updates, updated_at: new Date().toISOString() };
    this.saveDatabase(db);
    return db.hero_content[0];
  }

  // Custom Tabs
  getCustomTabs(location?: 'header' | 'sidebar'): CustomTab[] {
    const tabs = this.getDatabase().custom_tabs;
    if (location) {
      return tabs.filter((t: CustomTab) => t.location === location);
    }
    return tabs;
  }

  addCustomTab(tab: Omit<CustomTab, 'created_at'>): CustomTab {
    const db = this.getDatabase();
    const newTab: CustomTab = {
      ...tab,
      created_at: new Date().toISOString()
    };
    db.custom_tabs.push(newTab);
    this.saveDatabase(db);
    return newTab;
  }

  deleteCustomTab(id: string): boolean {
    const db = this.getDatabase();
    const index = db.custom_tabs.findIndex((t: CustomTab) => t.id === id);
    if (index === -1) return false;
    db.custom_tabs.splice(index, 1);
    this.saveDatabase(db);
    return true;
  }

  // Page Elements
  getPageElements(section?: string): PageElement[] {
    const elements = this.getDatabase().page_elements;
    if (section) {
      return elements.filter((e: PageElement) => e.section === section);
    }
    return elements;
  }

  addPageElement(element: Omit<PageElement, 'created_at' | 'updated_at'>): PageElement {
    const db = this.getDatabase();
    const now = new Date().toISOString();
    const newElement: PageElement = {
      ...element,
      created_at: now,
      updated_at: now
    };
    db.page_elements.push(newElement);
    this.saveDatabase(db);
    return newElement;
  }

  updatePageElement(id: string, updates: Partial<PageElement>): PageElement | null {
    const db = this.getDatabase();
    const index = db.page_elements.findIndex((e: PageElement) => e.id === id);
    if (index === -1) return null;
    db.page_elements[index] = { ...db.page_elements[index], ...updates, updated_at: new Date().toISOString() };
    this.saveDatabase(db);
    return db.page_elements[index];
  }

  deletePageElement(id: string): boolean {
    const db = this.getDatabase();
    const index = db.page_elements.findIndex((e: PageElement) => e.id === id);
    if (index === -1) return false;
    db.page_elements.splice(index, 1);
    this.saveDatabase(db);
    return true;
  }

  // Page Backgrounds
  getPageBackgrounds(section?: string): PageBackground | PageBackground[] | null {
    const backgrounds = this.getDatabase().page_backgrounds;
    if (section) {
      return backgrounds.find((b: PageBackground) => b.section === section) || null;
    }
    return backgrounds;
  }

  setPageBackground(section: string, data: Omit<PageBackground, 'id' | 'section' | 'created_at' | 'updated_at'>): PageBackground {
    const db = this.getDatabase();
    const index = db.page_backgrounds.findIndex((b: PageBackground) => b.section === section);
    const now = new Date().toISOString();
    
    if (index !== -1) {
      db.page_backgrounds[index] = {
        ...db.page_backgrounds[index],
        ...data,
        updated_at: now
      };
      this.saveDatabase(db);
      return db.page_backgrounds[index];
    } else {
      const newBackground: PageBackground = {
        id: db.page_backgrounds.length > 0 ? Math.max(...db.page_backgrounds.map((b: PageBackground) => b.id)) + 1 : 1,
        section,
        ...data,
        created_at: now,
        updated_at: now
      };
      db.page_backgrounds.push(newBackground);
      this.saveDatabase(db);
      return newBackground;
    }
  }

  // Экспорт/Импорт базы данных
  exportDatabase(): string {
    return JSON.stringify(this.getDatabase(), null, 2);
  }

  importDatabase(data: string): boolean {
    try {
      const db = JSON.parse(data);
      this.saveDatabase(db);
      return true;
    } catch (error) {
      console.error('Failed to import database:', error);
      return false;
    }
  }

  // Восстановление из резервной копии
  restoreFromBackup(): boolean {
    const backup = localStorage.getItem(`${this.storageKey}_backup`);
    if (!backup) return false;
    try {
      const { data } = JSON.parse(backup);
      this.saveDatabase(data);
      return true;
    } catch (error) {
      console.error('Failed to restore from backup:', error);
      return false;
    }
  }

  // Очистка базы данных
  clearDatabase(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(`${this.storageKey}_backup`);
    this.initializeDatabase();
  }
}

// Экспорт единственного экземпляра
export const db = new LocalDatabase();
