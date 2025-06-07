import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import type { AIMessageChunk } from "@langchain/core/messages";

const llm = new ChatOpenAI({
    model: 'deepseek/deepseek-chat-v3-0324:free',
    configuration: {
        baseURL: 'https://openrouter.ai/api/v1',
    },
    apiKey: import.meta.env.PUBLIC_OPENROUTER_API_KEY,
})

export async function useModelInput(text: string): Promise<AIMessageChunk> {
    const completion = await llm.invoke([
        new HumanMessage({ content: text }),
    ]);
    return completion
}
