interface ElectronAPI {
  minimizeApp: () => Promise<void>;
  toggleAlwaysOnTop: () => Promise<boolean>;
  closeApp: () => Promise<void>;
  setOpacity: (opacity: number) => Promise<void>;
  showNotification: (options: { title: string; body: string }) => Promise<void>;
  storeData: (key: string, data: any) => void;
  getData: (key: string) => any;
  platform: string;
}

interface Window {
  electron: ElectronAPI;
} 