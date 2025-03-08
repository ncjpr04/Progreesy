import { useState, useEffect } from 'react';
import { addDays, addWeeks, format, isSameDay, isAfter, isBefore, startOfWeek } from 'date-fns';
import { calculateLifeProgress } from '@/lib/utils';

interface LifeTimelineProps {
  lifeExpectancy: number;
  onDayClick: (date: Date) => void;
}

export function LifeTimeline({ lifeExpectancy, onDayClick }: LifeTimelineProps) {
  const [birthdate, setBirthdate] = useState<Date>(new Date(1990, 0, 1)); // Default birthdate
  const [todos, setTodos] = useState<any[]>([]);
  const [lifeProgress, setLifeProgress] = useState(0);
  const today = new Date();

  // Load birthdate and todos from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electron) {
      const savedBirthdate = window.electron.getData('birthdate');
      const savedTodos = window.electron.getData('todos');
      
      if (savedBirthdate) {
        setBirthdate(new Date(savedBirthdate));
      }
      
      if (savedTodos) {
        setTodos(savedTodos);
      }
    }
  }, []);

  // Calculate life progress
  useEffect(() => {
    setLifeProgress(calculateLifeProgress(birthdate, lifeExpectancy));
  }, [birthdate, lifeExpectancy]);

  // Generate timeline grid
  const generateTimelineGrid = () => {
    const grid = [];
    const weeksInYear = 52;
    const totalWeeks = lifeExpectancy * weeksInYear;
    const startDate = startOfWeek(birthdate);
    
    // Calculate how many weeks have passed since birth
    const weeksPassed = Math.floor((today.getTime() - birthdate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    for (let i = 0; i < totalWeeks; i++) {
      const weekDate = addWeeks(startDate, i);
      const week = [];
      
      for (let j = 0; j < 7; j++) {
        const day = addDays(weekDate, j);
        week.push(day);
      }
      
      grid.push(week);
    }
    
    return grid;
  };

  // Get color for a day based on todos and date
  const getDayColor = (date: Date) => {
    // Past days with no activity
    if (isBefore(date, today) && !isSameDay(date, today)) {
      // Check if there are todos for this day
      const dateStr = format(date, 'yyyy-MM-dd');
      const todosForDay = todos.filter(todo => todo.date === dateStr);
      
      if (todosForDay.length === 0) {
        return 'bg-timeline-empty';
      }
      
      const completedCount = todosForDay.filter(todo => todo.completed).length;
      const completionRate = completedCount / todosForDay.length;
      
      if (completionRate === 1) return 'bg-timeline-level4';
      if (completionRate >= 0.75) return 'bg-timeline-level3';
      if (completionRate >= 0.5) return 'bg-timeline-level2';
      if (completionRate > 0) return 'bg-timeline-level1';
      return 'bg-timeline-empty';
    }
    
    // Today
    if (isSameDay(date, today)) {
      return 'bg-timeline-today';
    }
    
    // Future days
    return 'bg-timeline-future';
  };

  const timelineGrid = generateTimelineGrid();

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Life Progress: {lifeProgress}%</div>
        <div className="text-sm text-muted-foreground">
          Age: {Math.floor((today.getTime() - birthdate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years
        </div>
      </div>
      
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary" 
          style={{ width: `${lifeProgress}%` }}
        />
      </div>
      
      <div className="overflow-auto max-h-[calc(100vh-150px)]">
        <div className="grid grid-cols-52 gap-1 p-1">
          {timelineGrid.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-sm cursor-pointer hover:scale-125 transition-transform ${getDayColor(day)}`}
                  onClick={() => onDayClick(day)}
                  title={format(day, 'PPP')}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 