import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { opportunity, challengeData } = req.body;

    const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });
    
    const prompt = `
      Actúa como un Consultor Estratégico Senior (nivel McKinsey/BCG) para Octantis.
      Genera un 'Business Case Express' de alto nivel para la oportunidad: "${opportunity.title}".
      
      Contexto: "${challengeData.scope}" - "${challengeData.description}".
      Descripción oportunidad: "${opportunity.description}".

      Analiza y genera los siguientes datos estructurados:
      
      1. MÉTRICAS (1-10):
         - Mercado Potencial
         - Factibilidad Tecnológica
         - Ventaja Competitiva
         - **Estratégico / Foso Defensivo** (Strategic Moat)

      2. RIESGOS CLASIFICADOS (Breves, 1 frase):
         - Técnico
         - Regulatorio
         - De Adopción

      3. FINANCIERO:
         - Inversión Estimada (rango)
         - Impacto EBITDA (ej: "+15%")
         - **Payback Period** (ej: "18 meses")

      4. VEREDICTO DEL CONSULTOR:
         - Clasifica ÚNICAMENTE como "Quick Win" o "Strategic Bet".
         - Resumen ejecutivo de 1 línea justificando.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            opportunityId: { type: "STRING" },
            marketSizeScore: { type: "NUMBER", description: "Score 1-10" },
            techFeasibilityScore: { type: "NUMBER", description: "Score 1-10" },
            competitiveAdvantageScore: { type: "NUMBER", description: "Score 1-10" },
            strategicMoatScore: { type: "NUMBER", description: "Score 1-10" },
            risks: { 
              type: "OBJECT",
              properties: {
                technical: { type: "STRING" },
                regulatory: { type: "STRING" },
                adoption: { type: "STRING" }
              },
              required: ["technical", "regulatory", "adoption"]
            },
            estimatedInvestment: { type: "STRING" },
            ebitdaImpact: { type: "STRING" },
            paybackPeriod: { type: "STRING" },
            verdict: { type: "STRING", enum: ["Quick Win", "Strategic Bet"] },
            summary: { type: "STRING" }
          },
          required: [
            "marketSizeScore", "techFeasibilityScore", "competitiveAdvantageScore", "strategicMoatScore",
            "risks", "estimatedInvestment", "ebitdaImpact", "paybackPeriod", "verdict", "summary"
          ]
        }
      }
    });

    const text = response.text;
    const businessCase = JSON.parse(text);
    businessCase.opportunityId = opportunity.id;

    return res.status(200).json({ businessCase });

  } catch (error) {
    console.error('Error generating business case:', error);
    return res.status(500).json({ error: 'Error generating business case' });
  }
}
