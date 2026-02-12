
import { GoogleGenAI, Type } from "@google/genai";
import { GroundingChunk, Asset } from '../types';
import { FinancialEngine } from '../utils/math';
import { gerarDadosMockDeterministico } from '../data/acoesB3';

export class GeminiService {
  private getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private cleanJsonResponse(text: string): any {
    try {
      if (!text) return null;
      let clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const firstChar = clean.indexOf('{');
      const lastChar = clean.lastIndexOf('}');
      if (firstChar !== -1 && lastChar !== -1) {
        clean = clean.substring(firstChar, lastChar + 1);
      }
      return JSON.parse(clean);
    } catch (e) {
      return null;
    }
  }

  async discoverAndSyncAsset(ticker: string): Promise<Partial<Asset>> {
    const ai = this.getClient();
    const formattedTicker = ticker.includes('.SA') ? ticker : `${ticker}.SA`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise técnica profunda e preço em tempo real para o ticker ${formattedTicker} da B3. Forneça dados fundamentalistas atuais.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              price: { type: Type.NUMBER },
              name: { type: Type.STRING },
              dy: { type: Type.STRING },
              pl: { type: Type.NUMBER },
              pvp: { type: Type.NUMBER },
              sector: { type: Type.STRING }
            },
            required: ["price", "name"]
          },
          systemInstruction: "Você é um terminal financeiro de elite. Use a busca para extrair dados precisos da B3/CVM.",
        },
      });

      const data = this.cleanJsonResponse(response.text);
      if (data && data.price) {
        return FinancialEngine.analyze({
          ticker: ticker.replace('.SA', ''),
          currentPrice: data.price,
          nome: data.name,
          dy: data.dy || '0%',
          pl: data.pl || 0,
          pvp: data.pvp || 0,
          setor: data.sector || 'Geral',
          type: ticker.length <= 5 ? 'Ação' : 'FII',
          quantity: 0, averagePrice: 0,
          tags: ["#AI_Verified"]
        } as Asset);
      }
    } catch (e) {
      console.warn("IA Discovery Fail, using fallback logic.");
    }

    return FinancialEngine.analyze(gerarDadosMockDeterministico(ticker) as Asset);
  }

  async analyzeMarket(query: string, context?: string) {
    const ai = this.getClient();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Contexto da Carteira: ${context}\n\nConsulta: ${query}`,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "Analista Financeiro Vantez. Forneça insights baseados em dados reais de mercado via busca."
        },
      });
      return {
        text: response.text || "Sem resposta da IA no momento.",
        sources: (response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[]) || []
      };
    } catch (error) {
      return { text: "Sistema de IA momentaneamente indisponível.", sources: [] };
    }
  }

  async getNewsFeed() {
    const ai = this.getClient();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Liste as 5 notícias financeiras mais impactantes do Brasil hoje.",
        config: { 
          tools: [{ googleSearch: {} }], 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                tag: { type: Type.STRING },
                time: { type: Type.STRING },
                title: { type: Type.STRING },
                source: { type: Type.STRING },
                content: { type: Type.STRING }
              },
              required: ["title", "content"]
            }
          }
        }
      });
      return this.cleanJsonResponse(response.text) || [];
    } catch (e) {
      return [];
    }
  }

  async generateReportContent(topic: string, summary: string): Promise<string> {
    const ai = this.getClient();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Gere um relatório de research profissional sobre: ${topic}. Dados consolidados: ${summary}.`,
        config: { systemInstruction: "Especialista em Research de Investimentos B3." }
      });
      return response.text || "Conteúdo não pôde ser gerado.";
    } catch (error) {
      return "Falha na geração de relatório.";
    }
  }
}

export const geminiService = new GeminiService();
