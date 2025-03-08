import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Window controls
  minimizeApp: () => ipcRenderer.invoke('minimize-app'),
  toggleAlwaysOnTop: () => ipcRenderer.invoke('toggle-always-on-top'),
  closeApp: () => ipcRenderer.invoke('close-app'),
  setOpacity: (opacity: number) => ipcRenderer.invoke('set-opacity', opacity),
  
  // Notifications
  showNotification: (options: { title: string; body: string }) => 
    ipcRenderer.invoke('show-notification', options),
    
  // Data storage
  storeData: (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  
  getData: (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  
  // System info
  platform: process.platform,
}); 