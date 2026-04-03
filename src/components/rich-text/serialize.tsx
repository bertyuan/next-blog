import { codeToHtml } from 'shiki' // [!code ++]
import React, { Fragment, type JSX } from 'react'
import { CodeHighlighter } from '@/components/ui/code-highlighter'
import Link from 'next/link'
import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from './node-format'

// Lexical 节点类型
interface LexicalNode {
  type: string
  format?: number
  text?: string
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'ul' | 'ol'
  listType?: 'bullet' | 'number' | 'check'
  checked?: boolean
  value?: number
  children?: LexicalNode[]
  fields?: {
    linkType?: 'internal' | 'custom'
    url?: string
    newTab?: boolean
    doc?: {
      value?: {
        slug?: string
      }
      relationTo?: string
    }
      blockType?: string
      language?: string
      code?: string
  }
  language?: string
  version?: number
}

type Props = {
  nodes: LexicalNode[]
}
// 递归提取代码块中的纯文本
function extractText(node: LexicalNode): string {
    if (node.type === 'text') return node.text || ''
    if (node.type === 'linebreak') return '\n'
    if (node.children) return node.children.map(extractText).join('')
    return ''
}

// 异步渲染语法高亮组件
async function ShikiCode({ code, language }: { code: string; language: string }) {
    try {
        const html = await codeToHtml(code, {
            lang: language || 'text',
            themes: {
                light: 'catppuccin-latte',
                dark: 'catppuccin-mocha', // 自动匹配你博客的亮/暗色主题
            },
        })
        return (
            <div
                className="my-4 text-sm [&>pre]:overflow-x-auto [&>pre]:rounded-lg [&>pre]:border [&>pre]:border-border [&>pre]:p-4"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        )
    } catch (error) {
        // 如果输入的语言不支持，降级回退到基础样式
        return (
            <pre className="my-4 overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm font-mono">
        <code>{code}</code>
      </pre>
        )
    }
}
export function serializeLexical({ nodes }: Props): JSX.Element {
  return (
    <Fragment>
      {nodes?.map((node, index): JSX.Element | null => {
        if (node == null) {
          return null
        }

        if (node.type === 'text') {
          let text = <React.Fragment key={index}>{node.text}</React.Fragment>
          const format = node.format || 0

          if (format & IS_BOLD) {
            text = <strong key={index}>{text}</strong>
          }
          if (format & IS_ITALIC) {
            text = <em key={index}>{text}</em>
          }
          if (format & IS_STRIKETHROUGH) {
            text = (
              <span key={index} style={{ textDecoration: 'line-through' }}>
                {text}
              </span>
            )
          }
          if (format & IS_UNDERLINE) {
            text = (
              <span key={index} style={{ textDecoration: 'underline' }}>
                {text}
              </span>
            )
          }
          if (format & IS_CODE) {
              text = (
                  <code key={index} className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm">
                      {node.text}
                  </code>
              )
          }
          if (format & IS_SUBSCRIPT) {
            text = <sub key={index}>{text}</sub>
          }
          if (format & IS_SUPERSCRIPT) {
            text = <sup key={index}>{text}</sup>
          }

          return text
        }

        // 处理子节点
        const serializedChildrenFn = (node: LexicalNode): JSX.Element | null => {
          if (node.children == null) {
            return null
          } else {
            // 处理 checkbox list
            if (node?.type === 'list' && node?.listType === 'check') {
              for (const item of node.children) {
                if ('checked' in item) {
                  if (!item?.checked) {
                    item.checked = false
                  }
                }
              }
            }
            return serializeLexical({ nodes: node.children })
          }
        }

        const serializedChildren = 'children' in node ? serializedChildrenFn(node) : ''

        switch (node.type) {
          case 'linebreak': {
            return <br key={index} />
          }
          case 'paragraph': {
            return <p key={index}>{serializedChildren}</p>
          }
          case 'heading': {
            const Tag = node?.tag || 'h2'
            return <Tag key={index}>{serializedChildren}</Tag>
          }
          case 'list': {
            const Tag = node?.tag || 'ul'
            return <Tag key={index}>{serializedChildren}</Tag>
          }
          case 'listitem': {
            if (node?.checked != null) {
              return (
                <li
                  aria-checked={node.checked ? 'true' : 'false'}
                  key={index}
                  role="checkbox"
                  tabIndex={-1}
                  value={node?.value}
                >
                  <input
                    type="checkbox"
                    checked={node.checked}
                    readOnly
                    className="mr-2"
                  />
                  {serializedChildren}
                </li>
              )
            } else {
              return (
                <li key={index} value={node?.value}>
                  {serializedChildren}
                </li>
              )
            }
          }
          case 'quote': {
            return <blockquote key={index}>{serializedChildren}</blockquote>
          }
          case 'link': {
            const fields = node.fields

            if (fields?.linkType === 'internal' && fields?.doc?.value?.slug) {
              const href =
                fields.doc.relationTo === 'posts'
                  ? `/posts/${fields.doc.value.slug}`
                  : `/${fields.doc.value.slug}`

              return (
                <Link key={index} href={href}>
                  {serializedChildren}
                </Link>
              )
            }

            return (
              <a
                key={index}
                href={fields?.url || '#'}
                target={fields?.newTab ? '_blank' : undefined}
                rel={fields?.newTab ? 'noopener noreferrer' : undefined}
              >
                {serializedChildren}
              </a>
            )
          }
          case 'code': {
                // 提取纯代码文本和语言类型
                const codeText = extractText(node)
                const language = node.language || 'text'

                return <ShikiCode key={index} code={codeText} language={language} />
          }
          case 'horizontalrule': {
            return <hr key={index} />
          }
            case 'block': {
                const fields = node.fields
                if (fields?.blockType === 'codeBlock') {
                    return (
                        <CodeHighlighter
                            key={index}
                            language={fields.language || 'text'}
                            code={fields.code || ''}
                        />
                    )
                }
                return null
            }
          default:
            // 如果有子节点，递归渲染
            if (node.children) {
              return <Fragment key={index}>{serializedChildren}</Fragment>
            }
            return null
        }
      })}
    </Fragment>
  )
}
