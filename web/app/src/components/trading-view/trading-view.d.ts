import type {
    BlockToolConstructorOptions,
} from "@editorjs/editorjs/types/tools"

export type ChartConfig = {
    type: string
    resolution: string
}

export type InputData = {
    unit: string
    pools: string
    chart: ChartConfig
}

export type DataParams = {
    search: string
}

export type TradingViewParams = BlockToolConstructorOptions<DataParams>
