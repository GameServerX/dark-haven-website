import { PageElement, CustomTab } from '@/types/editor';

interface User {
  username: string;
  isAdmin: boolean;
}

interface DBSchema {
  user: User | null;
  elements: Record<string, PageElement[]>;
  customTabs: CustomTab[];
  sidebarTabs: CustomTab[];
  pageHeights: Record<string, number>;
  heroData: {
    title: string;
    subtitle: string;
    backgroundImage?: string;
    logoUrl?: string;
  };
}

const DB_KEY = 'darkHavenDB';
const DB_VERSION = 1;

class LocalDatabase {
  private data: DBSchema;

  constructor() {
    this.data = this.loadFromStorage();
  }

  private getDefaultData(): DBSchema {
    return {
      user: null,
      elements: {},
      customTabs: [],
      sidebarTabs: [],
      pageHeights: {},
      heroData: {
        title: 'DARK HAVEN',
        subtitle: 'Исследуй космос музыки',
      }
    };
  }

  private loadFromStorage(): DBSchema {
    try {
      const stored = localStorage.getItem(DB_KEY);
      if (!stored) {
        return this.getDefaultData();
      }

      const parsed = JSON.parse(stored);
      
      if (parsed.version !== DB_VERSION) {
        console.log('Database version mismatch, migrating...');
        return this.migrate(parsed);
      }

      return parsed.data || this.getDefaultData();
    } catch (error) {
      console.error('Error loading database:', error);
      return this.getDefaultData();
    }
  }

  private migrate(oldData: any): DBSchema {
    const newData = this.getDefaultData();
    
    if (oldData.user) newData.user = oldData.user;
    if (oldData.elements) newData.elements = oldData.elements;
    if (oldData.customTabs) newData.customTabs = oldData.customTabs;
    if (oldData.sidebarTabs) newData.sidebarTabs = oldData.sidebarTabs;
    if (oldData.pageHeights) newData.pageHeights = oldData.pageHeights;
    if (oldData.heroData) newData.heroData = oldData.heroData;

    this.saveToStorage();
    return newData;
  }

  private saveToStorage(): void {
    try {
      const toStore = {
        version: DB_VERSION,
        data: this.data,
        lastModified: new Date().toISOString()
      };
      localStorage.setItem(DB_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  getUser(): User | null {
    return this.data.user;
  }

  setUser(user: User | null): void {
    this.data.user = user;
    this.saveToStorage();
  }

  getElements(page?: string): Record<string, PageElement[]> | PageElement[] {
    if (page) {
      return this.data.elements[page] || [];
    }
    return this.data.elements;
  }

  setElements(page: string, elements: PageElement[]): void {
    this.data.elements[page] = elements;
    this.saveToStorage();
  }

  updateAllElements(elements: Record<string, PageElement[]>): void {
    this.data.elements = elements;
    this.saveToStorage();
  }

  getCustomTabs(): CustomTab[] {
    return this.data.customTabs;
  }

  setCustomTabs(tabs: CustomTab[]): void {
    this.data.customTabs = tabs;
    this.saveToStorage();
  }

  getSidebarTabs(): CustomTab[] {
    return this.data.sidebarTabs;
  }

  setSidebarTabs(tabs: CustomTab[]): void {
    this.data.sidebarTabs = tabs;
    this.saveToStorage();
  }

  getPageHeights(): Record<string, number> {
    return this.data.pageHeights;
  }

  setPageHeight(page: string, height: number): void {
    this.data.pageHeights[page] = height;
    this.saveToStorage();
  }

  updateAllPageHeights(heights: Record<string, number>): void {
    this.data.pageHeights = heights;
    this.saveToStorage();
  }

  getHeroData() {
    return this.data.heroData;
  }

  setHeroData(heroData: Partial<DBSchema['heroData']>): void {
    this.data.heroData = { ...this.data.heroData, ...heroData };
    this.saveToStorage();
  }

  exportData(): string {
    return JSON.stringify({
      version: DB_VERSION,
      data: this.data,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  importData(jsonString: string): boolean {
    try {
      const imported = JSON.parse(jsonString);
      if (imported.data) {
        this.data = imported.data;
        this.saveToStorage();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing database:', error);
      return false;
    }
  }

  clearAll(): void {
    this.data = this.getDefaultData();
    this.saveToStorage();
  }
}

export const localDB = new LocalDatabase();
