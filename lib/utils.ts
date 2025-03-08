import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calculate age from birthdate
export function calculateAge(birthdate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const m = today.getMonth() - birthdate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  
  return age;
}

// Calculate life progress percentage
export function calculateLifeProgress(birthdate: Date, lifeExpectancy: number): number {
  const age = calculateAge(birthdate);
  return Math.min(100, Math.round((age / lifeExpectancy) * 100));
}

// Format date as YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get activity level for a day (0-4)
export function getActivityLevel(date: Date, todos: any[]): number {
  const dateStr = formatDate(date);
  const todosForDay = todos.filter(todo => todo.date === dateStr);
  
  if (todosForDay.length === 0) return 0;
  
  const completedCount = todosForDay.filter(todo => todo.completed).length;
  const completionRate = completedCount / todosForDay.length;
  
  if (completionRate === 1) return 4;
  if (completionRate >= 0.75) return 3;
  if (completionRate >= 0.5) return 2;
  if (completionRate > 0) return 1;
  return 0;
} 