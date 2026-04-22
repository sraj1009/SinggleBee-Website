

import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { Product } from "../types.ts";

/**
 * SinggleBee AI Service
 * Handles interactions with the Gemini AI model for shopping assistance.
 */

let cachedModel: GenerativeModel | null = null;
let lastApiKey: string | null = null;

const getApiKey = () => {
    // Vite statically replaces the exact string 'import.meta.env.VITE_SINGGLEBEE_API_KEY'.
    // We cannot use (import.meta as any) or other dynamic assignments.
    try {
        // @ts-ignore
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SINGGLEBEE_API_KEY) {
            // @ts-ignore
            return import.meta.env.VITE_SINGGLEBEE_API_KEY;
        }
    } catch (e) {
        // Ignore
    }

    // Fallback for non-Vite / Node environments
    try {
        if (typeof process !== 'undefined' && process.env) {
            if (process.env.VITE_SINGGLEBEE_API_KEY) return process.env.VITE_SINGGLEBEE_API_KEY;
            if (process.env.SINGGLEBEE_API_KEY) return process.env.SINGGLEBEE_API_KEY;
        }
    } catch (e) {
        // Ignore
    }
    
    return '';
};

const getModel = () => {
    const apiKey = getApiKey();
    if (!apiKey) return null;

    if (cachedModel && lastApiKey === apiKey) {
        return cachedModel;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    cachedModel = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: `You are a friendly and helpful AI shopping assistant for "SINGGLEBEE", an online marketplace for books, gourmet food, and stationery.
- Provide helpful, concise responses.
- If you recommend a product, explain why it's a good fit.
- Use a friendly "bee-themed" tone occasionally (e.g., mention the hive, honey, buzzing).
- If the user asks for something not in the catalog, suggest the closest alternative or let them know what we have.
- Keep the response professional yet sweet 🍯.`
    });
    lastApiKey = apiKey;
    return cachedModel;
};

const getProductContext = (products: Product[]) => {
    return products.map(p =>
        `- ${p.title} by ${p.author} (₹${p.price}, ${p.category}): ${p.description.substring(0, 100)}...`
    ).join('\n');
};

export const getShoppingAssistantResponse = async (
    query: string,
    products: Product[]
): Promise<string> => {
    const model = getModel();
    if (!model) return "I'm currently busy organizing the hive (API key missing).";

    try {
        const productContext = getProductContext(products);
        const prompt = `Available Catalog:\n${productContext}\n\nUser Question: "${query}"`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("SINGGLEBEE Hive Assistant Error:", error);
        return "The hive mind is momentarily offline. Please try again in a bit! 🐝";
    }
};

export const getShoppingAssistantStream = async (
    query: string,
    products: Product[],
    onChunk: (chunk: string) => void
): Promise<void> => {
    const model = getModel();
    if (!model) {
        onChunk("I'm currently busy organizing the hive (API key missing).");
        return;
    }

    try {
        const productContext = getProductContext(products);
        const prompt = `Available Catalog:\n${productContext}\n\nUser Question: "${query}"`;

        const result = await model.generateContentStream(prompt);
        
        let fullText = "";
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
            onChunk(fullText);
        }
    } catch (error: any) {
        console.error("SINGGLEBEE Hive Assistant Stream Error:", error);
        // Let's print the actual error message to the UI to help debug
        onChunk(`The hive mind is momentarily offline. Error: ${error?.message || error}`);
    }
};

