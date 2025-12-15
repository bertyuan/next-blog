import { getPublishedPosts } from '@/lib/payload-posts';
import { createSearchAPI } from 'fumadocs-core/search/server';

// 动态生成搜索索引
export async function GET(request: Request) {
  const { posts } = await getPublishedPosts({ limit: 1000 });

  const indexes = posts.map((post) => ({
    title: post.title,
    description: post.description,
    id: post.url,
    url: post.url,
  }));

  const searchAPI = createSearchAPI('advanced', {
    indexes,
  });

  return searchAPI.GET(request);
}
