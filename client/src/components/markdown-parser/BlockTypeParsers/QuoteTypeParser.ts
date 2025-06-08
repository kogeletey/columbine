import { BlockToolData, OutputBlockData } from '@editorjs/editorjs'
import { Blockquote } from 'mdast'

export function parseQuoteToMarkdown(blocks: BlockToolData) {
  return `> ${blocks.text}\n`
}

export function parseMarkdownToQuote(content: Blockquote) {
  let quoteData = {} as OutputBlockData

  content.children.forEach((item) => {
    // @fixme bug here, other types of blocks should be converted together.
    if (item.type === 'paragraph' || item.type === 'heading') {
      item.children.forEach((listItem) => {
        if (listItem.type === 'text') {
          quoteData = {
            data: {
              alignment: 'left',
              caption: '',
              text: listItem.value,
            },
            type: 'quote',
          }
        }
      })
    }
  })

  return quoteData
}
