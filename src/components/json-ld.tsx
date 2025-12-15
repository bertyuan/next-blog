import { title as homeTitle } from '@/app/(main)/layout.config';
import { owner } from '@/app/(main)/layout.config';
import { baseUrl } from '@/lib/constants';
import type { BlogPost } from '@/lib/payload-posts';
import type { BlogPosting, BreadcrumbList, Graph } from 'schema-dts';

export const PostJsonLd = ({ post }: { post: BlogPost }) => {
  if (!post) {
    return null;
  }

  const url = new URL(post.url, baseUrl.href).href;

  const blogPosting: BlogPosting = {
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image ? new URL(post.image, baseUrl.href).href : undefined,
    datePublished: post.date.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Person',
      name: owner,
      url: 'https://techwithanirudh.com/',
    },
  };

  const breadcrumbList: BreadcrumbList = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeTitle,
        item: baseUrl.href,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${homeTitle} | Posts`,
        item: new URL('/posts', baseUrl.href).href,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: url,
      },
    ],
  };

  const graph: Graph = {
    '@context': 'https://schema.org',
    '@graph': [blogPosting, breadcrumbList],
  };

  return (
    <script
      type='application/ld+json'
      // biome-ignore lint/security/noDangerouslySetInnerHtml:
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
};

export const TagJsonLd = ({ tag }: { tag: string }) => {
  const breadcrumbList: BreadcrumbList = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeTitle,
        item: baseUrl.href,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${homeTitle} | Tags`,
        item: new URL('/tags', baseUrl.href).href,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${homeTitle} | Posts tagged with ${tag}`,
        item: new URL(`/tags/${tag}`, baseUrl.href).href,
      },
    ],
  };

  const graph: Graph = {
    '@context': 'https://schema.org',
    '@graph': [breadcrumbList],
  };

  return (
    <script
      type='application/ld+json'
      // biome-ignore lint/security/noDangerouslySetInnerHtml:
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
};
