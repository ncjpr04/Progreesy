import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useTheme } from 'next-themes';
import { LifeTimeline } from '@/components/LifeTimeline';
import { TitleBar } from '@/components/TitleBar';
import { SettingsDialog } from '@/components/SettingsDialog';
import { TodoDialog } from '@/components/TodoDialog';
import { useToast } from '@/components/ui/use-toast';

export default function Home() {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTodoOpen, setIsTodoOpen] = useState(false);
  const [opacity, setOpacity] = useState(0.9);
  const [lifeExpectancy, setLifeExpectancy] = useState(80);
  const [mounted, setMounted] = useState(false);

  // Set opacity of the window
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electron) {
      window.electron.setOpacity(opacity);
    }
  }, [opacity]);

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electron) {
      const savedOpacity = window.electron.getData('opacity');
      const savedLifeExpectancy = window.electron.getData('lifeExpectancy');
      
      if (savedOpacity) setOpacity(savedOpacity);
      if (savedLifeExpectancy) setLifeExpectancy(savedLifeExpectancy);
    }
    setMounted(true);
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    if (mounted && typeof window !== 'undefined' && window.electron) {
      window.electron.storeData('opacity', opacity);
      window.electron.storeData('lifeExpectancy', lifeExpectancy);
    }
  }, [opacity, lifeExpectancy, mounted]);

  // Handle day click
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsTodoOpen(true);
  };

  // Show notification
  const showNotification = (title: string, body: string) => {
    if (typeof window !== 'undefined' && window.electron) {
      window.electron.showNotification({ title, body });
      toast({
        title,
        description: body,
      });
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Life Timeline Widget</title>
        <meta name="description" content="Visualize your life timeline with todos and alarms" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`flex flex-col h-screen rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-background/90' : 'bg-background/90'}`}>
        <TitleBar onSettingsClick={() => setIsSettingsOpen(true)} />
        
        <main className="flex-1 p-4 overflow-auto">
          <LifeTimeline 
            lifeExpectancy={lifeExpectancy} 
            onDayClick={handleDayClick} 
          />
        </main>
      </div>

      <SettingsDialog 
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        opacity={opacity}
        setOpacity={setOpacity}
        lifeExpectancy={lifeExpectancy}
        setLifeExpectancy={setLifeExpectancy}
      />

      {selectedDate && (
        <TodoDialog
          open={isTodoOpen}
          onOpenChange={setIsTodoOpen}
          date={selectedDate}
          showNotification={showNotification}
        />
      )}
    </>
  );
} 