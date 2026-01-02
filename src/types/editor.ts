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
    hoverAnimation?: string;
    hoverScale?: number;
    hoverGlow?: boolean;
    hoverColor?: string;
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

export interface PageBackground {
  type: 'static' | 'animated' | 'video' | 'parallax';
  url?: string;
  parallaxSpeed?: number;
}

export interface SiteConfig {
  tabs: CustomTab[];
  backgroundType: 'static' | 'animated' | 'video';
  backgroundUrl: string;
  sidebarTabs: CustomTab[];
  pageBackgrounds: Record<string, PageBackground>;
}

export interface MusicTrack {
  id: string;
  title: string;
  url: string;
}