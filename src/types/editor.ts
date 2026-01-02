export interface PageElement {
  id: string;
  type: 'text' | 'button' | 'image' | 'video';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  styles: {
    backgroundColor?: string;
    textColor?: string;
    fontSize?: number;
    fontWeight?: string;
    borderRadius?: number;
    padding?: number;
    glowColor?: string;
    glowIntensity?: number;
    animation?: string;
    backgroundImage?: string;
  };
  link?: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface CustomTab {
  id: string;
  name: string;
  icon: string;
  elements: PageElement[];
  isCustom: boolean;
}

export interface SiteConfig {
  tabs: CustomTab[];
  backgroundType: 'static' | 'animated' | 'video';
  backgroundUrl: string;
  sidebarTabs: CustomTab[];
}
