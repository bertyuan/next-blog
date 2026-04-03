import type { Block } from 'payload';

export const CodeBlock: Block = {
    slug: 'codeBlock',
    labels: {
        singular: 'Code Block',
        plural: 'Code Blocks',
    },
    fields: [
        {
            name: 'language',
            label: 'Language',
            type: 'select',
            required: true,
            defaultValue: 'cpp',
            options: [
                { label: 'C++', value: 'cpp' },
                { label: 'Python', value: 'python' },
                { label: 'JavaScript', value: 'javascript' },
                { label: 'TypeScript', value: 'typescript' },
                { label: 'HTML', value: 'html' },
                { label: 'CSS', value: 'css' },
                { label: 'JSON', value: 'json' },
                { label: 'Bash/Shell', value: 'bash' },
            ],
        },
        {
            name: 'code',
            label: 'Code Content',
            type: 'code',
            required: true,
            admin: {
                language: 'cpp',
            },
        },
    ],
};