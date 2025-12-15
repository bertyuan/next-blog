import { Icons } from '@/components/icons/icons';
import { PostCard } from '@/components/posts/post-card';
import { Section } from '@/components/section';
import { buttonVariants } from '@/components/ui/button';
import type { BlogPost } from '@/lib/payload-posts';
import Link from 'next/link';

interface PostsProps {
  posts: BlogPost[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <Section>
      <div className='grid divide-y divide-dashed divide-border/70 text-left dark:divide-border'>
        {posts.map((post) => (
          <PostCard
            title={post.title}
            description={post.description}
            image={post.image}
            url={post.url}
            date={post.date.toDateString()}
            key={post.id}
            author={post.author}
            tags={post.tags}
          />
        ))}
        <Link
          href='/posts'
          className={buttonVariants({
            variant: 'default',
            className: 'group rounded-none py-4 sm:py-8',
          })}
        >
          View More
          <Icons.arrowUpRight className='group-hover:-rotate-12 ml-2 size-5 transition-transform' />
        </Link>
      </div>
    </Section>
  );
}
