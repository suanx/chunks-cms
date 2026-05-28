import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  // 简易 sitemap，实际应从 API 获取动态数据
  const baseUrl = 'https://chunyu-cms.com';
  const urls = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/video`, priority: '0.8', changefreq: 'daily' },
    { loc: `${baseUrl}/movie`, priority: '0.8', changefreq: 'daily' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`;

  event.node.res.setHeader('Content-Type', 'application/xml');
  return xml;
});
