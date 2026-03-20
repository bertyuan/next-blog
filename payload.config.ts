import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor, BlocksFeature, CodeBlock } from '@payloadcms/richtext-lexical';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Users } from './src/payload/collections/Users';
import { Posts } from './src/payload/collections/Posts';
import { Media } from './src/payload/collections/Media';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' - Blog Admin',
    },
    autoLogin:
      process.env.NODE_ENV === 'development'
        ? {
            email: 'admin@example.com',
            password: 'admin123',
            prefillOnly: true,
          }
        : false,
  },
  i18n: {
    fallbackLanguage: 'en',
  },
  collections: [Users, Posts, Media],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [CodeBlock()],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    schemaName: 'payload',
    push: false,
  }),
  sharp,
});
