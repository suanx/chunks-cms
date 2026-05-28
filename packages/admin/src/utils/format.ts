import dayjs from 'dayjs';

export const formatDate = (d: string) => d ? dayjs(d).format('YYYY-MM-DD') : '';
export const formatDateTime = (d: string) => d ? dayjs(d).format('YYYY-MM-DD HH:mm:ss') : '';
export const formatFileSize = (bytes: number) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
};
export const formatNumber = (n: number) => {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
};
