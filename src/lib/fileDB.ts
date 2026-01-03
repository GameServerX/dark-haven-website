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

interface StorageFile {
  version: number;
  lastModified: string;
  data: DBSchema;
}

const DB_PATH = '/db/storage.json';
const DB_VERSION = 1;

class FileDatabase {
  private data: DBSchema;
  private isLoaded: boolean = false;

  constructor() {
    this.data = this.getDefaultData();
    this.loadFromFile();
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

  private async loadFromFile(): Promise<void> {
    try {
      const response = await fetch(DB_PATH);
      if (!response.ok) {
        console.error('Database file not found, using defaults');
        this.isLoaded = true;
        return;
      }

      const stored: StorageFile = await response.json();
      
      if (stored.version !== DB_VERSION) {
        console.log('Database version mismatch, migrating...');
        this.data = this.migrate(stored.data);
      } else {
        this.data = stored.data || this.getDefaultData();
      }

      this.isLoaded = true;
    } catch (error) {
      console.error('Error loading database from file:', error);
      this.data = this.getDefaultData();
      this.isLoaded = true;
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

    return newData;
  }

  private async saveToFile(): Promise<void> {
    try {
      const toStore: StorageFile = {
        version: DB_VERSION,
        data: this.data,
        lastModified: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(toStore, null, 2)], { 
        type: 'application/json' 
      });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'storage.json';
      
      console.log('Database saved locally. Download triggered for backup.');
      
      localStorage.setItem('darkHavenDB_backup', JSON.stringify(toStore));
      
    } catch (error) {
      console.error('Error saving database to file:', error);
    }
  }

  private async waitForLoad(): Promise<void> {
    if (this.isLoaded) return;
    
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.isLoaded) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  }

  async getUser(): Promise<User | null> {
    await this.waitForLoad();
    return this.data.user;
  }

  async setUser(user: User | null): Promise<void> {
    await this.waitForLoad();
    this.data.user = user;
    await this.saveToFile();
  }

  async getElements(page?: string): Promise<Record<string, PageElement[]> | PageElement[]> {
    await this.waitForLoad();
    if (page) {
      return this.data.elements[page] || [];
    }
    return this.data.elements;
  }

  async setElements(page: string, elements: PageElement[]): Promise<void> {
    await this.waitForLoad();
    this.data.elements[page] = elements;
    await this.saveToFile();
  }

  async updateAllElements(elements: Record<string, PageElement[]>): Promise<void> {
    await this.waitForLoad();
    this.data.elements = elements;
    await this.saveToFile();
  }

  async getCustomTabs(): Promise<CustomTab[]> {
    await this.waitForLoad();
    return this.data.customTabs;
  }

  async setCustomTabs(tabs: CustomTab[]): Promise<void> {
    await this.waitForLoad();
    this.data.customTabs = tabs;
    await this.saveToFile();
  }

  async getSidebarTabs(): Promise<CustomTab[]> {
    await this.waitForLoad();
    return this.data.sidebarTabs;
  }

  async setSidebarTabs(tabs: CustomTab[]): Promise<void> {
    await this.waitForLoad();
    this.data.sidebarTabs = tabs;
    await this.saveToFile();
  }

  async getPageHeights(): Promise<Record<string, number>> {
    await this.waitForLoad();
    return this.data.pageHeights;
  }

  async setPageHeight(page: string, height: number): Promise<void> {
    await this.waitForLoad();
    this.data.pageHeights[page] = height;
    await this.saveToFile();
  }

  async updateAllPageHeights(heights: Record<string, number>): Promise<void> {
    await this.waitForLoad();
    this.data.pageHeights = heights;
    await this.saveToFile();
  }

  async getHeroData() {
    await this.waitForLoad();
    return this.data.heroData;
  }

  async setHeroData(heroData: Partial<DBSchema['heroData']>): Promise<void> {
    await this.waitForLoad();
    this.data.heroData = { ...this.data.heroData, ...heroData };
    await this.saveToFile();
  }

  async exportData(): Promise<string> {
    await this.waitForLoad();
    return JSON.stringify({
      version: DB_VERSION,
      data: this.data,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  async downloadBackup(): Promise<void> {
    const jsonString = await this.exportData();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `darkhaven-backup-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async importData(jsonString: string): Promise<boolean> {
    try {
      const imported = JSON.parse(jsonString);
      if (imported.data) {
        this.data = imported.data;
        await this.saveToFile();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing database:', error);
      return false;
    }
  }

  async clearAll(): Promise<void> {
    this.data = this.getDefaultData();
    await this.saveToFile();
  }

  getCurrentData(): DBSchema {
    return this.data;
  }
}

export const fileDB = new FileDatabase();
