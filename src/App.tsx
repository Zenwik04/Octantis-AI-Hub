import React, { useState } from 'react';
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

  // 1. GENERAR OPORTUNIDADES
  const handleGenerateOpportunities = async (data: ChallengeState) => {
    setIsLoading(true);
    setChallengeData(data);

    try {
      const response = await fetch('/api/generate-opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scope: data.scope,
          description: data.description,
          criteria: data.criteria
        }),
      });

      if (!response.ok) {
        throw new Error('Error al generar oportunidades');
      }

      const result = await response.json();
      setOpportunities(result.opportunities);
      setView('exploration');
    } catch (error) {
      console.error("Error generating opportunities:", error);
      alert("Hubo un error al generar las oportunidades. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. PRIORIZAR (BUSINESS CASE)
  const handlePrioritize = async (id: string) => {
    const opp = opportunities.find(o => o.id === id);
    if (!opp || !challengeData) return;

    setSelectedOpportunity(opp);
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-business-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          opportunity: opp,
          challengeData: challengeData
        }),
      });

      if (!response.ok) {
        throw new Error('Error al generar business case');
      }

      const result = await response.json();
      setBusinessCaseData(result.businessCase);
      setView('businessCase');

    } catch (error) {
      console.error("Error generating business case:", error);
      alert("Error generando el análisis estratégico.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. GENERAR ROADMAP
  const handleGenerateRoadmap = async () => {
    if (!selectedOpportunity || !businessCaseData || !challengeData) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          opportunity: selectedOpportunity,
          businessCaseData: businessCaseData,
          challengeData: challengeData
        }),
      });

      if (!response.ok) {
        throw new Error('Error al generar roadmap');
      }

      const result = await response.json();
      setRoadmapData(result.roadmap);
      setView('roadmap');

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
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none print:hidden"></div>
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none print:hidden"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none print:hidden"></div>

      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10 print:py-0 print:px-8">
        
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
