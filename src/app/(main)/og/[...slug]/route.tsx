import { generateOGImage } from '@/app/(main)/og/[...slug]/og';
import { getPostBySlug, getAllPostSlugs } from '@/lib/payload-posts';
import type { ImageResponse } from 'next/og';
import { notFound } from 'next/navigation';

async function loadAssets(): Promise<
  { name: string; data: Buffer; weight: 400 | 600; style: 'normal' }[]
> {
  const [
    { base64Font: normal },
    { base64Font: mono },
    { base64Font: semibold },
  ] = await Promise.all([
    import('./fonts/geist-regular-otf.json').then((mod) => mod.default || mod),
    import('./fonts/geistmono-regular-otf.json').then(
      (mod) => mod.default || mod,
    ),
    import('./fonts/geist-semibold-otf.json').then((mod) => mod.default || mod),
  ]);

  return [
    {
      name: 'Geist',
      data: Buffer.from(normal, 'base64'),
      weight: 400 as const,
      style: 'normal' as const,
    },
    {
      name: 'Geist Mono',
      data: Buffer.from(mono, 'base64'),
      weight: 400 as const,
      style: 'normal' as const,
    },
    {
      name: 'Geist',
      data: Buffer.from(semibold, 'base64'),
      weight: 600 as const,
      style: 'normal' as const,
    },
  ];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
): Promise<ImageResponse> {
  const { slug } = await params;
  const postSlug = slug[0];

  if (!postSlug) {
    notFound();
  }

  const post = await getPostBySlug(postSlug);

  if (!post) {
    notFound();
  }

  const fonts = await loadAssets();

  return generateOGImage({
    title: post.title,
    description: post.description,
    fonts,
  });
}

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug: [slug, 'image.png'] }));
}
