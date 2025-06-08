import { BlockToolData, OutputBlockData } from '@editorjs/editorjs'
import { Content, Heading } from 'mdast'

export function headerToMarkdown(blocks: BlockToolData) {
  switch (blocks.level) {
    case 1:
      return `# ${blocks.text}\n`
    case 2:
      return `## ${blocks.text}\n`
    case 3:
      return `### ${blocks.text}\n`
    case 4:
      return `#### ${blocks.text}\n`
    case 5:
      return `##### ${blocks.text}\n`
    case 6:
      return `###### ${blocks.text}\n`
    default:
      break
  }
}

export function markdownToHeader(content: Heading): OutputBlockData | undefined {
  let headerData = {} as OutputBlockData

  switch (content.depth) {
    case 1:
      content.children.forEach((item) => {
        headerData = {
          data: {
            level: 1,
            text: item.value,
          },
          type: 'header',
        }
      })

      return headerData
    case 2:
      content.children.forEach((item) => {
        headerData = {
          data: {
            level: 2,
            text: item.value,
          },
          type: 'header',
        }
      })

      return headerData
    case 3:
      content.children.forEach((item) => {
        headerData = {
          data: {
            level: 3,
            text: item.value,
          },
          type: 'header',
        }
      })

      return headerData
    case 4:
      content.children.forEach((item) => {
        headerData = {
          data: {
            level: 4,
            text: item.value,
          },
          type: 'header',
        }
      })

      return headerData
    case 5:
      content.children.forEach((item) => {
        headerData = {
          data: {
            level: 5,
            text: item.value,
          },
          type: 'header',
        }
      })

      return headerData
    case 6:
      content.children.forEach((item) => {
        headerData = {
          data: {
            level: 6,
            text: item.value,
          },
          type: 'header',
        }
      })

      return headerData
    default:
      break
  }
}
