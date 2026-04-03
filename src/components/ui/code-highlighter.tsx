'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function CodeHighlighter({ language, code }: { language: string; code: string }) {
    const cleanCode = code ? String(code).trim() : '';

    return (
        <div className="my-6 overflow-hidden rounded-lg border border-border bg-[#1e1e1e]">
            {/* Top language prompt bar */}
            <div className="flex bg-black/40 px-4 py-2 text-xs text-muted-foreground uppercase">
                {language}
            </div>

            {/* Code highlighting area */}
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{ margin: 0, padding: '1rem', background: 'transparent', fontSize: '0.875rem' }}
                showLineNumbers={true}

                wrapLines={true}

                lineProps={{
                    style: { display: 'flex', alignItems: 'flex-start' }
                }}

                lineNumberStyle={{
                    minWidth: '2.5em',
                    paddingRight: '1em',
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                    color: '#858585',
                    flexShrink: 0,
                }}
            >
                {cleanCode}
            </SyntaxHighlighter>
        </div>
    );
}