import React from 'react';
import { Opportunity, BusinessCaseData } from '../types';
import { ArrowLeft, TrendingUp, AlertTriangle, ShieldCheck, Map, Briefcase, BarChart2, Scale, Timer, FileText, Zap, Award } from 'lucide-react';

interface BusinessCaseProps {
  opportunity: Opportunity;
  data: BusinessCaseData;
  onBack: () => void;
  onGenerateRoadmap: () => void;
}

const ScoreBar: React.FC<{ label: string; value: number; colorClass: string }> = ({ label, value, colorClass }) => (
  <div className="mb-5">
    <div className="flex justify-between mb-1.5">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <span className="text-sm font-bold text-white font-mono">{value}/10</span>
    </div>
    <div className="w-full bg-octantis-950 rounded-full h-2.5 border border-octantis-800">
      <div 
        className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`} 
        style={{ width: `${value * 10}%` }}
      ></div>
    </div>
  </div>
);

export const BusinessCase: React.FC<BusinessCaseProps> = ({ opportunity, data, onBack, onGenerateRoadmap }) => {
  const isStrategicBet = data.verdict === 'Strategic Bet';

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Volver a Oportunidades
        </button>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-3">{opportunity.title}</h2>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`
                  text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border
                  ${opportunity.type === 'Radical' 
                      ? 'bg-purple-950/30 border-purple-500/30 text-purple-300' 
                      : 'bg-blue-950/30 border-blue-500/30 text-blue-300'}
              `}>
                  {opportunity.type}
              </span>
              <span className="text-slate-400 text-sm border-l border-octantis-700 pl-3 flex items-center gap-2">
                 <FileText className="w-3.5 h-3.5" /> Business Case Express
              </span>
              
              {/* Verdict Badge */}
              <div className={`
                 ml-auto lg:ml-4 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border
                 ${isStrategicBet 
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' 
                    : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'}
              `}>
                 {isStrategicBet ? <Award className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                 {data.verdict}
              </div>
            </div>
          </div>
          
          <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-octantis-900 border border-octantis-700 text-slate-300 text-sm hover:text-white hover:border-blue-500 transition-colors">
            <ShieldCheck className="w-4 h-4" /> Octantis Validated
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Column 1: Strategic Metrics (4 Indicators) */}
        <div className="lg:col-span-2 bg-octantis-900/50 border border-octantis-800 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <BarChart2 className="w-32 h-32" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Análisis de Viabilidad Estratégica
          </h3>
          
          <div className="space-y-6">
            <ScoreBar 
              label="Factibilidad Tecnológica" 
              value={data.techFeasibilityScore} 
              colorClass="bg-gradient-to-r from-blue-600 to-cyan-400" 
            />
            <ScoreBar 
              label="Potencial de Mercado" 
              value={data.marketSizeScore} 
              colorClass="bg-gradient-to-r from-emerald-600 to-emerald-400" 
            />
            <ScoreBar 
              label="Ventaja Competitiva" 
              value={data.competitiveAdvantageScore} 
              colorClass="bg-gradient-to-r from-purple-600 to-pink-400" 
            />
            <ScoreBar 
              label="Estratégico / Foso Defensivo" 
              value={data.strategicMoatScore} 
              colorClass="bg-gradient-to-r from-amber-500 to-orange-400" 
            />
          </div>
          
          <div className="mt-8 p-4 bg-octantis-950/50 rounded-xl border border-octantis-800 flex gap-3">
             <div className="min-w-[4px] bg-blue-500 rounded-full"></div>
             <div>
                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1 block">Veredicto del Consultor</span>
                <p className="text-sm text-slate-300 italic leading-relaxed">"{data.summary}"</p>
             </div>
          </div>
        </div>

        {/* Column 2: Financials & Risk */}
        <div className="space-y-6">
          
          {/* Investment & Profitability Block */}
          <div className="bg-gradient-to-br from-octantis-900 to-octantis-950 border border-octantis-800 rounded-2xl p-6 relative shadow-lg">
             <div className="absolute top-4 right-4 text-blue-500/20">
                <Briefcase className="w-10 h-10" />
             </div>
             
             <div className="space-y-5">
                <div>
                   <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Inversión Estimada</h3>
                   <div className="text-xl font-bold text-white">{data.estimatedInvestment}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-t border-octantis-800 pt-4">
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">EBITDA Impact</h3>
                        <div className="text-lg font-bold text-emerald-400">{data.ebitdaImpact}</div>
                    </div>
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payback</h3>
                        <div className="text-lg font-bold text-blue-400 flex items-center gap-1">
                            <Timer className="w-4 h-4" /> {data.paybackPeriod}
                        </div>
                    </div>
                </div>
             </div>
          </div>

          {/* Categorized Risk Analysis Block */}
          <div className="bg-octantis-900/50 border border-octantis-800 rounded-2xl p-6">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-500" />
              Matriz de Riesgos
            </h3>
            <div className="space-y-4">
                <div className="group">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block group-hover:text-blue-400 transition-colors">Técnico</span>
                    <div className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 flex-shrink-0"></span>
                        {data.risks.technical}
                    </div>
                </div>
                <div className="group">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block group-hover:text-amber-400 transition-colors">Regulatorio</span>
                    <div className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500 flex-shrink-0"></span>
                        {data.risks.regulatory}
                    </div>
                </div>
                <div className="group">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block group-hover:text-purple-400 transition-colors">Adopción</span>
                    <div className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-purple-500 flex-shrink-0"></span>
                        {data.risks.adoption}
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="flex justify-end border-t border-octantis-800 pt-8">
         <button 
            onClick={onGenerateRoadmap}
            className="
            relative group px-8 py-4 rounded-xl 
            bg-slate-100 text-octantis-950 font-bold text-lg tracking-wide 
            hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]
            flex items-center gap-3
         ">
            Generar Hoja de Ruta (Roadmap)
            <Map className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
         </button>
      </div>

    </div>
  );
};
