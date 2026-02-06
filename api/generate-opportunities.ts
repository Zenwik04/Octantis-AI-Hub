import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { scope, description, criteria } = req.body;

    const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });
    
    const prompt = `
      Genera 5 oportunidades de innovación estratégica para un reto de "${scope}".
      Descripción del reto: "${description}".
      
      Configuración de inversor:
      - Riesgo aceptable: ${criteria.risk}/100
      - Horizonte temporal: ${criteria.timeHorizon}/100
      - Madurez tecnológica deseada: ${criteria.techMaturity}/100

      Para cada oportunidad, determina si es de disrupción 'Incremental' o 'Radical' basándote en el riesgo y madurez.
      Genera scores numéricos (0-100) para 'impactScore' (Impacto) y 'feasibilityScore' (Viabilidad Técnica) que sean coherentes con la descripción.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              id: { type: "STRING" },
              title: { type: "STRING" },
              description: { type: "STRING", description: "Breve descripción de 2 líneas" },
              type: { type: "STRING", enum: ["Incremental", "Radical"] },
              impactScore: { type: "NUMBER", description: "0 to 100" },
              feasibilityScore: { type: "NUMBER", description: "0 to 100" },
            },
            required: ["id", "title", "description", "type", "impactScore", "feasibilityScore"]
          }
        }
      }
    });

    const text = response.text;
    const opportunities = JSON.parse(text);

    return res.status(200).json({ opportunities });

  } catch (error) {
    console.error('Error generating opportunities:', error);
    return res.status(500).json({ error: 'Error generating opportunities' });
  }
}
