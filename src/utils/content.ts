import { getCollection, type CollectionEntry } from 'astro:content';

export type Entry = CollectionEntry<'posts'>;
export const kinds = { writing: '文章', project: '项目', note: '随记' } as const;
export const href = (entry: Entry) => `/posts/${entry.id}/`;
export const dateLabel = (date: Date) => date.toISOString().slice(0, 10).replaceAll('-', '.');
export async function entries() {
  return (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf() || a.id.localeCompare(b.id));
}
