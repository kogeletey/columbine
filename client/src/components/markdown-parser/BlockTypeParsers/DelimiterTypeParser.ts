import { OutputBlockData } from '@editorjs/editorjs'

export function parseDelimiterToMarkdown() {
  const delimiter = '---'

  return delimiter.concat('\n')
}

export function parseMarkdownToDelimiter() {
  let delimiterData = {} as OutputBlockData

  delimiterData = {
    data: {
      items: [],
    },
    type: 'delimiter',
  }

  return delimiterData
}
