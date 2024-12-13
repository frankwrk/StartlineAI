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
          content: `You are an expert startup advisor analyzing business ideas. Provide detailed feedback in the following JSON format:
{
  "marketPotential": "A detailed analysis of the market potential and opportunity size",
  "risks": ["Risk 1", "Risk 2", "Risk 3"],
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "competitiveAdvantage": "Analysis of the unique competitive advantages"
}`
        },
        {
          role: "user",
          content: `Please analyze this startup idea:
Problem Statement: ${problemStatement}
Target Market: ${targetMarket}
Unique Value Proposition: ${uniqueValue}

Provide a thorough analysis focusing on market potential, key risks, actionable suggestions, and competitive advantages.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsedContent = JSON.parse(content);
    
    // Ensure we have all required fields with proper fallbacks
    return {
      marketPotential: parsedContent.marketPotential || "No market potential analysis available",
      risks: Array.isArray(parsedContent.risks) ? parsedContent.risks : [],
      suggestions: Array.isArray(parsedContent.suggestions) ? parsedContent.suggestions : [],
      competitiveAdvantage: parsedContent.competitiveAdvantage || "No competitive advantage analysis available"
    };
  } catch (error: any) {
    console.error("OpenAI Analysis Error:", error);
    throw new Error("Failed to analyze startup idea: " + (error.message || String(error)));
  }
}