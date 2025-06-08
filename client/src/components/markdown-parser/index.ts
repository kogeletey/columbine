import { remark } from 'remark'

import { headerToMarkdown, markdownToHeader } from './BlockTypeParsers/HeaderTypeParser'
import { parseMarkdownToParagraph, parseParagraphToMarkdown } from './BlockTypeParsers/ParagraphTypeParser'
import { parseListToMarkdown, parseMarkdownToList } from './BlockTypeParsers/ListTypeParser'
import { parseDelimiterToMarkdown, parseMarkdownToDelimiter } from './BlockTypeParsers/DelimiterTypeParser'
import { parseCodeToMarkdown, parseMarkdownToCode } from './BlockTypeParsers/CodeTypeParser'
import { parseMarkdownToQuote, parseQuoteToMarkdown } from './BlockTypeParsers/QuoteTypeParser'
import { parseImageToMarkdown } from './BlockTypeParsers/ImageTypeParser'
import { parseCheckboxToMarkdown } from './BlockTypeParsers/CheckboxTypeParser'
import { OutputBlockData, OutputData } from '@editorjs/editorjs'

export default class EditorJSMarkdownConverter {
  public static toBlocks(data: string): OutputBlockData[] {
    const editorData: (OutputBlockData | undefined)[] = []
    const parsedMarkdown = remark.parse(data)

    // Iterating over the pared remarkjs syntax tree and executing the json parsers
    parsedMarkdown.children.forEach((item) => {
      switch (item.type) {
        case 'heading':
          return editorData.push(markdownToHeader(item))
        case 'paragraph':
          return editorData.push(...parseMarkdownToParagraph(item))
        case 'list':
          return editorData.push(parseMarkdownToList(item))
        case 'thematicBreak':
          return editorData.push(parseMarkdownToDelimiter())
        case 'code':
          return editorData.push(parseMarkdownToCode(item))
        case 'blockquote':
          return editorData.push(parseMarkdownToQuote(item))
        default:
          break
      }
    })

    // Filter through array and remove empty objects
    return editorData.filter((value) => typeof value !== 'undefined') as OutputBlockData[]
  }

  public static toMarkdown(data: OutputData['blocks']) {
    const parsedData = data.map((item) => {
      // iterate through editor data and parse the single blocks to markdown syntax
      switch (item.type) {
        case 'header':
          return headerToMarkdown(item.data)
        case 'paragraph':
          return parseParagraphToMarkdown(item.data)
        case 'list':
          return parseListToMarkdown(item.data)
        case 'delimiter':
          return parseDelimiterToMarkdown()
        case 'image':
          return parseImageToMarkdown(item.data)
        case 'quote':
          return parseQuoteToMarkdown(item.data)
        case 'checkbox':
          return parseCheckboxToMarkdown(item.data)
        case 'code':
          return parseCodeToMarkdown(item.data)
        case 'checklist':
          return parseCheckboxToMarkdown(item.data)
        default:
          break
      }
    })

    return parsedData.join('\n')
  }
}
