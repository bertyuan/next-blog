import React, { Fragment, type JSX } from 'react'
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
    // Block node fields (populated by Payload BlocksFeature, e.g. CodeBlock stores blockType:'Code', language, and code)
    blockType?: string
    blockName?: string
    id?: string
    code?: string
    language?: string
  }
  language?: string
  version?: number
}

type Props = {
  nodes: LexicalNode[]
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
            text = <code key={index}>{node.text}</code>
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
          case 'block': {
            const blockFields = node.fields
            if (blockFields?.blockType === 'Code') {
              return (
                <pre key={index} className="overflow-x-auto">
                  <code
                    className={
                      blockFields.language ? `language-${blockFields.language}` : undefined
                    }
                  >
                    {blockFields.code}
                  </code>
                </pre>
              )
            }
            return null
          }
          case 'code': {
            // 代码块
            return (
              <pre key={index} className="overflow-x-auto">
                <code>{serializedChildren}</code>
              </pre>
            )
          }
          case 'horizontalrule': {
            return <hr key={index} />
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
