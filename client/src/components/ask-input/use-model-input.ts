import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import type { AIMessageChunk } from "@langchain/core/messages";
import { businessPlanSystemPrompt } from "@/prompts-template/business-plan";

const llm = new ChatOpenAI({
    model: 'deepseek/deepseek-chat-v3-0324:free',
    configuration: {
        baseURL: 'https://openrouter.ai/api/v1',
    },
    apiKey: import.meta.env.PUBLIC_OPENROUTER_API_KEY,
})

export async function useClientModelInput(text: string): Promise<AIMessageChunk> {
        const messages = [
            new HumanMessage({ content: text }),
            new SystemMessage({ content: businessPlanSystemPrompt })
        ]
        const completion = await llm.invoke(messages)
        return completion
  }
