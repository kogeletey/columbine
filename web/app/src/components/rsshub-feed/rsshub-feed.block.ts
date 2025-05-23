import type { API } from "@editorjs/editorjs"
import type {
  BlockToolConstructorOptions,
} from "@editorjs/editorjs/types/tools"
import "@/components/rsshub-feed/rsshub-feed"

export type RssHubFeedParams = BlockToolConstructorOptions

export class RssHubFeed {
  private api: API
  constructor({ api }: RssHubFeedParams) {
    this.api = api
  }

  static get toolbox() {
    return {
      title: "RssHubFeed",
    }
  }

  render() {
    const wrapper = document.createElement("rsshub-feed")
    wrapper.setAttribute("url", "https://mshibanami.github.io/GitHubTrendingRSS/daily/typescript.xml")
    return wrapper
  }
}
