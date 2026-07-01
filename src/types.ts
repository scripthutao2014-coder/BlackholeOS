export type AppID = 'browser' | 'chatapp' | 'files' | 'settings' | 'security' | 'welcome' | 'calculator' | 'optimisme' | 'supportphone' | 'camera' | 'store';

export interface WindowInstance {
  id: string;
  appId: AppID;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type FileType = 'file' | 'directory';

export interface FileNode {
  name: string;
  type: FileType;
  path: string; // Absolute path, e.g., '/home/documents/notes.txt'
  content?: string; // Text content for files
  icon?: string; // Optional custom lucide icon override
}

export type FileSystem = Record<string, FileNode>;

export interface Wallpaper {
  id: string;
  name: string;
  type: 'gradient' | 'canvas' | 'solid';
  value: string;
  previewClass: string;
}

export type AccentColor = 'blue' | 'green' | 'white';

export interface SystemSettings {
  accentColor: AccentColor;
  wallpaperId: string;
  rememberLogin: boolean;
  disableAnimations?: boolean;
  clockFormat24h?: boolean;
  dockAlignment?: 'center' | 'left';
  themeStyle?: 'glass' | 'solid' | 'retro-terminal';
  customWallpaperUrl?: string;
  customWallpaperColor?: string;
}

export interface UserSession {
  username: string;
  isLoggedIn: boolean;
  avatarSeed: string;
}
