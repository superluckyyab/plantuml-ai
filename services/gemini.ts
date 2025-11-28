import { GoogleGenAI } from "@google/genai";

const AI_API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: AI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert PlantUML Architect.
Your goal is to modify existing PlantUML code based on user requests.
You must output ONLY the raw PlantUML code.
Do not wrap the code in markdown code blocks (e.g. \`\`\`plantuml ... \`\`\`).
Do not provide any conversational text, explanations, or preambles.
If the user request is unclear, try to infer the best diagram modification.
Preserve existing logic unless asked to change it.
Ensure the syntax is valid PlantUML.
`;

export const generatePlantUML = async (
  currentCode: string,
  userPrompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Current Code:\n${currentCode}\n\nUser Request: ${userPrompt}\n\nOutput only the updated PlantUML code.`
            }
          ]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for code determinism
      }
    });

    let text = response.text || '';
    
    // Cleanup in case the model ignores the "no markdown" rule
    text = text.replace(/^```plantuml\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '');
    
    return text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
