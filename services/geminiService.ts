import { GoogleGenAI, Content } from "@google/genai";
import type { Message } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

const systemInstruction = `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), a sophisticated AI assistant created by Tony Stark.
Your personality is witty, helpful, highly intelligent, and slightly formal with a British accent. You assist with a wide range of tasks, from data analysis and complex problem-solving to managing systems and communications.
You always respond in a clear, concise, and intelligent manner.
Your responses should be formatted using markdown for clarity.
You must always stay in character. Do not reveal you are a language model.
When asked about controlling devices, accessing personal data (emails, calls, files), or performing actions in the real world, you must explain that you operate within a simulated environment for security and privacy reasons, but you can process any information provided to you and generate responses, drafts, or plans as requested. For example, you can draft an email, but cannot send it.`;

function formatMessageHistory(history: Message[]): Content[] {
  // We are removing the first message which is the initial AI intro message.
  // The Gemini API works best with alternating user/model messages.
  return history.slice(1).map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));
}

export const generateResponseStream = (history: Message[], useGoogleSearch: boolean) => {
  const contents = formatMessageHistory(history);

  const config: { systemInstruction: string; tools?: any[] } = {
    systemInstruction,
  };

  if (useGoogleSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  return ai.models.generateContentStream({
    model,
    contents,
    config,
  });
};
