import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date for display
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(dateObj);
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: string | Date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }

  return formatDate(dateObj);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitFor: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

// Sleep utility
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Get agent icon based on name/type
export function getAgentIcon(name: string): string {
  const n = (name || '').toLowerCase();
  if (n.includes('content') || n.includes('writer')) return '✍️';
  if (n.includes('support') || n.includes('bot')) return '🤖';
  if (n.includes('data') || n.includes('analysis')) return '📊';
  if (n.includes('code') || n.includes('review')) return '🔍';
  if (n.includes('image') || n.includes('vision')) return '🎨';
  if (n.includes('voice') || n.includes('speech')) return '🎤';
  if (n.includes('translate') || n.includes('language')) return '🌐';
  return '🤖';
}

// Get vendor color gradient
export function getVendorColor(vendor: string): string {
  const colors: Record<string, string> = {
    OpenAI: 'from-emerald-500 to-teal-500',
    Anthropic: 'from-amber-500 to-orange-500',
    Google: 'from-sky-500 to-cyan-500',
    Internal: 'from-fuchsia-500 to-violet-500',
    GitHub: 'from-slate-600 to-zinc-600',
    SonarQube: 'from-indigo-500 to-purple-500',
    Grammarly: 'from-emerald-600 to-green-600',
    SEMrush: 'from-orange-600 to-red-500',
    Pandas: 'from-blue-600 to-indigo-500',
    NumPy: 'from-cyan-500 to-blue-500',
    SciPy: 'from-purple-600 to-pink-500',
    'Scikit-learn': 'from-yellow-500 to-orange-500',
    Plotly: 'from-pink-500 to-rose-500',
    ESLint: 'from-yellow-600 to-amber-600',
    Snyk: 'from-rose-500 to-red-500',
  };
  
  return colors[vendor] || 'from-zinc-600 to-slate-600';
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

// Download data as JSON file
export function downloadJSON(data: any, filename: string): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.json') ? filename : `${filename}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
