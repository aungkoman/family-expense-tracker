
import { GoogleGenAI, Type } from "@google/genai";
import type { Category } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development and will be handled by the environment in production.
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const expenseSchema = {
    type: Type.OBJECT,
    properties: {
      description: {
        type: Type.STRING,
        description: "A concise description of the expense.",
      },
      amount: {
        type: Type.NUMBER,
        description: "The numerical amount of the expense.",
      },
      categorySuggestion: {
        type: Type.STRING,
        description: "The name of the most relevant category for this expense from the provided list.",
      },
    },
    required: ["description", "amount", "categorySuggestion"],
};

export interface ParsedExpense {
  description: string;
  amount: number;
  categorySuggestion: string;
}

export const parseExpenseFromText = async (
  text: string,
  categories: Category[]
): Promise<ParsedExpense | null> => {
    if(!API_KEY) {
        return null;
    }

  const categoryNames = categories.map(c => c.name).join(', ');

  const prompt = `
    Parse the following user input to extract expense details.
    The input is: "${text}"

    Identify the description, the amount, and suggest the most relevant expense category from this list: [${categoryNames}].
    If no category seems to fit, suggest "Uncategorized".

    Return the result as a JSON object matching the provided schema. Do not include any other text or markdown formatting in your response.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: expenseSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedData = JSON.parse(jsonString);
    
    return parsedData as ParsedExpense;

  } catch (error) {
    console.error("Error parsing expense with Gemini:", error);
    return null;
  }
};
