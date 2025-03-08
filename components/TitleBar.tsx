import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { X, Minus, Settings, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TitleBarProps {
  onSettingsClick: () => void;
}

export function TitleBar({ onSettingsClick }: TitleBarProps) {
  const { theme, setTheme } = useTheme();
  const [isPinned, setIsPinned] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMinimize = () => {
    if (typeof window !== 'undefined' && window.electron) {
      window.electron.minimizeApp();
    }
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && window.electron) {
      window.electron.closeApp();
    }
  };

  const togglePin = async () => {
    if (typeof window !== 'undefined' && window.electron) {
      const newPinState = await window.electron.toggleAlwaysOnTop();
      setIsPinned(newPinState);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="draggable flex items-center justify-between p-2 bg-background/80 border-b">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-semibold">Life Timeline</span>
      </div>
      <div className="flex items-center space-x-1 non-draggable">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onSettingsClick}
          title="Settings"
        >
          <Settings size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={togglePin}
          title={isPinned ? "Unpin from top" : "Pin to top"}
        >
          <Pin size={16} className={isPinned ? "text-primary" : ""} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleMinimize}
          title="Minimize"
        >
          <Minus size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleClose}
          title="Close"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
} 