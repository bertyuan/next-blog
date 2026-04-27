import { describe, expect, test, vi } from 'vitest';

// Mock external dependencies
vi.mock('better-auth/react', () => ({
  createAuthClient: vi.fn(() => ({
    signIn: vi.fn(),
    signOut: vi.fn(),
    useSession: vi.fn(),
    $Infer: {
      Session: {
        user: { id: '1', email: 'test@example.com' }
      }
    }
  }))
}));

vi.mock('resend', () => ({
  Resend: vi.fn(() => ({
    contacts: {
      update: vi.fn(),
      list: vi.fn()
    },
    emails: {
      send: vi.fn()
    }
  }))
}));

vi.mock('payload', () => ({
  getPayload: vi.fn(() => ({
    find: vi.fn()
  }))
}));

describe('Supplementary Unit Tests', () => {
  describe('Authentication Client', () => {
    test('should export authentication functions', () => {
      const { signIn, signOut, useSession } = require('./auth-client');
      expect(typeof signIn).toBe('function');
      expect(typeof signOut).toBe('function');
      expect(typeof useSession).toBe('function');
    });
  });

  describe('Payload Posts', () => {
    test('transformPost should convert PayloadPost to BlogPost', () => {
      const { transformPost } = require('./payload-posts');
      
      const payloadPost = {
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
        description: 'Test description',
        content: { blocks: [] },
        featuredImage: { url: 'https://example.com/image.jpg' },
        author: 'John Doe',
        tags: [{ tag: 'tech' }, { tag: 'programming' }],
        status: 'published',
        publishedAt: '2023-01-01T00:00:00Z',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      const result = transformPost(payloadPost);

      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Post');
      expect(result.slug).toBe('test-post');
      expect(result.url).toBe('/posts/test-post');
      expect(result.image).toBe('https://example.com/image.jpg');
      expect(result.tags).toEqual(['tech', 'programming']);
    });

    test('transformPost should handle missing optional fields', () => {
      const { transformPost } = require('./payload-posts');
      
      const payloadPost = {
        id: 1,
        title: 'Test Post',
        slug: 'test-post',
        content: { blocks: [] },
        status: 'published',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };

      const result = transformPost(payloadPost);

      expect(result.description).toBe('');
      expect(result.image).toBeUndefined();
      expect(result.author).toBe('Admin');
      expect(result.tags).toEqual([]);
    });
  });

  describe('Resend Email Service', () => {
    test('getContact should find contact by email', async () => {
      const { getContact } = require('./resend');
      const { Resend } = require('resend');

      const mockContact = { id: '1', email: 'test@example.com' };
      const mockResend = {
        contacts: {
          list: vi.fn().mockResolvedValue({ data: { data: [mockContact] }, error: null })
        }
      };

      (Resend as vi.MockedClass<typeof Resend>).mockImplementation(() => mockResend as any);

      const result = await getContact({
        email: 'test@example.com',
        audienceId: 'test-audience'
      });

      expect(result).toEqual(mockContact);
    });

    test('getContact should return null when contact not found', async () => {
      const { getContact } = require('./resend');
      const { Resend } = require('resend');

      const mockResend = {
        contacts: {
          list: vi.fn().mockResolvedValue({ data: { data: [] }, error: null })
        }
      };

      (Resend as vi.MockedClass<typeof Resend>).mockImplementation(() => mockResend as any);

      const result = await getContact({
        email: 'test@example.com',
        audienceId: 'test-audience'
      });

      expect(result).toBeNull();
    });
  });

  describe('Utility Functions', () => {
    test('cn should merge class names', () => {
      const { cn } = require('./utils');
      expect(cn('px-2', 'px-4')).toBe('px-4');
      expect(cn('text-sm', false && 'hidden', undefined, 'font-medium')).toBe('text-sm font-medium');
    });

    test('isActive should detect active routes', () => {
      const { isActive } = require('./is-active');
      expect(isActive('/posts/test', '/posts/test')).toBe(true);
      expect(isActive('/posts', '/posts/test')).toBe(true);
      expect(isActive('/about', '/posts/test')).toBe(false);
    });

    test('generateMetadata should create valid metadata', () => {
      const { generateMetadata } = require('./metadata');
      const result = generateMetadata({
        title: 'Test Title',
        description: 'Test Description',
        alternates: { canonical: 'https://example.com' }
      });

      expect(result.title).toBe('Test Title');
      expect(result.description).toBe('Test Description');
    });
  });

  describe('Validators', () => {
    test('NewsletterSchema should validate email', () => {
      const { NewsletterSchema } = require('./validators');
      
      const validResult = NewsletterSchema.safeParse({ email: 'test@example.com' });
      expect(validResult.success).toBe(true);

      const invalidResult = NewsletterSchema.safeParse({ email: 'invalid-email' });
      expect(invalidResult.success).toBe(false);
    });
  });
});
