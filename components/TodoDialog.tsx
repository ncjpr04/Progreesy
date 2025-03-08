import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, Trash, Bell, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  alarm?: {
    time: string;
    enabled: boolean;
  };
}

interface TodoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  showNotification: (title: string, body: string) => void;
}

export function TodoDialog({
  open,
  onOpenChange,
  date,
  showNotification,
}: TodoDialogProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const dateStr = format(date, 'yyyy-MM-dd');
  const formattedDate = format(date, 'EEEE, MMMM d, yyyy');
  const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;

  // Load todos from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electron) {
      const savedTodos = window.electron.getData('todos') || [];
      setTodos(savedTodos);
    }
  }, []);

  // Save todos to localStorage
  const saveTodos = (updatedTodos: Todo[]) => {
    if (typeof window !== 'undefined' && window.electron) {
      window.electron.storeData('todos', updatedTodos);
    }
  };

  // Filter todos for the selected date
  const todosForDay = todos.filter(todo => todo.date === dateStr);

  // Add a new todo
  const addTodo = () => {
    if (!newTodoText.trim()) return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTodoText,
      completed: false,
      date: dateStr,
    };
    
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    setNewTodoText('');
  };

  // Toggle todo completion
  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  // Delete a todo
  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  };

  // Set an alarm for a todo
  const setAlarm = (id: string, time: string) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { 
        ...todo, 
        alarm: { 
          time, 
          enabled: true 
        } 
      } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
    
    // If it's today, schedule the notification
    if (isToday) {
      const todo = todos.find(t => t.id === id);
      if (todo) {
        const alarmTime = new Date(`${dateStr}T${time}`);
        const now = new Date();
        
        if (alarmTime > now) {
          const timeUntilAlarm = alarmTime.getTime() - now.getTime();
          
          setTimeout(() => {
            showNotification('Todo Reminder', todo.text);
          }, timeUntilAlarm);
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{formattedDate}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              placeholder="Add a new todo..."
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button size="icon" onClick={addTodo}>
              <Plus size={16} />
            </Button>
          </div>
          
          <div className="space-y-2">
            {todosForDay.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No todos for this day. Add one above!
              </p>
            ) : (
              todosForDay.map(todo => (
                <div 
                  key={todo.id} 
                  className="flex items-center justify-between p-2 rounded-md border"
                >
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                        todo.completed ? 'bg-primary text-primary-foreground' : 'bg-background'
                      }`}
                    >
                      {todo.completed && <Check size={14} />}
                    </button>
                    <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                      {todo.text}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isToday && (
                      <div className="flex items-center space-x-1">
                        <input
                          type="time"
                          value={todo.alarm?.time || ''}
                          onChange={(e) => setAlarm(todo.id, e.target.value)}
                          className="h-8 w-24 rounded-md border border-input bg-background px-2 text-xs"
                        />
                        <Bell 
                          size={16} 
                          className={todo.alarm?.enabled ? 'text-primary' : 'text-muted-foreground'}
                        />
                      </div>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 