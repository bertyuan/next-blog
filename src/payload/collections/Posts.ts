import type { CollectionConfig } from 'payload';
import { CodeBlock } from '../blocks/CodeBlock';
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical';


export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'posts',
    plural: 'posts',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'example：my-first-post',
      },
    },
    {
      name: 'description',
      label: 'description',
      type: 'textarea',
    },
      {
          name: 'content',
          label: 'content',
          type: 'richText',
          required: true,
          editor: lexicalEditor({
              features: ({ defaultFeatures }) => [
                  ...defaultFeatures, // 保留原有的加粗、标题、列表等基础功能
                  BlocksFeature({
                      blocks: [CodeBlock], // 将代码块注册到编辑器中
                  }),
              ],
          }),
      },
    {
      name: 'featuredImage',
      label: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'author',
      label: 'author',
      type: 'text',
      defaultValue: 'Admin',
    },
    {
      name: 'tags',
      label: 'tag',
      type: 'array',
      fields: [
        {
          name: 'tag',
          label: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'status',
      label: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'draft', value: 'draft' },
        { label: 'published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      label: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
};
