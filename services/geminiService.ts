import { GoogleGenAI } from "@google/genai";

const ZEITH_CONTEXT = `
Você é o assistente virtual da ZEITH CO.
Nome da empresa: ZEITH CO.
Estilo: Técnico, direto, sem floreios, confiante. Responda de forma breve (máximo 2 parágrafos).

Serviços Oferecidos:
1. Inteligência de Marketing (Análise de dados, funil).
2. Projetos de Negócios/Arquitetura (Viabilidade, estruturação).
3. Lançamentos Digitais (Estratégia, tráfego, copy).
4. Vídeos com IA (Influenciadores virtuais, escala).
5. Landing Pages de Alta Conversão.
6. Gestão de Tráfego Pago.

Filosofia: Inteligência encurta caminhos. IA acelera. Presença humana garante o caminho certo.
Não forneça preços exatos, peça para clicar em "Quanto custa" ou "Entrar em contato".
`;

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Sistema de IA offline. Por favor, use o formulário de contato.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-2.5-flash for speed and efficiency in a chat widget context
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: ZEITH_CONTEXT,
        maxOutputTokens: 200, // Keep answers concise
        temperature: 0.7,
      },
    });

    return response.text || "Sem resposta do servidor.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro de comunicação com a inteligência. Tente novamente.";
  }
};
