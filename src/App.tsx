import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Header } from './components/Header';
import { ChallengeForm } from './components/ChallengeForm';
import { OpportunityExploration } from './components/OpportunityExploration';
import { BusinessCase } from './components/BusinessCase';
import { RoadmapView } from './components/RoadmapView';
import { ChallengeState, Opportunity, BusinessCaseData, RoadmapData } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'exploration' | 'businessCase' | 'roadmap'>('form');
  const [challengeData, setChallengeData] = useState<ChallengeState | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [businessCaseData, setBusinessCaseData] = useState<BusinessCaseData | null>(null);
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateOpportunities = async (data: ChallengeState) => {
    setIsLoading(true);
    setChallengeData(data);

    try {
      const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      
      const prompt = `
        Genera 5 oportunidades de innovación estratégica para un reto de "${data.scope}".
        Descripción del reto: "${data.description}".
        
        Configuración de inversor:
        - Riesgo aceptable: ${data.criteria.risk}/100
        - Horizonte temporal: ${data.criteria.timeHorizon}/100
        - Madurez tecnológica deseada: ${data.criteria.techMaturity}/100

        Para cada oportunidad, determina si es de disrupción 'Incremental' o 'Radical' basándote en el riesgo y madurez.
        Genera scores numéricos (0-100) para 'impactScore' (Impacto) y 'feasibilityScore' (Viabilidad Técnica) que sean coherentes con la descripción.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING, description: "Breve descripción de 2 líneas" },
                type: { type: Type.STRING, enum: ["Incremental", "Radical"] },
                impactScore: { type: Type.NUMBER, description: "0 to 100" },
                feasibilityScore: { type: Type.NUMBER, description: "0 to 100" },
              },
              required: ["id", "title", "description", "type", "impactScore", "feasibilityScore"]
            }
          }
        }
      });

      if (response.text) {
        const generatedOpportunities = JSON.parse(response.text) as Opportunity[];
        setOpportunities(generatedOpportunities);
        setView('exploration');
      }
    } catch (error) {
      console.error("Error generating opportunities:", error);
      alert("Hubo un error al generar las oportunidades. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrioritize = async (id: string) => {
    const opp = opportunities.find(o => o.id === id);
    if (!opp || !challengeData) return;

    setSelectedOpportunity(opp);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Actúa como un Consultor Estratégico Senior (nivel McKinsey/BCG) para Octantis.
        Genera un 'Business Case Express' de alto nivel para la oportunidad: "${opp.title}".
        
        Contexto: "${challengeData.scope}" - "${challengeData.description}".
        Descripción oportunidad: "${opp.description}".

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

        4. VERDICTO DEL CONSULTOR:
           - Clasifica ÚNICAMENTE como "Quick Win" o "Strategic Bet".
           - Resumen ejecutivo de 1 línea justificando.
      `;

      // Use gemini-3-pro-preview for complex strategic reasoning
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                opportunityId: { type: Type.STRING },
                marketSizeScore: { type: Type.NUMBER, description: "Score 1-10" },
                techFeasibilityScore: { type: Type.NUMBER, description: "Score 1-10" },
                competitiveAdvantageScore: { type: Type.NUMBER, description: "Score 1-10" },
                strategicMoatScore: { type: Type.NUMBER, description: "Score 1-10" },
                risks: { 
                  type: Type.OBJECT,
                  properties: {
                    technical: { type: Type.STRING },
                    regulatory: { type: Type.STRING },
                    adoption: { type: Type.STRING }
                  },
                  required: ["technical", "regulatory", "adoption"]
                },
                estimatedInvestment: { type: Type.STRING },
                ebitdaImpact: { type: Type.STRING },
                paybackPeriod: { type: Type.STRING },
                verdict: { type: Type.STRING, enum: ["Quick Win", "Strategic Bet"] },
                summary: { type: Type.STRING }
            },
            required: [
              "marketSizeScore", "techFeasibilityScore", "competitiveAdvantageScore", "strategicMoatScore",
              "risks", "estimatedInvestment", "ebitdaImpact", "paybackPeriod", "verdict", "summary"
            ]
          }
        }
      });

      if (response.text) {
        const data = JSON.parse(response.text) as BusinessCaseData;
        data.opportunityId = id; // Ensure ID match
        setBusinessCaseData(data);
        setView('businessCase');
      }

    } catch (error) {
        console.error("Error generating business case:", error);
        alert("Error generando el análisis estratégico.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!selectedOpportunity || !businessCaseData || !challengeData) return;
    
    setIsLoading(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
          Actúa como un Consultor de Implementación Senior de Octantis.
          Genera un 'Roadmap de Implementación' detallado para el proyecto: "${selectedOpportunity.title}".
          
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
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        opportunityId: { type: Type.STRING },
                        phases: {
                            type: Type.OBJECT,
                            properties: {
                                validation: {
                                    type: Type.OBJECT,
                                    properties: {
                                        phaseName: { type: Type.STRING, enum: ["Validación Lean"] },
                                        duration: { type: Type.STRING },
                                        tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        kpi: { type: Type.STRING },
                                        resources: { type: Type.STRING }
                                    },
                                    required: ["duration", "tasks", "kpi", "resources"]
                                },
                                pilot: {
                                    type: Type.OBJECT,
                                    properties: {
                                        phaseName: { type: Type.STRING, enum: ["Piloto Tecnológico"] },
                                        duration: { type: Type.STRING },
                                        tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        kpi: { type: Type.STRING },
                                        resources: { type: Type.STRING }
                                    },
                                    required: ["duration", "tasks", "kpi", "resources"]
                                },
                                scaling: {
                                    type: Type.OBJECT,
                                    properties: {
                                        phaseName: { type: Type.STRING, enum: ["Despliegue y Escalado"] },
                                        duration: { type: Type.STRING },
                                        tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                                        kpi: { type: Type.STRING },
                                        resources: { type: Type.STRING }
                                    },
                                    required: ["duration", "tasks", "kpi", "resources"]
                                }
                            },
                            required: ["validation", "pilot", "scaling"]
                        },
                        nextSteps48h: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["phases", "nextSteps48h"]
                }
            }
        });

        if (response.text) {
            const data = JSON.parse(response.text) as RoadmapData;
            data.opportunityId = selectedOpportunity.id;
            // Add static titles for UI consistency if model omits them or varies slightly
            data.phases.validation.phaseName = "Validación Lean";
            data.phases.pilot.phaseName = "Piloto Tecnológico";
            data.phases.scaling.phaseName = "Despliegue y Escalado";
            
            setRoadmapData(data);
            setView('roadmap');
        }

    } catch (error) {
        console.error("Error generating roadmap:", error);
        alert("Error generando el roadmap.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setView('form');
    setOpportunities([]);
    setBusinessCaseData(null);
    setRoadmapData(null);
  };

  const handleBackToExploration = () => {
    setView('exploration');
    setBusinessCaseData(null);
    setRoadmapData(null);
  }

  const handleBackToBusinessCase = () => {
    setView('businessCase');
    setRoadmapData(null);
  }

  return (
    <div className="min-h-screen w-full bg-octantis-950 text-slate-200 relative overflow-hidden font-sans print:bg-white print:text-black print:overflow-visible">
      {/* Background ambient elements - HIDDEN ON PRINT */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none print:hidden"></div>
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none print:hidden"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none print:hidden"></div>

      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10 print:py-0 print:px-8">
        
        {/* Loading Overlay */}
        {isLoading && (
            <div className="fixed inset-0 z-50 bg-octantis-950/80 backdrop-blur-sm flex flex-col items-center justify-center print:hidden">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-white font-medium animate-pulse">
                    {view === 'form' ? 'Generando Oportunidades...' : 
                     view === 'exploration' ? 'Analizando Viabilidad Financiera...' :
                     'Diseñando Roadmap de Implementación...'}
                </p>
                <p className="text-sm text-slate-500 mt-2">Consultando modelos Octantis AI...</p>
            </div>
        )}

        {view === 'form' && (
          <ChallengeForm onSubmit={handleGenerateOpportunities} isLoading={isLoading} />
        )}
        
        {view === 'exploration' && challengeData && (
            <OpportunityExploration 
              challenge={challengeData} 
              opportunities={opportunities} 
              onBack={handleBackToForm}
              onPrioritize={handlePrioritize}
            />
        )}

        {view === 'businessCase' && selectedOpportunity && businessCaseData && (
            <BusinessCase 
                opportunity={selectedOpportunity}
                data={businessCaseData}
                onBack={handleBackToExploration}
                onGenerateRoadmap={handleGenerateRoadmap}
            />
        )}

        {view === 'roadmap' && selectedOpportunity && roadmapData && (
            <RoadmapView 
                opportunity={selectedOpportunity}
                data={roadmapData}
                onBack={handleBackToBusinessCase}
            />
        )}

      </main>

      <footer className="w-full border-t border-octantis-800 py-6 mt-12 bg-octantis-950/50 print:hidden">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Octantis AI-Hub. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;