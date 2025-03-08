import { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { join } from 'path';

// Keep a global reference of the window object to avoid garbage collection
let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

// Minimum window dimensions
const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;

async function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: MIN_WIDTH,
    height: MIN_HEIGHT,
    x: width - MIN_WIDTH - 20, // Position on the right side of the screen
    y: height - MIN_HEIGHT - 20, // Position at the bottom of the screen
    frame: false, // Frameless window
    transparent: true, // Allow for rounded corners and transparency
    resizable: true,
    alwaysOnTop: true,
    skipTaskbar: true, // Don't show in taskbar
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
    },
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
  });

  // Load the app
  const url = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../.next/index.html')}`;

  await mainWindow.loadURL(url);

  // Open DevTools in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // Create tray icon
  createTray();

  // Make the window draggable from anywhere
  mainWindow.setMovable(true);
}

function createTray() {
  // Create a default icon for the tray
  const icon = nativeImage.createFromPath(
    path.join(__dirname, '../resources/icon.png')
  ).resize({ width: 16, height: 16 });

  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow?.show() },
    { label: 'Quit', click: () => app.quit() },
  ]);

  tray.setToolTip('Life Timeline Widget');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow?.show();
    }
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
  await createWindow();

  app.on('activate', async () => {
    // On macOS it's common to re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle IPC messages from renderer
ipcMain.handle('minimize-app', () => {
  mainWindow?.minimize();
});

ipcMain.handle('toggle-always-on-top', () => {
  if (mainWindow) {
    const isAlwaysOnTop = mainWindow.isAlwaysOnTop();
    mainWindow.setAlwaysOnTop(!isAlwaysOnTop);
    return !isAlwaysOnTop;
  }
  return false;
});

ipcMain.handle('close-app', () => {
  mainWindow?.hide();
});

ipcMain.handle('set-opacity', (_event, opacity: number) => {
  mainWindow?.setOpacity(opacity);
});

// Handle notifications
ipcMain.handle('show-notification', (_event, { title, body }: { title: string; body: string }) => {
  const notification = {
    title,
    body,
  };
  
  // Show native notification
  new Notification(notification).show();
}); 