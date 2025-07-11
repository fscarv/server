import { GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const model = 'gemini-2.5-flash';

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: 'Transcreva o áudio para pt-BR. Seja preciso e natural na transcrição. Mantenha a pontuação adequada e divida o texto em parágrafos quando for aprimorado.'
      },
      {
        inlineData: {
          mimeType,
          data: audioAsBase64,
        },
      }
    ],
  })

  if (!response.text) {
    throw new Error('Transcrição falhou')
  }

  return response.text
}

export async function generateEmbeddings(text: string) {
  const response = await gemini.models.embedContent({
    model: 'text-embedding-004',
    contents: [{ text }],
    config: {
      taskType: 'RETRIEVAL_DOCUMENT',
    }
  })

  if (!response.embeddings?.[0].values) {
    throw new Error('Embeddings falharam')
  }

  return response.embeddings[0].values
}