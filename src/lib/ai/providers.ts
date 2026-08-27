import OpenAI from "openai";

export type AIProvider = "openai" | "claude" | "gemini" | "groq" | "deepseek";

export type GenerateResearchInput = {
  provider: AIProvider;
  prompt: string;
  system?: string;
};

export async function generateResearchBrief({ provider, prompt, system }: GenerateResearchInput) {
  if (provider !== "openai") {
    return {
      provider,
      text: `${provider} adapter is configured as a production extension point. Add the provider SDK/key and map this function to its chat or responses API.`
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      provider,
      text: "OPENAI_API_KEY is not configured. The AI layer is wired, but live generation is disabled in this environment."
    };
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: system ?? "You are a rigorous AGI research analyst. Be structured, causal, and concrete." },
      { role: "user", content: prompt }
    ],
    temperature: 0.4
  });

  return {
    provider,
    text: response.choices[0]?.message.content ?? ""
  };
}
