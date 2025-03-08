import { useState } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  lifeExpectancy: number;
  setLifeExpectancy: (years: number) => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  opacity,
  setOpacity,
  lifeExpectancy,
  setLifeExpectancy,
}: SettingsDialogProps) {
  const [birthdate, setBirthdate] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.electron) {
      const saved = window.electron.getData('birthdate');
      return saved ? format(new Date(saved), 'yyyy-MM-dd') : format(new Date(1990, 0, 1), 'yyyy-MM-dd');
    }
    return format(new Date(1990, 0, 1), 'yyyy-MM-dd');
  });
  
  const [startOnBoot, setStartOnBoot] = useState(false);

  const handleSave = () => {
    if (typeof window !== 'undefined' && window.electron) {
      window.electron.storeData('birthdate', new Date(birthdate).toISOString());
      window.electron.storeData('opacity', opacity);
      window.electron.storeData('lifeExpectancy', lifeExpectancy);
      // In a real app, we would also save the startOnBoot preference to the system
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your life timeline widget settings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="birthdate" className="text-right">
              Birthdate
            </Label>
            <input
              id="birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="life-expectancy" className="text-right">
              Life Expectancy
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <input
                id="life-expectancy"
                type="range"
                min="50"
                max="120"
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(parseInt(e.target.value))}
                className="flex h-10 w-full"
              />
              <span className="w-12 text-center">{lifeExpectancy}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="opacity" className="text-right">
              Opacity
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <input
                id="opacity"
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="flex h-10 w-full"
              />
              <span className="w-12 text-center">{Math.round(opacity * 100)}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start-on-boot" className="text-right">
              Start on Boot
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                id="start-on-boot"
                checked={startOnBoot}
                onCheckedChange={setStartOnBoot}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 