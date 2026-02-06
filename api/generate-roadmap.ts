import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { opportunity, businessCaseData, challengeData } = req.body;

    const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });
    
    const prompt = `
      Actúa como un Consultor de Implementación Senior de Octantis.
      Genera un 'Roadmap de Implementación' detallado para el proyecto: "${opportunity.title}".
      
      Contexto del Business Case: "${businessCaseData.summary}".
      Reto original: "${challengeData.description}".

      Estructura el plan en estas 3 Fases obligatorias:
      1. Fase de Validación Lean (Propuesta de valor, cliente).
      2. Piloto de Validación Tecnológica (MVP, pruebas reales).
      3. Despliegue y Escalado.

      Para cada fase, genera:
      - Duración estimada (ej: "3 meses").
      - 2 Tareas críticas muy específicas.
      - 1 Hito de validación principal (KPI clave).
      - Recursos clave (ej: "Partner de Cloud", "Equipo Data Science", "CapEx $50k").

      Finalmente, añade una lista de "Próximos Pasos (Próximas 48h)" con 2 acciones inmediatas para el consultor.
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
            phases: {
              type: "OBJECT",
              properties: {
                validation: {
                  type: "OBJECT",
                  properties: {
                    phaseName: { type: "STRING", enum: ["Validación Lean"] },
                    duration: { type: "STRING" },
                    tasks: { type: "ARRAY", items: { type: "STRING" } },
                    kpi: { type: "STRING" },
                    resources: { type: "STRING" }
                  },
                  required: ["duration", "tasks", "kpi", "resources"]
                },
                pilot: {
                  type: "OBJECT",
                  properties: {
                    phaseName: { type: "STRING", enum: ["Piloto Tecnológico"] },
                    duration: { type: "STRING" },
                    tasks: { type: "ARRAY", items: { type: "STRING" } },
                    kpi: { type: "STRING" },
                    resources: { type: "STRING" }
                  },
                  required: ["duration", "tasks", "kpi", "resources"]
                },
                scaling: {
                  type: "OBJECT",
                  properties: {
                    phaseName: { type: "STRING", enum: ["Despliegue y Escalado"] },
                    duration: { type: "STRING" },
                    tasks: { type: "ARRAY", items: { type: "STRING" } },
                    kpi: { type: "STRING" },
                    resources: { type: "STRING" }
                  },
                  required: ["duration", "tasks", "kpi", "resources"]
                }
              },
              required: ["validation", "pilot", "scaling"]
            },
            nextSteps48h: { type: "ARRAY", items: { type: "STRING" } }
          },
          required: ["phases", "nextSteps48h"]
        }
      }
    });

    const text = typeof response.text === 'function' ? response.text() : response.text;
    const roadmap = JSON.parse(text);
    roadmap.opportunityId = opportunity.id;
    
    roadmap.phases.validation.phaseName = "Validación Lean";
    roadmap.phases.pilot.phaseName = "Piloto Tecnológico";
    roadmap.phases.scaling.phaseName = "Despliegue y Escalado";

    return res.status(200).json({ roadmap });

  } catch (error) {
    console.error('Error generating roadmap:', error);
    return res.status(500).json({ error: 'Error generating roadmap' });
  }
}
