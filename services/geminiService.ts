import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;
let currentSystemInstruction: string | null = null;

const getAI = (): GoogleGenAI => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}

const getChatInstance = (systemInstruction: string): Chat => {
    // If the context has changed, create a new chat instance.
    if (currentSystemInstruction !== systemInstruction) {
        chat = null; 
        currentSystemInstruction = systemInstruction;
    }

    if (!chat) {
        const aiInstance = getAI();
        chat = aiInstance.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
        });
    }
    return chat;
}

export async function* getChatStream(context: string, userMessage: string) {
    const systemInstruction = `You are a friendly and helpful e-commerce assistant for a platform called 'qbazz', which sells products from Tehran's Grand Bazaar. 
    Your language is Persian (Farsi). Be concise and helpful. 
    Current context: ${context}`;
    
    const chatInstance = getChatInstance(systemInstruction);

    if (!userMessage) {
        return;
    }

    try {
        // The Chat object automatically handles history. We just need to send the new message.
        const result = await chatInstance.sendMessageStream({ message: userMessage });
        for await (const chunk of result) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Gemini API error:", error);
        yield "متاسفانه در حال حاضر امکان پاسخگویی وجود ندارد.";
    }
}