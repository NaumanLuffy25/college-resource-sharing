import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function getFileIcon(fileType: string): string {
  if (fileType.includes('pdf')) return 'file-text';
  if (fileType.includes('word') || fileType.includes('docx')) return 'file-text';
  if (fileType.includes('presentation') || fileType.includes('pptx')) return 'presentation';
  if (fileType.includes('zip')) return 'archive';
  if (fileType.includes('image')) return 'image';
  return 'file';
}

export function getResourceTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    notes: 'Notes',
    lab: 'Lab Files',
    assignment: 'Assignments',
    question_paper: 'Question Papers',
    project_report: 'Project Reports',
    study_material: 'Study Materials',
    presentation: 'Presentations',
    mini_project: 'Mini Projects',
  };
  return labels[type] || type;
}

export function getDepartmentColor(dept: string): string {
  const colors: Record<string, string> = {
    'Computer Science': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Information Technology': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'Electronics': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    'Electrical': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Mechanical': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Civil': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  };
  return colors[dept] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
}
