import { GoogleGenAI, Type } from "@google/genai";
import { GroundingChunk, Asset } from '../types';
import { FinancialEngine } from '../utils/math';
import { gerarDadosMockDeterministico } from '../data/acoesB3';

export class GeminiService {
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

  private async buscarDeBrapi(ticker: string): Promise<any> {
    try {
      const response = await fetch(`https://brapi.dev/api/quote/${ticker}?token=demo`);
      if (!response.ok) return null;
      const data = await response.json();
      const result = data.results[0];
      if (!result) return null;
      return {
        price: result.regularMarketPrice,
        name: result.longName,
        change: result.regularMarketChangePercent,
        source: 'brapi.dev'
      };
    } catch (e) {
      return null;
    }
  }

  async discoverAndSyncAsset(ticker: string): Promise<Partial<Asset>> {
    const formattedTicker = ticker.includes('.SA') ? ticker : `${ticker}.SA`;
    
    if (!process.env.API_KEY || process.env.API_KEY === 'YOUR_KEY_HERE') {
      return FinancialEngine.analyze(gerarDadosMockDeterministico(ticker) as Asset);
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analise técnica e preço atual para ${formattedTicker} da B3. Retorne em JSON.`,
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
          systemInstruction: "Você é um terminal financeiro de elite. Forneça dados precisos da B3 via busca.",
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
      console.debug("IA Discover Fail, fallback to APIs/Mock");
    }

    const brapiData = await this.buscarDeBrapi(ticker);
    if (brapiData) {
      return FinancialEngine.analyze({
        ticker,
        nome: brapiData.name,
        currentPrice: brapiData.price,
        change: brapiData.change,
        type: ticker.length <= 5 ? 'Ação' : 'FII',
        quantity: 0, averagePrice: 0,
        tags: ["#B3_Direct"]
      } as Asset);
    }

    return FinancialEngine.analyze(gerarDadosMockDeterministico(ticker) as Asset);
  }

  async analyzeMarket(query: string, context?: string) {
    if (!process.env.API_KEY) return { text: "Modo Offline.", sources: [] };
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Contexto: ${context}\n\nAnalise: ${query}`,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: "Analista Financeiro Vantez. Use busca para notícias e dados atuais B3/CVM."
        },
      });
      return {
        text: response.text || "Sem resposta.",
        sources: (response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[]) || []
      };
    } catch (error) {
      return { text: "IA indisponível.", sources: [] };
    }
  }

  async getNewsFeed() {
    if (!process.env.API_KEY) return [];
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || "teste_123" });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Liste 5 notícias financeiras críticas do Brasil hoje. JSON com id, tag, time, title, source, content.",
        config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json" }
      });
      const data = this.cleanJsonResponse(response.text);
      return Array.isArray(data) ? data : (data?.noticias || []);
    } catch (e) {
      return [];
    }
  }

  async generateReportContent(topic: string, summary: string): Promise<string> {
    if (!process.env.API_KEY) return "Indisponível.";
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Gere um relatório profissional sobre ${topic}. Sumário de dados: ${summary}.`,
        config: { systemInstruction: "Especialista em Research Financeiro." }
      });
      return response.text || "Conteúdo não gerado.";
    } catch (error) {
      return "Falha na geração.";
    }
  }
}

export const geminiService = new GeminiService();