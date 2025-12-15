import { postsPerPage } from '@/app/(main)/layout.config';
import { NumberedPagination } from '@/components/numbered-pagination';
import { PostCard } from '@/components/posts/post-card';
import { Section } from '@/components/section';
import { createMetadata } from '@/lib/metadata';
import { getPublishedPosts } from '@/lib/payload-posts';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound, redirect } from 'next/navigation';

const CurrentPostsCount = ({
  startIndex,
  endIndex,
  totalPosts,
}: {
  startIndex: number;
  endIndex: number;
  totalPosts: number;
}) => {
  const start = startIndex + 1;
  const end = endIndex < totalPosts ? endIndex : totalPosts;
  if (start === end) return <span>({start})</span>;
  return (
    <span>
      ({start}-{end})
    </span>
  );
};

const Pagination = ({
  pageIndex,
  pageCount,
}: {
  pageIndex: number;
  pageCount: number;
}) => {
  const handlePageChange = async (page: number) => {
    'use server';
    redirect(`/posts?page=${page}`);
  };

  return (
    <Section className='bg-dashed'>
      <NumberedPagination
        currentPage={pageIndex + 1}
        totalPages={pageCount}
        paginationItemsToDisplay={5}
        onPageChange={handlePageChange}
      />
    </Section>
  );
};

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const pageIndex = searchParams.page
    ? Number.parseInt(
        Array.isArray(searchParams.page)
          ? searchParams.page[0] ?? ''
          : searchParams.page,
        10
      ) - 1
    : 0;

  // 获取文章（带分页）
  const { posts, totalDocs, totalPages } = await getPublishedPosts({
    limit: postsPerPage,
    page: pageIndex + 1,
  });

  if (pageIndex < 0 || (totalPages > 0 && pageIndex >= totalPages)) notFound();

  const startIndex = pageIndex * postsPerPage;
  const endIndex = startIndex + posts.length;

  return (
    <>
      <Section className='p-4 lg:p-6'>
        <h1 className='font-bold text-3xl leading-tight tracking-tighter md:text-4xl'>
          All {totalDocs} Posts{' '}
          <CurrentPostsCount
            startIndex={startIndex}
            endIndex={endIndex}
            totalPosts={totalDocs}
          />
        </h1>
      </Section>
      <Section className='h-full' sectionClassName='flex flex-1'>
        <div className='grid divide-y divide-dashed divide-border/70 text-left dark:divide-border'>
          {posts.map((post) => {
            const date = post.date.toDateString();
            return (
              <PostCard
                title={post.title}
                description={post.description}
                image={post.image}
                url={post.url}
                date={date}
                key={post.id}
                author={post.author}
                tags={post.tags}
              />
            );
          })}
        </div>
      </Section>
      {totalPages > 1 && <Pagination pageIndex={pageIndex} pageCount={totalPages} />}
    </>
  );
}

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const searchParams = await props.searchParams;

  const pageIndex = searchParams.page
    ? Number.parseInt(searchParams.page as string, 10)
    : 1;

  const isFirstPage = pageIndex === 1 || !searchParams.page;
  const pageTitle = isFirstPage ? 'Posts' : `Posts - Page ${pageIndex}`;
  const canonicalUrl = isFirstPage ? '/posts' : `/posts?page=${pageIndex}`;

  return createMetadata({
    title: pageTitle,
    description: `Posts${!isFirstPage ? ` - Page ${pageIndex}` : ''}`,
    openGraph: {
      url: canonicalUrl,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  });
}
