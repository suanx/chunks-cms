/** 简单的 XSS 过滤 — 去除 HTML 标签和危险字符 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}
