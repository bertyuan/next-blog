import { postsPerPage } from '@/app/(main)/layout.config';
import { Icons } from '@/components/icons/icons';
import { TagJsonLd } from '@/components/json-ld';
import { NumberedPagination } from '@/components/numbered-pagination';
import { PostCard } from '@/components/posts/post-card';
import { Section } from '@/components/section';
import { createMetadata } from '@/lib/metadata';
import { getPostsByTag, getAllTags } from '@/lib/payload-posts';
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

const Header = ({
  tag,
  startIndex,
  endIndex,
  totalPosts,
}: {
  tag: string;
  startIndex: number;
  endIndex: number;
  totalPosts: number;
}) => (
  <Section className='p-4 lg:p-6'>
    <div className='flex items-center gap-2'>
      <Icons.tag
        size={20}
        className='text-muted-foreground transition-transform hover:rotate-12 hover:scale-125'
      />
      <h1 className='font-bold text-3xl leading-tight tracking-tighter md:text-4xl'>
        {tag} <span className='text-muted-foreground'>Posts</span>{' '}
        <CurrentPostsCount
          startIndex={startIndex}
          endIndex={endIndex}
          totalPosts={totalPosts}
        />
      </h1>
    </div>
  </Section>
);

const Pagination = ({ pageIndex, tag, totalPages }: { pageIndex: number; tag: string; totalPages: number }) => {
  const handlePageChange = async (page: number) => {
    'use server';
    redirect(`/tags/${tag}?page=${page}`);
  };

  return (
    <Section className='bg-dashed'>
      <NumberedPagination
        currentPage={pageIndex + 1}
        totalPages={totalPages}
        paginationItemsToDisplay={5}
        onPageChange={handlePageChange}
      />
    </Section>
  );
};

export default async function Page(props: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const tag = params.slug[0];
  if (!tag) return notFound();

  const pageIndex = searchParams.page
    ? Number.parseInt(
        Array.isArray(searchParams.page)
          ? searchParams.page[0] ?? ''
          : searchParams.page,
        10
      ) - 1
    : 0;

  const { posts, totalDocs, totalPages } = await getPostsByTag(tag, {
    limit: postsPerPage,
    page: pageIndex + 1,
  });

  if (pageIndex < 0 || (totalPages > 0 && pageIndex >= totalPages)) notFound();

  const startIndex = pageIndex * postsPerPage;
  const endIndex = startIndex + posts.length;

  return (
    <>
      <Header tag={tag} startIndex={startIndex} endIndex={endIndex} totalPosts={totalDocs} />
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
      {totalPages > 1 && <Pagination pageIndex={pageIndex} tag={tag} totalPages={totalPages} />}
      <TagJsonLd tag={tag} />
    </>
  );
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((item) => ({ slug: [item.tag] }));
}

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const tag = params.slug[0];
  const pageIndex = searchParams.page
    ? Number.parseInt(
        Array.isArray(searchParams.page)
          ? searchParams.page[0] ?? ''
          : searchParams.page,
        10
      )
    : 1;

  const isFirstPage = pageIndex === 1 || !searchParams.page;
  const pageTitle = isFirstPage
    ? `${tag} Posts`
    : `${tag} Posts - Page ${pageIndex}`;
  const canonicalUrl = isFirstPage
    ? `/tags/${tag}`
    : `/tags/${tag}?page=${pageIndex}`;

  return createMetadata({
    title: pageTitle,
    description: `Posts tagged with ${tag}${
      !isFirstPage ? ` - Page ${pageIndex}` : ''
    }`,
    openGraph: {
      url: canonicalUrl,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  });
}
