import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@/../payload-types'

// Payload 文章类型
export interface PayloadPost {
  id: number
  title: string
  slug: string
  description?: string
  content: unknown // Lexical 富文本内容
  featuredImage?: Media | number
  author?: string
  tags?: { tag: string; id?: string }[]
  status: 'draft' | 'published'
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

// 转换后的文章类型（用于前端展示）
export interface BlogPost {
  id: number
  title: string
  slug: string
  url: string
  description: string
  content: unknown
  image?: string
  author: string
  tags: string[]
  date: Date
  createdAt: Date
  updatedAt: Date
}

// 获取 Payload 实例
async function getPayloadClient() {
  return getPayload({ config })
}

// 将 Payload 文章转换为博客文章格式
function transformPost(post: PayloadPost): BlogPost {
  // 处理封面图片 URL
  let imageUrl: string | undefined
  if (post.featuredImage && typeof post.featuredImage === 'object') {
    imageUrl = post.featuredImage.url || undefined
  }

  // 处理标签数组
  const tags = post.tags?.map((t) => t.tag).filter(Boolean) || []

  // 处理日期
  const date = post.publishedAt ? new Date(post.publishedAt) : new Date(post.createdAt)

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    url: `/posts/${post.slug}`,
    description: post.description || '',
    content: post.content,
    image: imageUrl,
    author: post.author || 'Admin',
    tags,
    date,
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
  }
}

// 获取所有已发布的文章（按发布时间排序）
export async function getPublishedPosts(options?: {
  limit?: number
  page?: number
}): Promise<{ posts: BlogPost[]; totalDocs: number; totalPages: number }> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
    },
    sort: '-publishedAt',
    limit: options?.limit || 10,
    page: options?.page || 1,
    depth: 1, // 获取关联的 media 数据
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      content: true,
      featuredImage: true,
      author: true,
      tags: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return {
    posts: result.docs.map((doc) => transformPost(doc as unknown as PayloadPost)),
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
  }
}

// 根据 slug 获取单篇文章
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
    depth: 1,
  })

  if (result.docs.length === 0) {
    return null
  }

  return transformPost(result.docs[0] as unknown as PayloadPost)
}

// 获取所有已发布文章的 slug（用于静态生成）
export async function getAllPostSlugs(): Promise<string[]> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
    },
    limit: 1000,
    depth: 0,
    select: {
      slug: true,
    },
  })

  return result.docs.map((doc) => (doc as unknown as PayloadPost).slug)
}

// 根据标签获取文章
export async function getPostsByTag(
  tag: string,
  options?: { limit?: number; page?: number }
): Promise<{ posts: BlogPost[]; totalDocs: number; totalPages: number }> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { status: { equals: 'published' } },
        { 'tags.tag': { equals: tag } },
      ],
    },
    sort: '-publishedAt',
    limit: options?.limit || 10,
    page: options?.page || 1,
    depth: 1,
  })

  return {
    posts: result.docs.map((doc) => transformPost(doc as unknown as PayloadPost)),
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
  }
}

// 获取所有标签
export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
    },
    limit: 1000,
    depth: 0,
  })

  // 统计标签
  const tagCounts = new Map<string, number>()

  for (const doc of result.docs) {
    const post = doc as unknown as PayloadPost
    if (post.tags) {
      for (const { tag } of post.tags) {
        if (tag) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
        }
      }
    }
  }

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}
