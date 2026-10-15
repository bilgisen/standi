// Minimal markdown -> Lexical converter for blog seed content.
// Supports: paragraphs, ## / ### headings, and **bold** inline segments.
// Output shape matches src/app/(frontend)/[lang]/blog/[slug]/page.tsx renderNode.

export interface LexicalTextNode {
  type: 'text'
  text: string
  format: number
  detail: number
  mode: 'normal'
  style: string
  version: 1
}

export interface LexicalElementNode {
  type: 'paragraph' | 'heading'
  level?: number
  children: LexicalTextNode[]
  version: 1
}

export interface LexicalRoot {
  root: {
    type: 'root'
    version: 1
    children: LexicalElementNode[]
    direction: null
    format: ''
    indent: 0
  }
}

function textRun(text: string, bold: boolean): LexicalTextNode {
  return {
    type: 'text',
    text,
    format: bold ? 1 : 0,
    detail: 0,
    mode: 'normal',
    style: '',
    version: 1,
  }
}

function inline(text: string): LexicalTextNode[] {
  const parts = text.split('**')
  const out: LexicalTextNode[] = []
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (!part) continue
    out.push(textRun(part, i % 2 === 1))
  }
  if (out.length === 0) out.push(textRun('', false))
  return out
}

export function markdownToLexical(markdown: string): LexicalRoot {
  const children: LexicalElementNode[] = []
  const blocks = markdown.replace(/\r\n/g, '\n').split(/\n{2,}/)
  for (const raw of blocks) {
    const block = raw.trim()
    if (!block) continue
    const singleLine = block.replace(/\n/g, ' ').trim()
    if (singleLine.startsWith('### ')) {
      children.push({ type: 'heading', level: 3, children: inline(singleLine.slice(4).trim()), version: 1 })
    } else if (singleLine.startsWith('## ')) {
      children.push({ type: 'heading', level: 2, children: inline(singleLine.slice(3).trim()), version: 1 })
    } else if (singleLine.startsWith('# ')) {
      children.push({ type: 'heading', level: 1, children: inline(singleLine.slice(2).trim()), version: 1 })
    } else {
      children.push({ type: 'paragraph', children: inline(singleLine), version: 1 })
    }
  }
  return {
    root: {
      type: 'root',
      version: 1,
      children,
      direction: null,
      format: '',
      indent: 0,
    },
  }
}
