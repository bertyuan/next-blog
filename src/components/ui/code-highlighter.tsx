import { codeToHtml } from 'shiki';

export async function CodeHighlighter({ language, code }: { language: string; code: string }) {
  const cleanCode = code ? String(code).trim() : '';

  try {
    const html = await codeToHtml(cleanCode, {
      lang: language || 'text',
      themes: {
        light: 'catppuccin-latte',
        dark: 'catppuccin-mocha',
      },
    });

    return (
      <div className='my-6 overflow-hidden rounded-lg border border-border'>
        <div className='flex bg-muted px-4 py-2 text-xs uppercase text-muted-foreground'>
          {language}
        </div>
        <div
          className='shiki-block text-sm [&>pre]:overflow-x-auto [&>pre]:p-4'
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki `codeToHtml` returns escaped, trusted syntax-highlighting markup for code snippets.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  } catch {
    // Unsupported language or Shiki error: fall back to plain preformatted block.
    return (
      <div className='my-6 overflow-hidden rounded-lg border border-border'>
        <div className='flex bg-muted px-4 py-2 text-xs uppercase text-muted-foreground'>
          {language}
        </div>
        <pre className='overflow-x-auto bg-muted p-4 font-mono text-sm'>
          <code>{cleanCode}</code>
        </pre>
      </div>
    );
  }
}