import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import type { ReactNode } from 'react';

// 先配置 mock，再 import 被测模块 —— 这是 ESM 测试的关键顺序
vi.mock('fumadocs-ui/components/inline-toc', () => ({
  InlineTOC: ({ items, className }: any) => (
    <nav data-testid='inline-toc' data-item-count={items?.length} className={className} />
  ),
}));

vi.mock('@/app/(main)/(home)/posts/[slug]/page.client', () => ({
  PostComments: ({ slug, className }: any) => (
    <div data-testid='post-comments' data-slug={slug} className={className}>
      Comments for {slug}
    </div>
  ),
}));

vi.mock('./section', () => ({
  Section: ({ children, className, sectionClassName, ...props }: any) => (
    <section data-testid='section' className={sectionClassName} {...props}>
      <div className={className}>{children}</div>
    </section>
  ),
}));

// 用 top-level import 获取被测组件（ESM 标准做法）
import MdxLayout from './mdx-layout';

describe('MdxLayout', () => {
  test('renders the title in a level-1 heading', () => {
    render(
      <MdxLayout title='Hello World' slug='hello-world'>
        <p>Body content</p>
      </MdxLayout>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Hello World');
  });

  test('renders children content', () => {
    render(
      <MdxLayout title='Test' slug='test'>
        <p data-testid='child-paragraph'>Paragraph text</p>
      </MdxLayout>,
    );

    expect(screen.getByTestId('child-paragraph')).toBeInTheDocument();
    expect(screen.getByText('Paragraph text')).toBeInTheDocument();
  });

  test('renders InlineTOC when toc items are provided', () => {
    render(
      <MdxLayout
        title='With TOC'
        slug='with-toc'
        toc={[
          { title: 'Intro', url: '#intro', depth: 2 },
          { title: 'Setup', url: '#setup', depth: 2 },
        ]}
      >
        <p>Content</p>
      </MdxLayout>,
    );

    const toc = screen.getByTestId('inline-toc');
    expect(toc).toBeInTheDocument();
    expect(toc).toHaveAttribute('data-item-count', '2');
  });

  test('does not render InlineTOC when toc is null', () => {
    render(
      <MdxLayout title='No TOC' slug='no-toc' toc={null}>
        <p>Content</p>
      </MdxLayout>,
    );

    expect(screen.queryByTestId('inline-toc')).not.toBeInTheDocument();
  });

  test('does not render InlineTOC when toc array is empty', () => {
    render(
      <MdxLayout title='Empty TOC' slug='empty-toc' toc={[]}>
        <p>Content</p>
      </MdxLayout>,
    );

    expect(screen.queryByTestId('inline-toc')).not.toBeInTheDocument();
  });

  test('renders PostComments when comments prop is true', () => {
    render(
      <MdxLayout title='Comments On' slug='comments-on' comments>
        <p>Content</p>
      </MdxLayout>,
    );

    const comments = screen.getByTestId('post-comments');
    expect(comments).toBeInTheDocument();
    expect(comments).toHaveAttribute('data-slug', 'comments-on');
    expect(comments).toHaveTextContent('Comments for comments-on');
  });

  test('does not render PostComments when comments prop is false', () => {
    render(
      <MdxLayout title='Comments Off' slug='comments-off' comments={false}>
        <p>Content</p>
      </MdxLayout>,
    );

    expect(screen.queryByTestId('post-comments')).not.toBeInTheDocument();
  });

  test('does not render PostComments when comments prop is omitted', () => {
    render(
      <MdxLayout title='No Comments Prop' slug='no-comments'>
        <p>Content</p>
      </MdxLayout>,
    );

    expect(screen.queryByTestId('post-comments')).not.toBeInTheDocument();
  });

  test('wraps content in article and section elements', () => {
    const { container } = render(
      <MdxLayout title='Structure' slug='structure'>
        <p>Content</p>
      </MdxLayout>,
    );

    expect(container.querySelector('article')).toBeInTheDocument();
    expect(container.querySelectorAll('section')).toHaveLength(2);
  });
});