import {
  PostComments,
  Share,
} from '@/app/(main)/(home)/posts/[slug]/page.client';
import { PostJsonLd } from '@/components/json-ld';
import { RichText } from '@/components/rich-text';
import { Section } from '@/components/section';
import { TagCard } from '@/components/tags/tag-card';
import { createMetadata } from '@/lib/metadata';
import {
  getPostBySlug,
  getAllPostSlugs,
  type BlogPost,
} from '@/lib/payload-posts';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Balancer from 'react-wrap-balancer';
import { description as homeDescription } from '@/app/(main)/layout.config';

function PostHeader(props: { post: BlogPost }) {
  const { post } = props;

  return (
    <Section className="p-4 lg:p-6">
      <div
        className={cn(
          'flex flex-col items-start justify-center gap-4 py-8 md:gap-6',
          'sm:items-center sm:rounded-lg sm:border sm:bg-muted/70 sm:px-8 sm:py-20 sm:shadow-xs sm:dark:bg-muted'
        )}
      >
        <div className="flex flex-col gap-2 sm:text-center md:gap-4">
          <h1 className="max-w-4xl font-bold text-3xl leading-tight tracking-tight sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
            <Balancer>{post.title}</Balancer>
          </h1>
          <p className="mx-auto max-w-4xl">
            <Balancer>{post.description}</Balancer>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <TagCard name={tag} key={tag} className=" border border-border " />
          ))}
        </div>
      </div>
    </Section>
  );
}

function PostContent({ post }: { post: BlogPost }) {
  return (
    <>
      <PostHeader post={post} />

      <Section className="h-full" sectionClassName="flex flex-1">
        <article className="flex min-h-full flex-col lg:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            <RichText
              content={post.content as Record<string, unknown>}
              className="flex-1 px-4"
              enableProse={true}
            />
            <PostComments
              slug={post.slug}
              className="[&_form>div]:!rounded-none rounded-none border-0 border-border/70 border-t border-dashed dark:border-border"
            />
          </div>
          <div className="flex flex-col gap-4 p-4 text-sm lg:sticky lg:top-[4rem] lg:h-[calc(100vh-4rem)] lg:w-[250px] lg:self-start lg:overflow-y-auto lg:border-border/70 lg:border-l lg:border-dashed lg:dark:border-border">
            <div>
              <p className="mb-1 text-fd-muted-foreground">Written by</p>
              <p className="font-medium">{post.author}</p>
            </div>
            <div>
              <p className="mb-1 text-fd-muted-foreground text-sm">Created At</p>
              <p className="font-medium">{post.date.toDateString()}</p>
            </div>
            <div>
              <p className="mb-1 text-fd-muted-foreground text-sm">Updated At</p>
              <p className="font-medium">{post.updatedAt.toDateString()}</p>
            </div>
            <Share url={post.url} />
          </div>
        </article>
      </Section>
      <PostJsonLd post={post} />
    </>
  );
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <PostContent post={post} />;
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {};
  }

  return createMetadata({
    title: post.title,
    description: post.description || homeDescription,
    openGraph: {
      url: `/posts/${post.slug}`,
      images: post.image ? [{ url: post.image }] : undefined,
    },
    alternates: {
      canonical: `/posts/${post.slug}`,
    },
  });
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}
