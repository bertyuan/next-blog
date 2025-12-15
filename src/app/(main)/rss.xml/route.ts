import { description, title } from '@/app/(main)/layout.config';
import { owner } from '@/app/(main)/layout.config';
import { baseUrl } from '@/lib/constants';
import { getPublishedPosts } from '@/lib/payload-posts';
import { Feed } from 'feed';

export const dynamic = 'force-dynamic';

const escapeForXML = (str: string) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export const GET = async () => {
  const feed = await createFeed();

  return new Response(feed.atom1(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};

async function createFeed(): Promise<Feed> {
  const feed = new Feed({
    title,
    description,
    id: baseUrl.href,
    language: 'en',
    copyright: `All rights reserved ${new Date().getFullYear()}, ${owner}`,
    image: new URL('/banner.png', baseUrl).href,
    favicon: new URL('/favicon.ico', baseUrl).href,
    link: baseUrl.href,
    feed: new URL('/api/rss.xml', baseUrl).href,
    updated: new Date(),
  });

  const { posts } = await getPublishedPosts({ limit: 1000 });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      description: post.description,
      link: new URL(post.url, baseUrl).href,
      image: post.image
        ? {
            title: post.title,
            type: 'image/png',
            url: escapeForXML(new URL(post.image, baseUrl.href).href),
          }
        : undefined,
      date: post.date,
      author: [
        {
          name: post.author,
        },
      ],
    });
  }

  return feed;
}
