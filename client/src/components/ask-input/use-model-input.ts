import OpenAI from "openai";


const model = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: import.meta.env.PUBLIC_OPENROUTER_API_KEY,
    defaultHeaders: {
    'HTTP-Referer': 'https://localhost',
    'X-Title': 'Columine',
    },
    dangerouslyAllowBrowser: true
})

export default async function useModelInput(text: string) {
    const completion = await model.chat.completions.create({
    model: 'deepseek/deepseek-chat-v3-0324:free',
    messages: [
      {
        role: 'user',
        content: text,
      },
    ],
  });
  return completion.choices[0].message
}
