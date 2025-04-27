import { Task } from "@lit/task"
import { html, LitElement, unsafeCSS } from "lit"
import { customElement, property } from "lit/decorators.js"
import { parse } from "rss-to-json"

@customElement("rsshub-feed")
export class RssHubFeed extends LitElement {
  feed: any

  constructor() {
    super()
  }

  @property({ type: String })
  url: string

  parseFromUrl = new Task(this, {
    task: async ([url]) => {
      const parseContent = await parse(url)
      return parseContent.items
    },
    args: () => [this.url],
  })

  render() {
    return this.parseFromUrl.render({
      complete: feedItems =>
        html`
        ${feedItems.map((item) => {
            return html`
                <article>
                <h1>${item.title}</h1>
         </article>
        `
          })
        }`,
    })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "rsshub-feed": RssHubFeed
  }
}
