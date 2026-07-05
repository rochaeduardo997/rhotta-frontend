import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMatchLevelColorClass(
  value: number,
  options?: {
    hasTransparence?: boolean;
    border?: boolean;
    text?: boolean;
    background?: boolean;
  }
): string {
  const hasTransparence = options?.hasTransparence;
  const border = options?.border;
  const text = options?.text;
  const background = options?.background;

  const classes: string[] = [];

  if (value >= 76) {
    if (background) classes.push(hasTransparence ? 'bg-success/10' : 'bg-success');
    if (border) classes.push('border-success/30');
    if (text) classes.push('text-success');
  } else if (value >= 51 && value <= 75) {
    if (background) classes.push(hasTransparence ? 'bg-blue-500/10' : 'bg-blue-500');
    if (border) classes.push('border-blue-500/30');
    if (text) classes.push('text-blue-500');
  } else if (value >= 26 && value <= 50) {
    if (background) classes.push(hasTransparence ? 'bg-warning/10' : 'bg-warning');
    if (border) classes.push('border-warning/30');
    if (text) classes.push('text-warning');
  } else {
    if (background) classes.push(hasTransparence ? 'bg-danger/10' : 'bg-danger');
    if (border) classes.push('border-danger/30');
    if (text) classes.push('text-danger');
  }

  return classes.join(' ');
}
