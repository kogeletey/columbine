import type { EditorConfig } from "@editorjs/editorjs"
import { ColPlotBlock } from "@/components/col-plot/col-plot.block"
import { RssHubFeed } from "@/components/rsshub-feed/rsshub-feed.block"
import { SuperInputBlock } from "@/components/super-input/super-input.block.ts"
import { TradingViewBlock } from "@/components/trading-view/trading-view.block.ts"
import Header from "@editorjs/header"

export const editorDefineConfig: EditorConfig = {
  autofocus: true,
  tools: {
    header: {
      class: Header,
      inlineToolbar: true,
    },
    tradingView: {
      class: TradingViewBlock,
    },
    ColPlotBlock,
    SuperInputBlock,
    RssHubFeed,
  },
}
