export const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('zh-CN') : '';
export const formatDateTime = (d: string) => d ? new Date(d).toLocaleString('zh-CN') : '';
