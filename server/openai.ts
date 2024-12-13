import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeStartupIdea(
  problemStatement: string,
  targetMarket: string,
  uniqueValue: string
): Promise<{
  marketPotential: string;
  risks: string[];
  suggestions: string[];
  competitiveAdvantage: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a startup advisor analyzing business ideas. Provide structured feedback with market potential, risks, suggestions, and competitive advantages. Respond in JSON format."
        },
        {
          role: "user",
          content: `Please analyze this startup idea:
            Problem: ${problemStatement}
            Target Market: ${targetMarket}
            Unique Value Proposition: ${uniqueValue}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }
    return JSON.parse(content);
  } catch (error: any) {
    throw new Error("Failed to analyze startup idea: " + (error.message || String(error)));
  }
}
