import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { entries, href } from '../utils/content';
export async function GET(context: APIContext) {
  return rss({
    title: 'Joey — Open archive',
    description: '文章、项目与日常记录，持续整理中。',
    site: context.site!,
    items: (await entries()).map(entry => ({ title: entry.data.title, pubDate: entry.data.published, description: entry.data.description, link: href(entry), categories: entry.data.tags })),
    customData: '<language>zh-CN</language>',
  });
}
