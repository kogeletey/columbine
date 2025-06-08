import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'

import { parseMarkdownToParagraph } from './ParagraphTypeParser'

export function parseHtmlToMarkdown(html) {
  const output = unified()
    .use(rehypeParse) // Parse HTML to a syntax tree
    .use(rehypeRemark) // Turn HTML syntax tree to markdown syntax tree
    .use(remarkStringify) // Serialize HTML syntax tree
    .processSync(html)

  return String(output)
}

export function parseListToMarkdown(blocks) {
  switch (blocks.style) {
    case 'unordered':
      return blocks.items
        .map((item) => `* ${parseHtmlToMarkdown(item)}`)
        .join('\n')
        .concat('\n')
    case 'ordered':
      return blocks.items
        .map((item, index) => `${index + 1} ${parseHtmlToMarkdown(item)}`)
        .join('\n')
        .concat('\n')
    default:
      break
  }

  return ''
}

export function parseMarkdownToList(listBlock) {
  const itemData = []
  listBlock.children.forEach((listItemBlock) => {
    listItemBlock.children.forEach((paragraphBlock) => {
      const paragraphJson = parseMarkdownToParagraph(paragraphBlock)
      // paragraphJson is a list at this state (of just one element in most cases)
      itemData.push(...paragraphJson.map((e) => e.data.text))
    })
  })

  return {
    data: {
      items: itemData,
      style: listBlock.ordered ? 'ordered' : 'unordered',
    },
    type: 'list',
  }
}
